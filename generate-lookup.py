import gc
from io import BytesIO
import json
import requests
import numpy as np
import pandas as pd
import os


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)


ITEM_SHEET_URL = "https://docs.google.com/spreadsheets/d/104CdfaEnvhYavh6reVtpB599rCa5uzDiaO0Jtrg5qR0/export?gid=135314365&format=csv"
DROP_SHEET_BASE_URL = "https://docs.google.com/spreadsheets/d/1_SlTjrVRTgHgfS7sRqx4CeJMqlz687HdSlYqiW-JvQA/export?format=xlsx"
DROP_SHEET_NAMES = [
    "Best 5 APDrop (JP)",
    "Best 5 Droprate (JP)",
    "Best 5 APDrop (NA)",
    "Best 5 Droprate (NA)",
]

print("Fetching items", end="", flush=True)

item_df = pd.read_csv(ITEM_SHEET_URL)
item_df = item_df[item_df["Image link"].str.contains("Items/") == True]
item_dict = item_df.set_index("ID")[["NA Name", "Image link"]].T.to_dict()

del item_df

print("... Fetched.\nFetching item icons...", end=" ", flush=True)

for item_id in item_dict:
    response = requests.get(f'https://api.atlasacademy.io/nice/JP/item/{item_dict[item_id]["Image link"].split("Items/")[1].split("_")[0]}')
    response.raise_for_status()
    item_dict[item_id]["rarity"] = response.json()["background"]

gc.collect()

print("Fetched.\nFetching dropsheet", end="", flush=True)

response = requests.get(DROP_SHEET_BASE_URL)
response.raise_for_status()

excel_data = BytesIO(response.content)

image_urls = {}

all_sheets = pd.read_excel(excel_data, sheet_name=None)

print("... Loaded.", flush=True)

del excel_data

gc.collect()

result_dict = {}
rarity_order = {
    "gold": 1,
    "silver": 2,
    "bronze": 3,
    "secret gem": 4,
    "magic gem": 5,
    "gem": 6,
    "monument": 7,
    "piece": 8,
}
item_sorter = lambda x: (rarity_order.get(x["rarity"], 0), x["id"])

print(f"Sheet names: {DROP_SHEET_NAMES}\nProcesing data...", flush=True)

for sheet_name in DROP_SHEET_NAMES:
    print(f"\t{sheet_name}", end="", flush=True)

    df = all_sheets[sheet_name]

    df_cleaned = df.iloc[1:]
    # df.columns[1] # The index in the admin info sheet
    df_cleaned.columns = df_cleaned.iloc[0]
    df_cleaned = df_cleaned[df_cleaned.iloc[:, 0] != "Item"]
    df_cleaned = df_cleaned[df_cleaned.iloc[:, 8] != "1P+1L+1T"].dropna(axis=1, how="all")

    with pd.option_context("future.no_silent_downcasting", True):
        df_cleaned = df_cleaned.fillna(np.nan).replace([np.nan], [None]).reset_index(drop=True)

    columns = ["No.", "Area", "Quest", "AP", "BP/AP", "AP/Drop", "Drop Chance", "Runs"]

    sheet_list = []

    # For a particular mat, the data is stored in its row and the subsequent 4 rows, making it 5 rows in total
    for i in range(0, len(df_cleaned), 5):
        # for i in range(0, 5, 5):
        for index_base_add in [0, 14]:
            # for index_base_add in [14]:
            name = df_cleaned.iloc[i, index_base_add + 1]  # Name
            ID = df_cleaned.iloc[i, index_base_add]  # ID

            if pd.notna(name):
                sub_dict_list = []

                for j in range(i, i + 5):
                    if j < len(df_cleaned):
                        sub_dict = {
                            "No.": df_cleaned.iloc[j, index_base_add + 2],  # No.
                            "Area": df_cleaned.iloc[j, index_base_add + 4],  # Area
                            "Quest": df_cleaned.iloc[j, index_base_add + 5],  # Quest
                            "AP": df_cleaned.iloc[j, index_base_add + 6],  # AP
                            "BP/AP": df_cleaned.iloc[j, index_base_add + 7],  # BP/AP
                            "AP/Drop": df_cleaned.iloc[j, index_base_add + 8],  # AP/Drop
                            "Drop Chance": df_cleaned.iloc[j, index_base_add + 10],  # Drop Chance
                            "Runs": df_cleaned.iloc[j, index_base_add + 12],  # Runs
                        }

                        if sub_dict["Area"]:  # Otherwise there is no data
                            sub_dict_list.append(sub_dict)

                if not len(sub_dict_list):
                    continue

                rarity = item_dict[ID]["rarity"]

                if name.lower().endswith("piece"):
                    rarity = "piece"
                elif name.lower().endswith("monument"):
                    rarity = "monument"
                elif name.lower().startswith("gem"):
                    rarity = "gem"
                elif name.lower().startswith("magic gem"):
                    rarity = "magic gem"
                elif name.lower().startswith("secret gem"):
                    rarity = "secret gem"

                sheet_list.append(
                    {
                        "name": name,
                        "image": item_dict[ID]["Image link"],
                        "id": item_dict[ID]["Image link"].split("Items/")[1].split("_")[0],
                        "rarity": rarity,
                        "data": sub_dict_list,
                    }
                )

    if "APDrop" in sheet_name:
        sheet_name = sheet_name.replace("APDrop", "AP/Drop")

    result_dict[sheet_name] = sorted(sheet_list, key=item_sorter)

    print(f"... Done.", flush=True)


mats_file_name = "./assets/mats.json"

try:
    with open(mats_file_name, "w") as f:
        os.makedirs(os.path.dirname(mats_file_name), exist_ok=True)
        json.dump(result_dict, f, cls=NpEncoder)
except FileNotFoundError:
    mats_file_name = input(f"`{mats_file_name}` does not exist; provide alternate file path: ")

    with open(mats_file_name, "w") as f:
        json.dump(result_dict, f, cls=NpEncoder)


print(f"Wrote drop data to `{mats_file_name}`", flush=True)

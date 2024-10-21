import { ItemDataType, sheetNames } from "@/pages";
import styles from "@/styles/ItemTable.module.css";

const columns = ["Area", "Quest", "AP", "BP/AP", "AP/Drop", "Drop Chance (%)", "Runs"] as const;

const dailyQuestLinks = {
    "SUN: Saber Training Ground - Novice": "https://apps.atlasacademy.io/db/NA/quest/94006801/1",
    "SUN: Saber Training Ground - Inter": "https://apps.atlasacademy.io/db/NA/quest/94006802/1",
    "SUN: Saber Training Ground - Adv": "https://apps.atlasacademy.io/db/NA/quest/94006803/1",
    "SUN: Saber Training Ground - Expert": "https://apps.atlasacademy.io/db/NA/quest/94006804/1",
    "MON: Archer Training Ground - Novice": "https://apps.atlasacademy.io/db/NA/quest/94006805/1",
    "MON: Archer Training Ground - Inter": "https://apps.atlasacademy.io/db/NA/quest/94006806/1",
    "MON: Archer Training Ground - Adv": "https://apps.atlasacademy.io/db/NA/quest/94006807/1",
    "MON: Archer Training Ground - Expert": "https://apps.atlasacademy.io/db/NA/quest/94006808/1",
    "TUE: Lancer Training Ground - Novice": "https://apps.atlasacademy.io/db/NA/quest/94006809/1",
    "TUE: Lancer Training Ground - Inter": "https://apps.atlasacademy.io/db/NA/quest/94006810/1",
    "TUE: Lancer Training Ground - Adv": "https://apps.atlasacademy.io/db/NA/quest/94006811/1",
    "TUE: Lancer Training Ground - Expert": "https://apps.atlasacademy.io/db/NA/quest/94006812/1",
    "WED: Berserker Training Ground - Novice": "https://apps.atlasacademy.io/db/NA/quest/94006813/1",
    "WED: Berserker Training Ground - Inter": "https://apps.atlasacademy.io/db/NA/quest/94006814/1",
    "WED: Berserker Training Ground - Adv": "https://apps.atlasacademy.io/db/NA/quest/94006815/1",
    "WED: Berserker Training Ground - Expert": "https://apps.atlasacademy.io/db/NA/quest/94006816/1",
    "THU: Rider Training Ground - Novice": "https://apps.atlasacademy.io/db/NA/quest/94006817/1",
    "THU: Rider Training Ground - Inter": "https://apps.atlasacademy.io/db/NA/quest/94006818/1",
    "THU: Rider Training Ground - Adv": "https://apps.atlasacademy.io/db/NA/quest/94006819/1",
    "THU: Rider Training Ground - Expert": "https://apps.atlasacademy.io/db/NA/quest/94006820/1",
    "FRI: Caster Training Ground - Novice": "https://apps.atlasacademy.io/db/NA/quest/94006821/1",
    "FRI: Caster Training Ground - Inter": "https://apps.atlasacademy.io/db/NA/quest/94006822/1",
    "FRI: Caster Training Ground - Adv": "https://apps.atlasacademy.io/db/NA/quest/94006823/1",
    "FRI: Caster Training Ground - Expert": "https://apps.atlasacademy.io/db/NA/quest/94006824/1",
    "SAT: Assassin Training Ground - Novice": "https://apps.atlasacademy.io/db/NA/quest/94006825/1",
    "SAT: Assassin Training Ground - Inter": "https://apps.atlasacademy.io/db/NA/quest/94006826/1",
    "SAT: Assassin Training Ground - Adv": "https://apps.atlasacademy.io/db/NA/quest/94006827/1",
    "SAT: Assassin Training Ground - Expert": "https://apps.atlasacademy.io/db/NA/quest/94006828/1",
    "MON: Archer Training Ground - Extreme": "https://apps.atlasacademy.io/db/NA/quest/94066101/1",
    "TUE: Lancer Training Ground - Extreme": "https://apps.atlasacademy.io/db/NA/quest/94066102/1",
    "WED: Berserker Training Ground - Extreme": "https://apps.atlasacademy.io/db/NA/quest/94066103/1",
    "THU: Rider Training Ground - Extreme": "https://apps.atlasacademy.io/db/NA/quest/94066104/1",
    "FRI: Caster Training Ground - Extreme": "https://apps.atlasacademy.io/db/NA/quest/94066105/1",
    "SAT: Assassin Training Ground - Extreme": "https://apps.atlasacademy.io/db/NA/quest/94066106/1",
    "SUN: Saber Training Ground - Extreme": "https://apps.atlasacademy.io/db/NA/quest/94066107/1",
};

const ItemTable = ({ selectedItem }: { selectedItem: ItemDataType[(typeof sheetNames)[number]][number] }) => {
    return (
        <div className={styles.itemTableContainer}>
            <table className={styles.itemTable}>
                <thead>
                    <tr>
                        <th className={styles.No}>#</th>
                        {columns.map((h) => (
                            <th className={styles[h.replace(/[\. \(\)%\/]/g, "")]} key={h}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {selectedItem.data.map((row) => (
                        <tr key={row["No."]}>
                            {Object.keys(row).map((key) => {
                                let data = <>{row[key as keyof typeof row | "No."]}</>;

                                if (key === "Quest") {
                                    const href = row.Area.toLowerCase().includes("chaldea gate")
                                        ? dailyQuestLinks[row.Quest as keyof typeof dailyQuestLinks]
                                        : `https://fategrandorder.fandom.com/wiki/Free_Quests:_${encodeURIComponent(row["Area"].replace(/ /g, "_"))}#${encodeURIComponent(row["Quest"].replace(/ /g, "_"))}`;

                                    data = <a href={href}>{row.Quest}</a>;
                                }

                                return (
                                    <td className={styles[key.replace(/[\. \(\)%\/]/g, "")]} key={key}>
                                        {data}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemTable;

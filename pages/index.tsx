import itemData from "@/assets/mats.json";
import ItemSelector from "@/components/ItemSelector";
import styles from "@/styles/Home.module.css";

import Head from "next/head";

/*
 * TODO background -> normal gradient; with chaldea logo at the center, lying at the back (instead of background-image)
 * TODO Add rayshift data?
 */

export const sheetNames = ["Best 5 AP/Drop (JP)", "Best 5 Droprate (JP)", "Best 5 AP/Drop (NA)", "Best 5 Droprate (NA)"] as const;

export type ItemDataType = typeof itemData;
export type ItemType = ItemDataType[(typeof sheetNames)[number]];

export default function Home() {
    return (
        <>
            <Head>
                <title>FGO Dropsheet Lookup Tool</title>
                <meta
                    name="description"
                    content="Tool to lookup farming nodes for ascension and skill materials with data sourced from Atlas Academy's dropsheet."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className={styles.itemBox}>
                <h1 className={styles.heading}>FGO Dropsheet Lookup Tool</h1>
                <ItemSelector itemData={itemData} />
            </div>
        </>
    );
}

import { ItemDataType, sheetNames } from "@/pages";
import styles from "@/styles/ItemSelector.module.css";

import Image from "next/image";
import { useEffect, useState } from "react";

import ItemTable from "./ItemTable";

const ItemSelector = ({ itemData }: { itemData: ItemDataType }) => {
    const [selectedItem, setSelectedItem] = useState({} as ItemDataType[(typeof sheetNames)[number]][number]);
    const [selectedSheet, setSelectedSheet] = useState(sheetNames[0]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        /* If the sheet changes while an item is selected, this updates the item */

        if (!selectedItem.name) {
            return;
        }

        setSelectedItem(itemData[selectedSheet].find((item) => item.name === selectedItem.name) ?? ({} as typeof selectedItem));
    }, [itemData, selectedItem.name, selectedSheet]);

    const reset = () => {
        setIsExpanded(false);
        setSelectedItem({} as typeof selectedItem);
    };

    return (
        <>
            <div className={styles.itemContainer}>
                {/* Rarity/mat-type filters are unnecessary, too much clutter for no benefit */}
                <select
                    className={styles.sheetDropdown}
                    aria-label="Select drop category"
                    defaultValue={sheetNames[0]}
                    onChange={(e) => setSelectedSheet(e.target.value as typeof selectedSheet)}
                >
                    {sheetNames.map((sheetName) => (
                        <option key={sheetName}>{sheetName}</option>
                    ))}
                </select>
                {selectedItem.name ? (
                    <div className={styles.selectedImageContainer}>
                        <span>
                            Selected:{" "}
                            <Image
                                key={selectedItem.name}
                                className={styles.itemImage}
                                height="60"
                                width="60"
                                onClick={reset}
                                src={selectedItem.image}
                                alt={selectedItem.name}
                            />
                        </span>
                        <span
                            title={isExpanded ? "Collapse" : "Expand"}
                            className={styles.expandCollapseButton + (isExpanded ? ` ${styles.rotate90}` : "")}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            ◀
                        </span>
                    </div>
                ) : (
                    <p style={{ marginTop: "2rem" }}>Select a mat from below.</p>
                )}
                {!selectedItem.name || (selectedItem.name && isExpanded) ? (
                    <div className={styles.itemImageContainer}>
                        {itemData[selectedSheet].map((item) => (
                            <Image
                                key={item.name}
                                className={styles.itemImage + (item.name === selectedItem.name ? ` ${styles.selectedItem}` : "")}
                                height="60"
                                width="60"
                                src={item.image}
                                alt={item.name}
                                onClick={() => setSelectedItem(item)}
                            />
                        ))}
                    </div>
                ) : (
                    []
                )}
            </div>
            {selectedItem.name ? <ItemTable selectedItem={selectedItem}></ItemTable> : []}
            <button onClick={reset} className={styles.resetButton}>
                Reset
            </button>
        </>
    );
};

export default ItemSelector;

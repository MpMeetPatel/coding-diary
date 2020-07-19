import { openDB } from 'idb';

const DB_NAME = 'CODING_DB';
const VERSION = 1;

function createDB(collection, indexes) {
    return openDB(DB_NAME, VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(collection)) {
                let store = db.createObjectStore(collection, {
                    keyPath: 'id',
                });
                indexes.forEach((idx) => {
                    if (idx.unique && !idx.multipleEntries) {
                        store.createIndex(idx.key, idx.value, {
                            unique: idx.unique,
                        });
                    } else if (!idx.unique && idx.multipleEntries) {
                        store.createIndex(idx.key, idx.value, {
                            multiEntry: idx.multipleEntries,
                        });
                    } else if (idx.unique && idx.multipleEntries) {
                        store.createIndex(idx.key, idx.value, {
                            multiEntry: idx.multipleEntries,
                            unique: idx.unique,
                        });
                    } else {
                        store.createIndex(idx.key, idx.value);
                    }
                });
            }
        },
    });
}
export { createDB };


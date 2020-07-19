/* eslint-disable no-loop-func */
import React, { useState, createContext, useEffect } from 'react';
import { createDB } from './db';
import si from 'search-index';

const searchDB = function (dbName) {
    return new Promise((resolve, reject) => {
        si({ name: dbName }, (err, db) => {
            if (err) {
                reject(err);
                return;
            }

            if (db) {
                resolve(db);
            }
        });
    });
};
const COLLECTION_NAME = 'coding-diary';

// Create Context Object
export const DBContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const DBContextProvider = (props) => {
    const [db, setDb] = useState({ methods: null, db: null });

    useEffect(() => {
        createDB(COLLECTION_NAME, [
            { key: 'type', value: 'type' },
            { key: 'createdAt', value: 'createdAt' },
            { key: 'updatedAt', value: 'updatedAt' },
            { key: 'parent', value: 'parent' },
            {
                key: 'dataName',
                value: 'data.name',
                unique: true,
            },
            {
                key: 'dataTags',
                value: 'data.tags',
                multipleEntries: true,
            },
        ]).then(async (db) => {
            // Create Search Database

            const searchDatabase = await searchDB('SEARCH_DB');
            // Add to db (single item)
            let methods = {};
            if (db) {
                methods.insertOneObject = function (obj) {
                    let searchObj = {
                        type: obj.type ? obj.type.toLowerCase() : '',
                        name: obj.data.name ? obj.data.name.toLowerCase() : '',
                        tags: obj.data.tags
                            ? obj.data.tags.join(' ').toLowerCase()
                            : '',
                        _id: obj.id,
                        detail: obj.data.detail
                            ? obj.data.detail.toLowerCase()
                            : '',
                    };

                    return Promise.all([
                        db.add(COLLECTION_NAME, obj),
                        searchDatabase.PUT([searchObj]),
                    ])
                        .then(() => {
                            return obj;
                        })
                        .catch((err) => {
                            return err;
                        });
                };

                methods.insertMultipleObjects = function (arrOfObjs) {
                    const searchObjMapping = arrOfObjs.map((el) => {
                        return {
                            type: el.type ? el.type.toLowerCase() : '',
                            name: el.data.name
                                ? el.data.name.toLowerCase()
                                : '',
                            tags: el.data.tags
                                ? el.data.tags.join(' ').toLowerCase()
                                : '',
                            _id: el.id,
                            detail: el.data.detail
                                ? el.data.detail.toLowerCase()
                                : '',
                        };
                    });

                    let tx = db.transaction(COLLECTION_NAME, 'readwrite');
                    let store = tx.objectStore(COLLECTION_NAME);
                    return Promise.all(
                        arrOfObjs.map((obj) => {
                            return store.add(obj);
                        }),
                        searchDatabase.PUT(searchObjMapping),
                        tx.done
                    );
                };

                methods.deleteById = async function (id) {
                    let tx = db.transaction(COLLECTION_NAME, 'readwrite');
                    let store = tx.objectStore(COLLECTION_NAME);

                    const result = await store.get(id);
                    if (result) {
                        // MAKE SURE DELETE ON BOTH, IF MAIN DB DELETE SUCCESSFULLY
                        store.delete(result.id).then(async () => {
                            await searchDatabase.DELETE([result.id]);
                        });
                    }

                    return result;
                };

                methods.getById = function (id) {
                    let tx = db.transaction(COLLECTION_NAME, 'readonly');
                    let store = tx.objectStore(COLLECTION_NAME);
                    return store.get(id);
                };

                methods.getByIds = async function (_ids) {
                    if (!_ids || !_ids.length > 0) {
                        console.error('Provide valid id/s');
                        return;
                    }

                    let arr = _ids.map((el) => el.toLowerCase()).sort();
                    let cursor = await db
                        .transaction(COLLECTION_NAME)
                        .store.openCursor();

                    let result = [];

                    let i = 0;
                    while (cursor) {
                        while (cursor.key > arr[i]) {
                            ++i;
                            if (i === arr.length) {
                                // There is no next. Stop searching.
                                return;
                            }
                        }
                        if (cursor.key === arr[i]) {
                            // Always push before
                            result.push(cursor.value);
                            cursor = await cursor.continue();
                        } else {
                            cursor = await cursor.continue(arr[i]);
                        }
                    }
                    return result;
                };

                methods.getAndPaginateByType = async function (
                    type,
                    page = 0,
                    size = 5
                ) {
                    let skipper = size * page;
                    let limiter = size * page + size;
                    let result = [];
                    const TOTAL_DOCS = await db
                        .transaction(COLLECTION_NAME)
                        .store.index('type')
                        .count(type);

                    let cursor = await db
                        .transaction(COLLECTION_NAME)
                        .store.index('type')
                        .openCursor(type);

                    if (page !== 0) {
                        cursor = await cursor.advance(skipper);
                    }
                    while (cursor && skipper < limiter) {
                        skipper++;
                        result.push(cursor.value);
                        if (cursor.value.type === type) {
                            cursor = await cursor.continue();
                            continue;
                        } else {
                            break;
                        }
                    }
                    return { result, TOTAL_DOCS, type };
                };

                methods.getAllByType = async function (type) {
                    let tx = db.transaction(COLLECTION_NAME, 'readonly');
                    let store = tx.objectStore(COLLECTION_NAME).index('type');
                    const TOTAL_DOCS = await store.count(type);
                    let result = await store.getAll(type);

                    result = result.sort(function (a, b) {
                        return new Date(a.updatedAt) - new Date(b.updatedAt);
                    });

                    return { result, TOTAL_DOCS, type };
                };

                methods.findByName = async function (name) {
                    let tx = db.transaction(COLLECTION_NAME, 'readonly');
                    let store = tx
                        .objectStore(COLLECTION_NAME)
                        .index('dataName');

                    const result = await store.get(name);

                    return result;
                };

                methods.getAll = async function () {
                    let tx = db.transaction(COLLECTION_NAME, 'readonly');
                    let store = tx.objectStore(COLLECTION_NAME);

                    return store.getAll();
                };

                methods.findByIdAndUpdate = async function (id, dataObj) {
                    let tx = db.transaction(COLLECTION_NAME, 'readwrite');
                    let store = tx.objectStore(COLLECTION_NAME);
                    // WE HAVE TO DO 2 OPS AS WE DON"T HAVE UPDATE METHOD IN SEARCH-INDEX
                    let searchObj = {
                        type: dataObj.type ? dataObj.type.toLowerCase() : '',
                        name: dataObj.data.name
                            ? dataObj.data.name.toLowerCase()
                            : '',
                        tags: dataObj.data.tags
                            ? dataObj.data.tags.join(' ').toLowerCase()
                            : '',
                        _id: id,
                        detail: dataObj.data.detail
                            ? dataObj.data.detail.toLowerCase()
                            : '',
                    };
                    const data = await store.get(id);
                    const updateObj = { ...data, ...dataObj };
                    const resultId = await store.put(updateObj);
                    if (resultId) {
                        await searchDatabase.DELETE([resultId]);
                        await searchDatabase.PUT([searchObj]);
                    }

                    return updateObj;
                };

                methods.getDistinctTypes = async function () {
                    let cursor = await db
                        .transaction(COLLECTION_NAME)
                        .store.index('type')
                        .openCursor(null, 'nextunique');

                    let result = [];
                    while (cursor) {
                        result.push(cursor.key);
                        cursor = await cursor.continue();
                    }
                    return result;
                };

                methods.getDistinctTags = async function () {
                    let cursor = await db
                        .transaction(COLLECTION_NAME)
                        .store.index('dataTags')
                        .openCursor(null, 'nextunique');

                    let result = [];
                    while (cursor) {
                        result.push(cursor.key);
                        cursor = await cursor.continue();
                    }
                    return result;
                };

                methods.iterateOverStore = async function (arrOfFilter, type) {
                    if (!arrOfFilter || !arrOfFilter.length > 0) {
                        console.error('Provide valid filter');
                        return;
                    }
                    let arr = arrOfFilter.map((el) => el.toLowerCase()).sort();
                    let cursor = await db
                        .transaction(COLLECTION_NAME)
                        .store.index(type)
                        .openCursor();

                    let result = [];

                    let i = 0;
                    while (cursor) {
                        while (cursor.key > arr[i]) {
                            ++i;
                            if (i === arr.length) {
                                // There is no next. Stop searching.
                                return;
                            }
                        }
                        if (cursor.key === arr[i]) {
                            // Always push before
                            result.push(cursor.value);
                            cursor = await cursor.continue();
                        } else {
                            cursor = await cursor.continue(arr[i]);
                        }
                    }
                };

                methods.paginate = async function (page = 0, size = 10) {
                    let skipper = size * page;
                    let limiter = size * page + size;
                    let result = [];
                    const TOTAL_DOCS = await db
                        .transaction(COLLECTION_NAME)
                        .store.count();

                    let cursor = await db
                        .transaction(COLLECTION_NAME)
                        .store.openCursor();

                    if (page !== 0) {
                        cursor = await cursor.advance(skipper);
                    }
                    while (cursor && skipper < limiter) {
                        skipper++;
                        result.push(cursor.value);
                        cursor = await cursor.continue();
                    }
                    return { result, TOTAL_DOCS };
                };

                methods.globalSearch = async function (query) {
                    // Search in search-index db
                    return searchDatabase
                        .SEARCH(...(query ? query.split(' ') : []))
                        .then((result) => {
                            return result;
                        });
                };

                methods.getAllSearchAllTokens = async function () {
                    return searchDatabase.DICTIONARY().then((result) => {
                        return result;
                    });
                };

                methods.getAllSearchTermTokens = async function (term) {
                    return searchDatabase.DICTIONARY(term).then((result) => {
                        return result;
                    });
                };
            }

            setDb(() => ({ db, methods, searchDatabase }));
        });
    }, []);

    return (
        <DBContext.Provider value={[db, setDb]}>
            {props.children}
        </DBContext.Provider>
    );
};

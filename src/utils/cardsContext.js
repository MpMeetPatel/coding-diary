/* eslint-disable no-loop-func */
import React, {
    useState,
    createContext,
    useEffect,
    useContext,
    useCallback,
} from 'react';
import { DBContext } from './dbContext';

// Create Context Object
export const CardsContext = createContext([]);

// Create a provider for components to consume and subscribe to changes
export const CardsContextProvider = (props) => {
    const [db] = useContext(DBContext);
    const [isQueryDone, setIsQueryDone] = useState(false);
    const [cards, setCards] = useState([]);

    const setData = useCallback(async () => {
        if (db.methods) {
            let mainHolder = [];
            const types = await db.methods.getDistinctTypes();
            (async function () {
                for (const type of types) {
                    mainHolder.push(await db.methods.getAllByType(type));
                }
                setIsQueryDone(true);
                setCards(
                    mainHolder.sort(function (a, b) {
                        if (a.type < b.type) {
                            return -1;
                        }
                        if (a.type > b.type) {
                            return 1;
                        }
                        return 0;
                    })
                );
            })();
        }
    }, [db.methods]);

    useEffect(() => {
        setData();
    }, [setData]);

    return (
        <CardsContext.Provider value={{ cards, setCards, isQueryDone }}>
            {props.children}
        </CardsContext.Provider>
    );
};

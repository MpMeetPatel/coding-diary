import React, { useState, useEffect } from 'react';
import { DBContext } from '../utils/dbContext';
import { useContext } from 'react';
import { useDebounce } from '../components/useDebounce';
import { cancleIconBase64 } from '../utils/iconBase64';
import { useHistory } from 'react-router-dom';

function GlobalSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const history = useHistory();
    const [suggestions, setSuggestions] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [db] = useContext(DBContext);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (db.methods) {
            (async function () {
                const tokens = await db.methods.getAllSearchTermTokens('type');
                setSuggestions(tokens);
            })();
        }
    }, [db.methods]);

    useEffect(() => {
        if (!debouncedSearchTerm) {
            setSearchResults([]);
        } else {
            (async function () {
                const results = await db.methods.globalSearch(
                    debouncedSearchTerm ? debouncedSearchTerm.toLowerCase() : ''
                );
                setShowSuggestions(false);
                setSearchResults(results);
            })();
        }
    }, [db.methods, debouncedSearchTerm]);

    function handleChange(e) {
        setSearchTerm(e.target.value);
    }
    function handleFocus(e) {
        if (searchResults.length === 0) {
            setShowSuggestions(true);
        }
    }
    async function handleSuggestClick(suggestion) {
        const results = await db.methods.globalSearch(suggestion);
        setSearchResults(results);
        setShowSuggestions(false);
        setSearchTerm(suggestion);
    }

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: '6%',
                    left: '90%',
                    zIndex: '5555',
                }}
            >
                <img
                    src={cancleIconBase64}
                    alt="cancle-icon"
                    className={`cancle-btn-fixed bg-white px-3 py-1 rounded outline-none h-10 cursor-pointer`}
                    onClick={() => history.replace('/')}
                />
            </div>
            <div
                style={{
                    minWidth: '600px',
                    maxWidth: '800px',
                    marginTop: '-15rem',
                }}
            >
                {/* TODO -> make focus color border or somrthing */}
                <div>
                    <input
                        value={searchTerm}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        // onBlur={handleBlur}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                (async function () {
                                    const results = await db.methods.globalSearch(
                                        searchTerm
                                            ? searchTerm.toLowerCase()
                                            : ''
                                    );
                                    setShowSuggestions(false);
                                    setSearchResults(results);
                                })();
                            }
                        }}
                        placeholder="search using name, detail or tag... or just select suggestion"
                        className={`w-full mb-6 py-2 px-4 border-indigo-500 rounded`}
                    />
                </div>
                <div
                    className="rounded w-full bg-white custom-scrollbar overflow-scroll"
                    style={{ maxHeight: '60vh' }}
                >
                    {!showSuggestions && (
                        <p className="bg-indigo-100 py-4 px-8 text-center ml-3 mt-3 text-lg font-bold">
                            {searchResults.length > 0
                                ? 'Click on found results'
                                : 'No results are found'}
                        </p>
                    )}
                    {showSuggestions && (
                        <p className="bg-indigo-100 py-4 px-8 text-center ml-3 mt-3 text-lg font-bold">
                            Select below suggestions or type
                        </p>
                    )}
                    {showSuggestions && (
                        <ul className="py-2 pl-2">
                            {suggestions.map((suggestion, i) => (
                                <li
                                    onClick={() =>
                                        handleSuggestClick(suggestion)
                                    }
                                    className="py-2 px-4 cursor-pointer hover:bg-gray-300 rounded"
                                    key={`${suggestion}+${i}`}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}

                    {
                        <div className="py-4 pl-2">
                            <ul
                                className="row match-height"
                                style={{ margin: 0 }}
                            >
                                {searchResults.map((result, i) => (
                                    <li
                                        onClick={() =>
                                            history.replace(
                                                `edit/${result._id}`
                                            )
                                        }
                                        className="col w-1/2 rounded"
                                        key={`${result.obj.name}+${i}`}
                                    >
                                        <div className="px-3 py-4 rounded hover:shadow-lg m-0 cursor-pointer w-full shadow transition ease-in duration-300">
                                            <div className="font-bold text-xl mb-2">
                                                {result.obj.name}
                                            </div>
                                            <p className="text-gray-700 text-base">
                                                {result.obj.detail}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

                    {/* <div>SEARCH RESULT:</div>
                <strong>
                    <pre>{JSON.stringify(searchResults, null, 4)}</pre>
                </strong> */}
                </div>
            </div>
        </>
    );
}
export default GlobalSearch;

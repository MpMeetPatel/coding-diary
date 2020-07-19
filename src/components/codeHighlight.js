import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirrorUI } from 'react-codemirror2';
import ReactSelect from 'react-select';
import { programmingLanguages } from '../utils/langsModes';
import { deleteIconBase64 } from '../utils/iconBase64';
import '../utils/codeMirrorLangs';
import uuidV1 from 'uuid/dist/v1';

function CodeHighlight({ setSnippetsData, toggleModal, codeSnippets }) {
    const [snippets, setSnippets] = useState(
        codeSnippets && codeSnippets.length
            ? codeSnippets
            : [
                  {
                      title: '',
                      code: '',
                      selectedMode: '',
                      _id: uuidV1(),
                  },
              ]
    );

    function addSnippet() {
        setSnippets((prevSnippets) => [
            ...prevSnippets,
            { title: '', code: '', selectedMode: '', _id: uuidV1() },
        ]);
    }
    function deleteSnippet(_id) {
        setSnippets(snippets.filter((snippet) => snippet._id !== _id));
    }

    function handleSelect(_id, value) {
        let updatedSnippets = snippets.map((snippet) => {
            if (snippet._id === _id) {
                snippet.selectedMode = value;
            }
            return snippet;
        });
        setSnippets(updatedSnippets);
    }

    useEffect(() => {
        // SEND DATA ON UNMOUNT
        return () => {
            setSnippetsData(snippets);
        };
    }, [setSnippetsData, snippets]);
    return (
        <div className="py-8 px-4">
            {snippets.map((snippet) => (
                <div className="flex flex-wrap mb-4" key={snippet._id}>
                    <div className="w-full px-3 flex flex-wrap items-center">
                        <div className="mr-4 mb-4">
                            <input
                                className={`appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white border`}
                                id="grid-first-name"
                                type="text"
                                placeholder="Title"
                                value={snippet.title}
                                onChange={({ target }) => {
                                    let updatedSnippets = snippets.map(
                                        (singleSnippet) => {
                                            if (
                                                snippet._id ===
                                                singleSnippet._id
                                            ) {
                                                singleSnippet.title =
                                                    target.value;
                                            }
                                            return singleSnippet;
                                        }
                                    );
                                    setSnippets(updatedSnippets);
                                }}
                            />
                        </div>
                        <div className="w-56 mr-4 mb-4">
                            <ReactSelect
                                className="react-select"
                                classNamePrefix="react-select"
                                options={programmingLanguages}
                                value={snippet.selectedMode}
                                placeholder="Programming Language"
                                onChange={(option) =>
                                    handleSelect(snippet._id, option)
                                }
                            />
                        </div>

                        {/* <button
                            type="button"
                            onClick={() => deleteSnippet(snippet._id)}
                            style={{ height: '45px' }}
                            className="bg-red-600 text-white font-bold px-6 rounded mb-4 ml-auto"
                        >
                            delete Snippet
                        </button> */}
                        <div className="cursor-pointer bg-red-100 hover:bg-red-200 transition duration-200 ease-in-out p-2 rounded-full outline-none ml-auto mb-4">
                            <img
                                src={deleteIconBase64}
                                alt="delete-icon"
                                className="h-5"
                                onClick={() => deleteSnippet(snippet._id)}
                            />
                        </div>
                    </div>
                    <div className="w-full px-3 mb-8">
                        <CodeMirrorUI
                            value={snippet.code}
                            options={{
                                mode: snippet.selectedMode.value,
                                theme: 'material',
                                lineNumbers: true,
                            }}
                            onBeforeChange={(editor, data, value) => {
                                let updatedSnippets = snippets.map(
                                    (singleSnippet) => {
                                        if (snippet._id === singleSnippet._id) {
                                            singleSnippet.code = value;
                                        }
                                        return singleSnippet;
                                    }
                                );
                                setSnippets(updatedSnippets);
                            }}
                        />
                    </div>
                </div>
            ))}

            <div className="flex flex-wrap mb-4">
                <span className="flex w-full shadow-sm sm:ml-3 sm:mr-3  sm:w-auto">
                    <button
                        type="button"
                        onClick={addSnippet}
                        className="bg-indigo-500 text-white font-bold py-2 px-6 rounded w-full"
                    >
                        Add Snippet
                    </button>
                </span>
                <span className="mt-3 flex w-full shadow-sm sm:mt-0 sm:w-auto">
                    <button
                        onClick={toggleModal}
                        type="button"
                        className="bg-white hover:bg-indigo-500 hover:text-white text-indigo font-bold py-2 px-5 rounded w-full"
                    >
                        Cancel
                    </button>
                </span>
            </div>
        </div>
    );
}

export default CodeHighlight;

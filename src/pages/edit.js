import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelectCreatable from 'react-select/creatable';
import CodeHighlight from '../components/codeHighlight';
import CodeSnippetModal from '../components/codeSnippetModal';
import { DBContext } from '../utils/dbContext';
import { CardsContext } from '../utils/cardsContext';
import { codeIconBase64 } from '../utils/iconBase64';

export default function Edit(props) {
    const {
        register,
        errors,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
    } = useForm();
    const history = useHistory();
    const params = useParams();
    const [snippetModalOpen, setSnippetModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [typeOptions, setTypeOptions] = useState([]);
    // Tags
    const [selectedTags, setSelectedTags] = useState(null);
    const [tagsOptions, setTagsOptions] = useState([]);
    const [codeSnippets, setCodeSnippets] = useState([]);
    const [db] = useContext(DBContext);
    const { cards, setCards } = useContext(CardsContext);

    function toggleSnippetModal() {
        setSnippetModalOpen((prevState) => !prevState);
    }

    useEffect(() => {
        if (db.methods) {
            db.methods.getDistinctTypes().then((types) => {
                setTypeOptions(
                    (types || []).map((type) => ({ value: type, label: type }))
                );
            });
            db.methods.getDistinctTags().then((tags) => {
                setTagsOptions(
                    (tags || []).map((tag) => ({ value: tag, label: tag }))
                );
            });
            db.methods.getById(params.id).then((result) => {
                if (result) {
                    setValue('name', result.data.name);
                    setValue('parent', result.name);
                    setValue('detail', result.data.detail);
                    setSelectedTags(
                        result.data.tags.map((tag) => ({
                            label: tag,
                            value: tag,
                        }))
                    );
                    setCodeSnippets(result.data.codeSnippets);
                    setSelectedType({ label: result.type, value: result.type });
                }
            });
        }
    }, [db.methods, params.id, setValue]);

    function submitData(data) {
        let putObj = {
            updatedAt: new Date().toISOString(),
            data: {
                name: data.name,
                detail: data.detail,
                tags: data.tags && data.tags.map((tag) => tag.value),
                codeSnippets: codeSnippets,
            },
            parent: data.parent || null,
            type: data.typeOfCard.value || '',
            // attachments: data.attachments,
        };
        // HANDLE FILES AND SUBMIT DATA
        db.methods
            .findByIdAndUpdate(params.id, putObj)
            .then((updatedObj) => {
                console.log('submitData -> cards', cards);
                let updatedCards = cards.map((card) => {
                    if (card.type === putObj.type) {
                        card.result = card.result.map((ele) => {
                            if (ele.id === updatedObj.id) {
                                ele = updatedObj;
                            }
                            return ele;
                        });
                    }
                    return card;
                });
                setCards(updatedCards);
                history.replace('/');
            })
            .catch((err) => {
                console.log('submitData -> err', err);
            });
    }

    function handleTypeSelect(val) {
        if (val && val.value) {
            if (val.value.length > 10) {
                setError('typeOfCard', {
                    type: 'manual',
                    message: 'Enter upto only 10 character',
                });
            } else {
                setSelectedType(val);
                clearErrors(['typeOfCard']);
            }
        } else {
            setSelectedType(null);
            setError('typeOfCard', {
                type: 'manual',
                message: 'Please provide category',
            });
        }
    }

    function handleTagsSelect(val) {
        if (val && val.length) {
            if (selectedTags.some((tag) => tag.value.length > 10)) {
                setError('tags', {
                    type: 'manual',
                    message: 'Enter upto only 10 character for single tag',
                });
            } else {
                setSelectedTags(val);
                clearErrors(['tags']);
            }
        } else {
            setSelectedTags(null);
            setError('tags', {
                type: 'manual',
                message: 'Please atleast one tag',
            });
        }
    }

    function setSnippetsData(data) {
        setCodeSnippets(data);
    }

    return (
        <>
            <div className="bg-white p-5">
                <div className="sm:flex sm:items-start justify-center">
                    <form
                        className="w-full max-w-lg"
                        onSubmit={handleSubmit(submitData)}
                    >
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="typeOfCard"
                                >
                                    Type of Card
                                </label>
                                <ReactSelectCreatable
                                    id="typeOfCard"
                                    options={typeOptions}
                                    value={selectedType}
                                    onChange={handleTypeSelect}
                                    placeholder="select or create"
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    ref={() =>
                                        register(
                                            {
                                                name: 'typeOfCard',
                                                value: selectedType,
                                            },
                                            {
                                                validate: (selectedType) => {
                                                    if (
                                                        selectedType &&
                                                        selectedType.value
                                                    ) {
                                                        if (
                                                            selectedType.value
                                                                .length > 10
                                                        ) {
                                                            setError(
                                                                'typeOfCard',
                                                                {
                                                                    type:
                                                                        'manual',
                                                                    message:
                                                                        'Enter upto only 10 character',
                                                                }
                                                            );
                                                        } else {
                                                            clearErrors([
                                                                'typeOfCard',
                                                            ]);
                                                        }
                                                    } else {
                                                        setError('typeOfCard', {
                                                            type: 'manual',
                                                            message:
                                                                'Please provide category',
                                                        });
                                                    }
                                                },
                                            }
                                        )
                                    }
                                />
                                <div className="text-red-500 text-xs">
                                    <ErrorMessage
                                        errors={errors}
                                        name="typeOfCard"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="parent"
                                >
                                    Parent
                                </label>
                                <input
                                    disabled={true}
                                    name="parent"
                                    defaultValue={null}
                                    ref={register({ required: false })}
                                    className="appearance-none block w-full bg-gray-400 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="parent"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3 mb-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="name"
                                >
                                    Name
                                </label>
                                <input
                                    name="name"
                                    ref={register({
                                        required: {
                                            value: true,
                                            message: 'Please provide name',
                                        },
                                        minLength: {
                                            value: 2,
                                            message:
                                                'Enter name having atleast 2 characters',
                                        },
                                        maxLength: {
                                            value: 30,
                                            message:
                                                'Enter name upto atleast 30 characters',
                                        },
                                    })}
                                    className={`appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white border`}
                                    id="name"
                                    type="text"
                                />
                                <div className="text-red-500 text-xs">
                                    <ErrorMessage errors={errors} name="name" />
                                </div>
                            </div>
                            <div className="w-full px-3 mb-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="tags"
                                >
                                    Tags
                                </label>
                                <ReactSelectCreatable
                                    id="tags"
                                    options={tagsOptions}
                                    value={selectedTags}
                                    onChange={handleTagsSelect}
                                    placeholder="select or create"
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    isMulti
                                    ref={() =>
                                        register(
                                            {
                                                name: 'tags',
                                                value: selectedTags,
                                            },
                                            {
                                                validate: () => {
                                                    if (
                                                        selectedTags &&
                                                        selectedTags.length
                                                    ) {
                                                        if (
                                                            selectedTags.some(
                                                                (tag) =>
                                                                    tag.value
                                                                        .length >
                                                                    10
                                                            )
                                                        ) {
                                                            setError('tags', {
                                                                type: 'manual',
                                                                message:
                                                                    'Enter upto only 10 character for single tag',
                                                            });
                                                        } else {
                                                            clearErrors([
                                                                'tags',
                                                            ]);
                                                        }
                                                    } else {
                                                        return 'Please provide tags';
                                                    }
                                                },
                                            }
                                        )
                                    }
                                />
                                <div className="text-red-500 text-xs">
                                    <ErrorMessage errors={errors} name="tags" />
                                </div>
                            </div>

                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="detail"
                                >
                                    Detail
                                </label>
                                <textarea
                                    name="detail"
                                    ref={register({
                                        required: {
                                            value: true,
                                            message: 'Please provide detail',
                                        },
                                        minLength: {
                                            value: 2,
                                            message:
                                                'Enter detail having atleast 2 characters',
                                        },
                                        maxLength: {
                                            value: 300,
                                            message:
                                                'Enter detail upto atleast 300 characters',
                                        },
                                    })}
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="detail"
                                    type="text"
                                />
                                <div className="text-red-500 text-xs">
                                    <ErrorMessage
                                        errors={errors}
                                        name="detail"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="tags"
                                >
                                    Add Code Blocks
                                </label>
                                <img
                                    src={codeIconBase64}
                                    alt="code-icon"
                                    className="bg-gray-200 px-5 py-1 rounded outline-none h-12 cursor-pointer"
                                    onClick={toggleSnippetModal}
                                />
                            </div>
                            {snippetModalOpen && (
                                <CodeSnippetModal isOpen={snippetModalOpen}>
                                    <CodeHighlight
                                        codeSnippets={codeSnippets}
                                        setSnippetsData={setSnippetsData}
                                        toggleModal={toggleSnippetModal}
                                    />
                                </CodeSnippetModal>
                            )}
                        </div>
                        {/* FILE HANDLING FOR NEXT VERSIONS */}
                        {/* <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <input
                                    type="file"
                                    multiple
                                    ref={register}
                                    name="attachments"
                                />
                            </div>
                        </div> */}
                        <div className="bg-gray-50 sm:flex sm:flex-row-reverse">
                            <span className="flex w-full shadow-sm sm:ml-3 sm:w-auto">
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="bg-indigo-500 text-white font-bold py-2 px-5 rounded w-full"
                                >
                                    UPDATE
                                </button>
                            </span>
                            <span className="mt-3 flex w-full shadow-sm sm:mt-0 sm:w-auto">
                                <button
                                    onClick={() => history.replace('/')}
                                    type="button"
                                    className="bg-white hover:bg-indigo-500  hover:text-white text-indigo font-bold py-2 px-5 rounded w-full"
                                >
                                    CLOSE
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

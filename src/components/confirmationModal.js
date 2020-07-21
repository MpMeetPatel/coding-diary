import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { CardsContext } from '../utils/cardsContext';
import { DBContext } from '../utils/dbContext';
import { useHistory, useParams } from 'react-router-dom';

const modalRoot = document.getElementById('delete-modal');

function ConfirmationModal(props) {
    const { cards, setCards } = useContext(CardsContext);
    const [db] = useContext(DBContext);
    const history = useHistory();
    const params = useParams();

    function handleCardDelete(id) {
        if (db.methods) {
            let flag = false;
            let type = null;
            db.methods.deleteById(id).then((res) => {
                let updatedCards = cards.map((card) => {
                    if (card.type === res.type) {
                        if (card.result.length === 1) {
                            type = card.type;
                            flag = true;
                        } else {
                            card.TOTAL_DOCS = card.TOTAL_DOCS - 1;
                            card.result = card.result.filter(
                                (el) => el.id !== id
                            );
                        }
                    }
                    return card;
                });

                if (flag) {
                    updatedCards = updatedCards.filter(
                        (card) => card.type !== type
                    );
                }
                setCards(updatedCards);
                history.replace('/');
            });
        }
    }

    return ReactDOM.createPortal(
        <div
            style={{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '0',
                right: '0',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                display: props.isOpen ? 'block' : 'none',
            }}
        >
            <div
                className={`fixed bottom-0 inset-x-0 px-4 pb-4 inset-0 flex items-center justify-center`}
            >
                <div className="fixed inset-0">
                    <div className="absolute inset-0 bg-opacity-75 bg-black"></div>
                </div>

                <div
                    className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-xl sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <div className="py-8 px-6 flex rounded">
                        <div className="text-left text-lg text-black font-bold mt-1">
                            Are you sure you want to delete ?
                        </div>
                        <div className="flex align-middle ml-auto">
                            <div className="mr-2">
                                <button
                                    onClick={() => handleCardDelete(params.id)}
                                    type="submit"
                                    className="bg-red-500 text-white font-bold py-2 px-4 text-sm rounded w-full shadow"
                                >
                                    DELETE
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => history.replace('/')}
                                    type="button"
                                    className="bg-white hover:bg-indigo-500  hover:text-white text-indigo font-bold py-2 px-4 text-sm rounded w-full shadow"
                                >
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        modalRoot
    );
}

export default ConfirmationModal;

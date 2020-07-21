import React from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('search-modal');

function SearchModal(props) {
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
                    <div className="absolute inset-0 bg-indigo-500"></div>
                </div>

                <div
                    className="rounded-lg overflow-hidden transform transition-all w-full min-w-0"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <div className="py-20 px-6 flex rounded">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>,
        modalRoot
    );
}

export default SearchModal;

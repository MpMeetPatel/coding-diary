import React from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('add-update-modal');

function AddUpdateModal(props) {
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
                backgroundColor: 'rgba(0,0,0,0.3)',
                overflow: 'hidden',
                display: props.isOpen ? 'grid' : 'none',
            }}
        >
            <div
                className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center`}
            >
                <div className="fixed inset-0">
                    <div className="absolute inset-0 bg-indigo-500"></div>
                </div>

                <div
                    className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-xl sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    {props.children}
                </div>
            </div>
        </div>,
        modalRoot
    );
}

export default AddUpdateModal;

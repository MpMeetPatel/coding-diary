import React from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('code-modal');

function CodeSnippetModal(props) {
    return ReactDOM.createPortal(
        <div
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: props.isOpen ? 'grid' : 'none',
            }}
        >
            <div
                className={`fixed bottom-0 inset-x-0 px-4 pb-4 inset-0 flex items-center justify-center z-10`}
            >
                <div
                    className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all custom-scrollbar"
                    style={{
                        maxHeight: '85vh',
                        height: '85vh',
                        minWidth: '65%',
                        overflow: 'auto',
                    }}
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

export default CodeSnippetModal;

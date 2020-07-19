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
                display: props.isOpen ? 'grid' : 'none',
            }}
        >
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-indigo-500"></div>
            </div>
            <div
                className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center`}
            >
                {props.children}
            </div>
        </div>,
        modalRoot
    );
}

export default SearchModal;

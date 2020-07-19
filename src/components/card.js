import React from 'react';
import { useHistory } from 'react-router-dom';
import { deleteGrayIconBase64 } from '../utils/iconBase64';

export default function Card(props) {
    const history = useHistory();

    function handleCardClick() {
        history.replace(`edit/${props.id}`);
    }

    function deleteConfirm() {
        history.replace(`delete/${props.id}`);
    }

    return (
        <div
            tabIndex="-1"
            className="rounded overflow-hidden shadow-lg m-0 cursor-pointer bg-white mb-4"
            onClick={handleCardClick}
        >
            <div className="px-6 py-4 flex items-start">
                <div style={{ maxWidth: '300px' }}>
                    <div className="font-bold text-xl mb-2">{props.name}</div>
                    <p className="text-gray-700 text-base">{props.detail}</p>
                </div>
                <div className="cursor-pointer outline-none ml-auto mt-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2">
                    <img
                        src={deleteGrayIconBase64}
                        alt="delete-icon"
                        className="h-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteConfirm();
                        }}
                    />
                </div>
            </div>
            <div className="px-6 py-4">
                {props.tags &&
                    props.tags.map((tag) => (
                        <span
                            key={`${props.name}${Math.random() * 100}`}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                        >
                            #{tag}
                        </span>
                    ))}
                {/* <span
                    tabIndex="0"
                    className="inline-block bg-red-500 px-3 py-1 text-sm text-white rounded-lg"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteConfirm();
                    }}
                >
                    delete
                </span>

                 */}
            </div>
        </div>
    );
}

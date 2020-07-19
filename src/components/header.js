import React from 'react';

export default function Header(props) {
    return (
        <div>
            <button onClick={props.toggleModal}>OPEN</button>
        </div>
    );
}

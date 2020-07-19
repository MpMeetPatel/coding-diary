import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { DBContextProvider } from './utils/dbContext';
import { CardsContextProvider } from './utils/cardsContext';

ReactDOM.render(
    <DBContextProvider>
        <CardsContextProvider>
            <App />
        </CardsContextProvider>
    </DBContextProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

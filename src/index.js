import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import MainPage from './pages';
import 'react-toastify/dist/ReactToastify.css';
import './styles/tailwind.out.css';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { DBContextProvider } from './utils/dbContext';
import { CardsContextProvider } from './utils/cardsContext';
// import CssProvider from './CssProvider';

ReactDOM.render(
    <DBContextProvider>
        <CardsContextProvider>
            {/* <CssProvider> */}
            <Router>
                <MainPage />
            </Router>
            {/* </CssProvider> */}
        </CardsContextProvider>
    </DBContextProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
    onUpdate: (registration) => {
        const waitingServiceWorker = registration.waiting;

        if (waitingServiceWorker) {
            waitingServiceWorker.addEventListener('statechange', (event) => {
                if (event.target.state === 'activated') {
                    alert('Reload to activate new version of website');
                    window.location.reload();
                }
            });
            waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    },
});

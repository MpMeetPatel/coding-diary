import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainPage from './pages';

const AnimatedSwitch = () => {
    return <MainPage />;
};

function App() {
    return (
        <Router>
            <AnimatedSwitch />
        </Router>
    );
}

export default App;

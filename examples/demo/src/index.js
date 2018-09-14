import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AppContainer } from 'react-hot-loader';

import './index.css';

// Wrap the rendering in a function:
const render = () => {
    ReactDOM.render(
        // Wrap App inside AppContainer
        <AppContainer>
            <App />
        </AppContainer>,
        document.getElementById('root')
    );
};

// Render once
render();

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./App', () => {
        render();
    });
}

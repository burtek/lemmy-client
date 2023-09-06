import { ThemeProvider } from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import { Loader } from './Loader';
import { store } from './data';
import { persistor } from './data/store';
import { theme } from './theme';


const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <PersistGate
                        loading={<Loader />}
                        persistor={persistor}
                    >
                        <App />
                    </PersistGate>
                </Provider>
            </ThemeProvider>
        </React.StrictMode>
    );
}

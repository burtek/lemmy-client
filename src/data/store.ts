import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import {
    createTransform,
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { createClient } from '../client';

import { reducers } from './reducers';
import type { Auth } from './types';


const rootReducer = combineReducers(reducers);
const persistedReducer = persistReducer(
    {
        key: 'root',
        storage,
        whitelist: ['auth'],
        transforms: [
            createTransform(
                (state: Auth): Auth => ({ ...state, error: null }),
                state => {
                    if (state.instance) {
                        createClient(state.instance);
                    }
                    return state;
                },
                { whitelist: ['auth'] }
            )
        ]
    },
    rootReducer
);

export const store = configureStore({
    devTools: import.meta.env.DEV,
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } })
            .concat(createLogger({ collapsed: true }));
    },
    reducer: persistedReducer
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

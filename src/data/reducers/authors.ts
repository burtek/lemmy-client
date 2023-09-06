import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { Author } from '../types';

import { actions as postActions } from './posts';


export const authorsAdapter = createEntityAdapter<Author>({ selectId: model => `${model.name}@${model.instance}` });

const { actions, getInitialState, name: sliceName, reducer } = createSlice({
    name: 'authors',
    initialState: authorsAdapter.getInitialState(),
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(postActions.getPostsPage.fulfilled, (state, { payload }) => {
                authorsAdapter.addMany(state, payload.authors);
            });
    }
});
export {
    actions,
    sliceName,
    reducer
};

const getState = (state: { [sliceName]: ReturnType<typeof getInitialState> }) => state[sliceName];

export const selectors = authorsAdapter.getSelectors(getState);

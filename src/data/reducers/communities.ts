import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { Community } from '../types';

import { actions as postActions } from './posts';


export const communitiesAdapter = createEntityAdapter<Community>({ selectId: model => `${model.name}@${model.instance}` });

const { actions, getInitialState, name: sliceName, reducer } = createSlice({
    name: 'communities',
    initialState: communitiesAdapter.getInitialState(),
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(postActions.getPostsPage.fulfilled, (state, { payload }) => {
                communitiesAdapter.addMany(state, payload.communities);
            });
    }
});
export {
    actions,
    sliceName,
    reducer
};

const getState = (state: { [sliceName]: ReturnType<typeof getInitialState> }) => state[sliceName];

export const selectors = communitiesAdapter.getSelectors(getState);

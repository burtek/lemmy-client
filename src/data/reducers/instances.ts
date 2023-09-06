import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

import { getClient } from '../../client';
import { FetchStatus } from '../fetch_status';
import { createAppAsyncThunk } from '../store-utils';
import type { Instance } from '../types';


export const instancesAdapter = createEntityAdapter<Instance>();

const getInstances = createAppAsyncThunk('instances/getInstances', async (instance: string, { rejectWithValue }) => {
    const client = getClient();
    if (!client) {
        return rejectWithValue('no client available');
    }

    const { federated_instances: { linked = [], allowed = [], blocked = [] } = {} } = await client.getFederatedInstances();
    const mapped = [...linked, ...allowed, ...blocked].map(({ id, domain }) => ({ id, domain }));
    mapped.unshift({ id: 1, domain: new URL(instance).hostname });

    return mapped;
});

const { actions, getInitialState, name: sliceName, reducer } = createSlice({
    name: 'instances',
    initialState: instancesAdapter.getInitialState({ status: FetchStatus.IDLE }),
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getInstances.fulfilled, (state, { payload }) => {
                state.status = FetchStatus.SUCCESS;
                instancesAdapter.addMany(state, payload);
            })
            .addCase(getInstances.rejected, state => {
                state.status = FetchStatus.ERROR;
            })
            .addCase(getInstances.pending, state => {
                state.status = FetchStatus.IN_PROGRESS;
            });
    }
});

const allActions = {
    ...actions,
    getInstances
};

export { allActions as actions, sliceName, reducer };

const getState = (state: { [sliceName]: ReturnType<typeof getInitialState> }) => state[sliceName];

export const selectors = {
    ...instancesAdapter.getSelectors(getState),
    selectInstancesStatus: createSelector(getState, state => state.status)
};

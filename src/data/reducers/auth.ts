import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import { createClient } from '../../client';
import { FetchStatus, isSuccess } from '../fetch_status';
import { createAppAsyncThunk } from '../store-utils';
import type { Auth, AuthLoggedOut } from '../types';


const initialAuthState = ({
    error = null,
    instance = null,
    status = error ? FetchStatus.ERROR : FetchStatus.IDLE
}: Partial<Omit<AuthLoggedOut, 'jwt'>> = {}): Auth => ({ error, instance, jwt: null, status });

interface LoginData {
    username: string;
    password: string;
    instance: string;
}
const logIn = createAppAsyncThunk('auth/logIn', async ({ username, password, instance }: LoginData, { rejectWithValue }) => {
    if (!/^https?:\/\//.test(instance)) {
        return rejectWithValue('instance must begin with http(s):// protocol');
    }
    const client = createClient(instance);
    const { jwt } = await client.login({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        username_or_email: username,
        password
    });
    if (!jwt) {
        return rejectWithValue('no auth token was returned');
    }
    return { jwt };
});

const { actions, getInitialState, name: sliceName, reducer } = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        logOut: {
            prepare(reason?: string) {
                return { payload: { reason } };
            },
            reducer(_state, { payload }: PayloadAction<{ reason?: string }>) {
                return initialAuthState({ error: payload.reason });
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(logIn.pending, (_state, { meta }) => initialAuthState({
                instance: meta.arg.instance,
                status: FetchStatus.IN_PROGRESS
            }))
            .addCase(logIn.rejected, (_state, { error }) => initialAuthState({ error: error.message }))
            .addCase(logIn.fulfilled, (_state, { payload, meta }) => ({
                error: null,
                jwt: payload.jwt,
                instance: meta.arg.instance,
                status: FetchStatus.SUCCESS
            }));
    }
});

const allActions = {
    ...actions,
    logIn
};

export { allActions as actions, sliceName, reducer };

const getState = (state: { [sliceName]: ReturnType<typeof getInitialState> }) => state[sliceName];

const selectLogInStatus = createSelector(getState, status => status.status);
const selectIsLoggedIn = createSelector(selectLogInStatus, isSuccess);
const selectJwt = createSelector(getState, state => state.jwt);
const selectAuthError = createSelector(getState, state => state.error);
const selectInstance = createSelector(getState, state => state.instance);

export const selectors = {
    selectLogInStatus,
    selectIsLoggedIn,
    selectJwt,
    selectAuthError,
    selectInstance
};

import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

import { getClient } from '../../client';
import { FetchStatus } from '../fetch_status';
import { createAppAsyncThunk } from '../store-utils';
import type { Author, Community, Post, PostShare } from '../types';

import { selectors as authSelectors } from './auth';
import { mapPost } from './posts-utils';


export const postsAdapter = createEntityAdapter<Post>();
export const postSharesAdapter = createEntityAdapter<PostShare>();

const getPostsPage = createAppAsyncThunk('posts/getPostsPage', async (page: number, { getState, rejectWithValue }) => {
    const state = getState();
    const jwt = authSelectors.selectJwt(state);
    if (!jwt) {
        return rejectWithValue('not logged in');
    }
    const client = getClient();
    if (!client) {
        return rejectWithValue('no client available');
    }

    const { posts } = await client.getPosts({
        page,
        auth: jwt,
        sort: 'New',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        type_: 'Subscribed'
    });
    return posts.reduce(
        (acc, rawPost) => {
            const { author, community, post, postShare } = mapPost(rawPost);
            return {
                authors: [...acc.authors, author],
                communities: [...acc.communities, community],
                posts: [...acc.posts, post],
                postShares: [...acc.postShares, postShare]
            };
        },
        {
            authors: [] as Author[],
            communities: [] as Community[],
            posts: [] as Post[],
            postShares: [] as PostShare[]
        }
    );
});
const getInitialPage = createAppAsyncThunk('posts/getInitialPage', (_, { dispatch }) => dispatch(getPostsPage(1)));

const { actions, getInitialState, name: sliceName, reducer } = createSlice({
    name: 'posts',
    initialState: {
        initialPostsState: FetchStatus.IDLE,
        posts: postsAdapter.getInitialState(),
        postShares: postSharesAdapter.getInitialState()
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getPostsPage.fulfilled, (state, { payload }) => {
                payload.posts.forEach(post => {
                    if (state.posts.ids.includes(post.id)) {
                        const postToUpdate = state.posts.entities[post.id];
                        if (postToUpdate) {
                            postToUpdate.published.push(...post.published);
                            postToUpdate.published = [...new Set(postToUpdate.published)];
                        }
                    } else {
                        state.posts.ids.push(post.id);
                        state.posts.entities[post.id] = post;
                    }
                });
                postSharesAdapter.upsertMany(state.postShares, payload.postShares);
            })
            .addCase(getInitialPage.pending, state => {
                state.initialPostsState = FetchStatus.IN_PROGRESS;
            })
            .addCase(getInitialPage.rejected, state => {
                state.initialPostsState = FetchStatus.ERROR;
            })
            .addCase(getInitialPage.fulfilled, state => {
                state.initialPostsState = FetchStatus.SUCCESS;
            });
    }
});

const allActions = {
    ...actions,
    getInitialPage,
    getPostsPage
};

export { allActions as actions, sliceName, reducer };

const getState = (state: { [sliceName]: ReturnType<typeof getInitialState> }) => state[sliceName];

export const getInitialPostState = createSelector(getState, state => state.initialPostsState);

export const getPosts = createSelector(getState, state => state.posts);
export const getPostShares = createSelector(getState, state => state.postShares);

export const postSelectors = postsAdapter.getSelectors(getPosts);
export const postSharesSelectors = postSharesAdapter.getSelectors(getPostShares);

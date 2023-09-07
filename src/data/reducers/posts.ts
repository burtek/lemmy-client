import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

import { getClient } from '../../client';
import { createAppAsyncThunk } from '../store-utils';
import type { Author, Community, Post, PostShare, PostShareVote } from '../types';

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

const toggleSave = createAppAsyncThunk(
    'posts/toggleSave',
    async ({ postId, save }: { postId: number; save: boolean }, { getState, rejectWithValue }) => {
        const state = getState();
        const jwt = authSelectors.selectJwt(state);
        if (!jwt) {
            return rejectWithValue('not logged in');
        }
        const client = getClient();
        if (!client) {
            return rejectWithValue('no client available');
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { post_view: post } = await client.savePost({ post_id: postId, save, auth: jwt });
        const { postShare } = mapPost(post);

        return postShare;
    }
);

const vote = createAppAsyncThunk(
    'posts/vote',
    async ({ postId, score }: { postId: number; score: PostShareVote }, { getState, rejectWithValue }) => {
        const state = getState();
        const jwt = authSelectors.selectJwt(state);
        if (!jwt) {
            return rejectWithValue('not logged in');
        }
        const client = getClient();
        if (!client) {
            return rejectWithValue('no client available');
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { post_view: post } = await client.likePost({ post_id: postId, score, auth: jwt });
        const { postShare } = mapPost(post);

        return postShare;
    }
);

const report = createAppAsyncThunk(
    'posts/report',
    async ({ postId, reason }: { postId: number; reason: string }, { getState, rejectWithValue }) => {
        const state = getState();
        const jwt = authSelectors.selectJwt(state);
        if (!jwt) {
            return rejectWithValue('not logged in');
        }
        const client = getClient();
        if (!client) {
            return rejectWithValue('no client available');
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { post_report_view: post } = await client.createPostReport({ post_id: postId, reason, auth: jwt });
        const { postShare } = mapPost(post);

        return postShare;
    }
);

const { actions, getInitialState, name: sliceName, reducer } = createSlice({
    name: 'posts',
    initialState: {
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
            .addCase(toggleSave.fulfilled, (state, { payload }) => {
                postSharesAdapter.updateOne(state.postShares, { id: payload.id, changes: payload });
            })
            .addCase(vote.fulfilled, (state, { payload }) => {
                postSharesAdapter.updateOne(state.postShares, { id: payload.id, changes: payload });
            })
            .addCase(report.fulfilled, (state, { payload }) => {
                postSharesAdapter.updateOne(state.postShares, { id: payload.id, changes: payload });
            });
    }
});

const allActions = {
    ...actions,
    getPostsPage,
    toggleSave,
    vote,
    report
};

export { allActions as actions, sliceName, reducer };

const getState = (state: { [sliceName]: ReturnType<typeof getInitialState> }) => state[sliceName];

export const getPosts = createSelector(getState, state => state.posts);
export const getPostShares = createSelector(getState, state => state.postShares);

export const postSelectors = postsAdapter.getSelectors(getPosts);
export const postSharesSelectors = postSharesAdapter.getSelectors(getPostShares);

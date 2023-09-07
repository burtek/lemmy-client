import styled from '@emotion/styled';
import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { useAppDispatch, useAppSelector } from '../data';
import { actions as postActions, postSelectors } from '../data/reducers/posts';
import { useInputState } from '../hooks/useInputState';

import Post from './Post';


const FULL_HEIGHT_VH = 100;
const HALF = 0.5;

const Search = styled.input({});
const Posts = styled.div(({ theme }) => {
    const gapFactor = 1;
    const paddingRightFactor = 1;
    return {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(gapFactor),
        overflow: 'auto',
        paddingRight: theme.spacing(paddingRightFactor) // scrollbar
    };
});
const Container = styled.div(({ theme }) => {
    const heightVh = 90;
    const maxWidthPx = 1080;
    const gapFactor = 1;

    return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'min-content 1fr',
        gap: theme.spacing(gapFactor),

        minWidth: `min(${maxWidthPx}px, 100%)`,
        maxWidth: maxWidthPx,
        height: `${heightVh}vh`,

        position: 'absolute',
        top: `${(FULL_HEIGHT_VH - heightVh)*HALF}vh`,
        left: `max(0px, calc(50vw - ${maxWidthPx*HALF}px))`
    };
});

export function Feed() {
    const dispatch = useAppDispatch();

    const [search, setSearch] = useInputState();
    const posts = useAppSelector(postSelectors.selectIds) as number[];

    const getPage = useCallback(
        (page: number) => dispatch(postActions.getPostsPage(page)),
        [dispatch]
    );

    return (
        <Container>
            <Search
                disabled
                placeholder="Search"
                type="text"
                onChange={setSearch}
                value={search}
            />
            <Posts>
                <InfiniteScroll
                    loadMore={getPage}
                    hasMore
                    useWindow={false}
                    loader={<div key="loading">Loading...</div>}
                >
                    {posts.map(postId => (
                        <Post
                            id={postId}
                            key={postId}
                        />
                    ))}
                </InfiniteScroll>
            </Posts>
        </Container>
    );
}
Feed.displayName = 'Feed';

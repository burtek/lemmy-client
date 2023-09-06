import styled from '@emotion/styled';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import dayjs from 'dayjs';
import { Fragment, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { useAppDispatch, useAppSelector } from './data';
import { selectors as authSelectors } from './data/reducers/auth';
import { selectors as authorsSelectors } from './data/reducers/authors';
import { selectors as communitiesSelectors } from './data/reducers/communities';
import { selectors as instancesSelectors } from './data/reducers/instances';
import { actions as postActions, postSelectors, postSharesSelectors } from './data/reducers/posts';
import { useInputState } from './hooks/useInputState';


const Search = styled.input({});
const Posts = styled.div(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    overflow: 'auto',
    paddingRight: theme.spacing(1)
}));
const Post = styled.div<{ hasThumbnail: boolean }>(({ hasThumbnail, theme }) => ({
    display: 'grid',
    gridTemplateAreas: hasThumbnail
        ? ` "author_icon author      thumbnail"
            "title       title       thumbnail"
            "tags        tags        thumbnail"
            "communities communities communities"`
        : ` "author_icon author      author"
            "title       title       title"
            "tags        tags        ."
            "communities communities communities"`,
    gridTemplateColumns: 'min-content 1fr max-content',
    gridTemplateRows: 'min-content min-content 1fr min-content',
    gap: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid black',
    marginBottom: theme.spacing(1)
}));
const Thumbnail = styled.div({
    gridArea: 'thumbnail',
    '& > img': { maxHeight: '120px' }
});
const Author = styled.div({ gridArea: 'author' });
const AuthorAvatar = styled.div({
    gridArea: 'author_icon',
    '& > img': { maxHeight: '1.2em' }
});
const Tags = styled.div({ gridArea: 'tags' });
const Title = styled.div({ gridArea: 'title' });
const Communities = styled.div(({ theme }) => ({
    gridArea: 'communities',
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr repeat(6, max-content)',
    gridAutoRows: 'min-content',
    gap: theme.spacing(0.5, 1),
    '& img': { maxHeight: '1.2em' },
    '&>:nth-child(n+3)': {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.25)
    }
}));
const Container = styled.div(({ theme }) => {
    const heightVw = 90;
    const maxWidthPx = 1080;
    return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'min-content 1fr',
        gap: theme.spacing(1),

        maxWidth: maxWidthPx,
        height: `${heightVw}vw`,

        position: 'absolute',
        top: `${(100 - heightVw)/2}vw`,
        left: `max(0px, calc(50vw - ${maxWidthPx/2}px))`
    };
});

export function Feed() {
    const dispatch = useAppDispatch();

    const [search, setSearch] = useInputState();
    const userInstance = useAppSelector(authSelectors.selectInstance) as string;
    const authors = useAppSelector(authorsSelectors.selectEntities);
    const commmunities = useAppSelector(communitiesSelectors.selectEntities);
    const instances = useAppSelector(instancesSelectors.selectEntities);
    const posts = useAppSelector(postSelectors.selectAll);
    const postShares = useAppSelector(postSharesSelectors.selectEntities);

    const getPage = useCallback(
        (page: number) => dispatch(postActions.getPostsPage(page)),
        [dispatch]
    );

    return (
        <Container>
            <Search
                placeholder="Search"
                type="text"
                onChange={setSearch}
                value={search}
            />
            <Posts>
                <InfiniteScroll
                    loadMore={getPage}
                    initialLoad={false}
                    hasMore
                    useWindow={false}
                    loader={<div key="loading">Loading...</div>}
                >
                    {posts.map(post => {
                        const author = authors[post.author];
                        return (
                            <Post
                                key={post.id}
                                hasThumbnail={Boolean(post.thumbnail)}
                            >
                                {author?.avatarUrl
                                    ? (
                                        <AuthorAvatar>
                                            <img
                                                src={author.avatarUrl}
                                                alt={`${author.name}@${instances[author.instance]?.domain}`}
                                            />
                                        </AuthorAvatar>
                                    )
                                    : null}
                                <Author>{author ? `${author.name}@${instances[author.instance]?.domain}` : post.author}</Author>
                                <Title>
                                    <a href={post.link}>{post.title}</a>
                                </Title>
                                {post.thumbnail
                                    ? (
                                        <Thumbnail>
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                            />
                                        </Thumbnail>
                                    )
                                    : null}
                                <Tags>
                                    {post.link ? <span>link</span> : <span>text</span>}
                                    {post.nsfw ? <span>nsfw</span> : null}
                                </Tags>
                                <Communities>
                                    {post.published.map(shareId => {
                                        const share = postShares[shareId];
                                        const community = share?.community && commmunities[share.community];
                                        const communityInstance = community?.instance
                                            ? instances[community.instance]?.domain ?? community.instance
                                            : community?.instance;

                                        return (
                                            <Fragment key={shareId}>
                                                <div>
                                                    {community?.logoUrl
                                                        ? (
                                                            <img
                                                                src={community.logoUrl}
                                                                alt={community.displayName ?? community.name}
                                                            />
                                                        )
                                                        : null}
                                                </div>
                                                <div>{`${community?.displayName ?? community?.name}@${communityInstance}`}</div>
                                                <div>
                                                    {dayjs(share?.date).format(
                                                        'DD-MM-YYYY HH:mm:ss'
                                                    )}
                                                </div>
                                                <div>
                                                    {share?.vote === 1 ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                                                    {`+${share?.upvotes}`}
                                                </div>
                                                <div>
                                                    {share?.vote === -1 ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                                                    {`+${share?.downvotes}`}
                                                </div>
                                                <div>
                                                    <CommentIcon />
                                                    {share?.comments}
                                                </div>
                                                <div>
                                                    {share?.saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                                </div>
                                                <div>
                                                    <a
                                                        href={`${userInstance}/post/${shareId}`}
                                                        target="_blank"
                                                        rel="noreferrer noopener"
                                                    >
                                                        see &gt;
                                                    </a>
                                                </div>
                                            </Fragment>
                                        );
                                    })}
                                </Communities>
                            </Post>
                        );
                    })}
                </InfiniteScroll>
            </Posts>
        </Container>
    );
}
Feed.displayName = 'Feed';

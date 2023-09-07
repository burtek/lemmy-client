import styled from '@emotion/styled';
import { memo } from 'react';

import { useAppSelector } from '../data';
import { selectors as authorSelectors } from '../data/reducers/authors';
import { selectors as instancesSelectors } from '../data/reducers/instances';
import { postSelectors } from '../data/reducers/posts';

import Community from './Community';


const PostContainer = styled.div<{ hasThumbnail: boolean }>(({ hasThumbnail, theme }) => {
    const postSpacingFactor = 1;
    const gapFactor = 0.5;
    return {
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
        gridTemplateRows: 'min-content 1fr min-content min-content',
        gap: theme.spacing(gapFactor),
        paddingBottom: theme.spacing(postSpacingFactor),
        borderBottom: '1px solid black',
        marginBottom: theme.spacing(postSpacingFactor)
    };
});
const Thumbnail = styled.div({
    gridArea: 'thumbnail',
    '& > img': { maxHeight: 120 }
});
const Author = styled.div({ gridArea: 'author' });
const AuthorAvatar = styled.div({
    gridArea: 'author_icon',
    '& > img': { maxHeight: '1.2em' }
});
const Tags = styled.div({ gridArea: 'tags' });
const Title = styled.div({ gridArea: 'title' });
const Communities = styled.div(({ theme }) => {
    const gapFactorX = 0.5;
    const gapFactorY = 1;
    const actionsGapFactor = 0.25;
    return {
        gridArea: 'communities',
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr repeat(6, max-content)',
        gridAutoRows: 'min-content',
        gap: theme.spacing(gapFactorX, gapFactorY),
        '& img': { maxHeight: '1.2em' },
        '&>:nth-child(n+3),&>:nth-child(n+3) *': {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(actionsGapFactor)
        }
    };
});

function Post({ id }: { id: number }) {
    const post = useAppSelector(state => postSelectors.selectById(state, id));
    const author = useAppSelector(state => (post ? authorSelectors.selectById(state, post.author) : null));
    const authorInstance = useAppSelector(state => (author ? instancesSelectors.selectById(state, author.instance) : null));

    if (!post) {
        return null;
    }

    const authorString = author && authorInstance ? `${author.name}@${authorInstance.domain}` : post.author;

    return (
        <PostContainer
            key={post.id}
            hasThumbnail={Boolean(post.thumbnail)}
        >
            {author?.avatarUrl
                ? (
                    <AuthorAvatar>
                        <img
                            src={author.avatarUrl}
                            alt={authorString}
                        />
                    </AuthorAvatar>
                )
                : null}
            <Author>{authorString}</Author>
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
                {post.published.map(shareId => (
                    <Community
                        key={shareId}
                        id={shareId}
                    />
                ))}
            </Communities>
        </PostContainer>
    );
}
Post.displayName = 'Post';

export default memo(Post);

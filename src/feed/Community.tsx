import styled from '@emotion/styled';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import dayjs from 'dayjs';
import { Fragment, memo, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../data';
import { selectors as authSelectors } from '../data/reducers/auth';
import { selectors as communitySelectors } from '../data/reducers/communities';
import { selectors as instancesSelectors } from '../data/reducers/instances';
import { actions as postActions, postSharesSelectors } from '../data/reducers/posts';
import { PostShareVote } from '../data/types';


const Button = styled.div({
    cursor: 'pointer',
    '&:hover': {}
});
Button.defaultProps = {
    ...Button.defaultProps,
    role: 'button'
};


function getVoteScore(current: PostShareVote, next: PostShareVote.UP | PostShareVote.DOWN) {
    if (current === next) {
        return PostShareVote.NO;
    }
    return next;
}

function Community({ id: postId }: { id: number }) {
    const dispatch = useAppDispatch();

    const userInstance = useAppSelector(authSelectors.selectInstance) as string;
    const share = useAppSelector(state => postSharesSelectors.selectById(state, postId));
    const community = useAppSelector(state => (share ? communitySelectors.selectById(state, share.community) : null));
    const instance = useAppSelector(state => (community?.instance ? instancesSelectors.selectById(state, community.instance) : null));

    const onToggleSave = useCallback(
        () => {
            if (share) {
                void dispatch(postActions.toggleSave({ postId, save: !share.saved }));
            }
        },
        [dispatch, share, postId]
    );
    const onToggleUpvote = useCallback(
        () => {
            if (share) {
                void dispatch(postActions.vote({ postId, score: getVoteScore(share.vote, PostShareVote.UP) }));
            }
        },
        [share, dispatch, postId]
    );
    const onToggleDownvote = useCallback(
        () => {
            if (share) {
                void dispatch(postActions.vote({ postId, score: getVoteScore(share.vote, PostShareVote.DOWN) }));
            }
        },
        [share, dispatch, postId]
    );

    if (!share || !community) {
        return null;
    }

    const communityInstance = instance?.domain ?? community.instance;


    return (
        <Fragment key={postId}>
            <div>
                {community.logoUrl
                    ? (
                        <img
                            src={community.logoUrl}
                            alt={community.displayName ?? community.name}
                        />
                    )
                    : null}
            </div>
            <div>{`${community.displayName ?? community.name}@${communityInstance}`}</div>
            <div>
                {dayjs(share.date).format(
                    'DD-MM-YYYY HH:mm:ss'
                )}
            </div>
            <div>
                <Button onClick={onToggleUpvote}>
                    {share.vote === PostShareVote.UP ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                </Button>
                {`+${share.upvotes}`}
            </div>
            <div>
                <Button onClick={onToggleDownvote}>
                    {share.vote === PostShareVote.DOWN ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                </Button>
                {`-${share.downvotes}`}
            </div>
            <div>
                <CommentIcon />
                {share.comments}
            </div>
            <Button onClick={onToggleSave}>
                {share.saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </Button>
            <div>
                <a
                    href={`${userInstance}/post/${postId}`}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    see &gt;
                </a>
            </div>
        </Fragment>
    );
}
Community.displayName = 'Community';

export default memo(Community);

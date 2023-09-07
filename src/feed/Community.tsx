// icons: https://mui.com/material-ui/material-icons/
import styled from '@emotion/styled';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CommentIcon from '@mui/icons-material/Comment';
import FlagIcon from '@mui/icons-material/Flag';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import dayjs from 'dayjs';
import { memo, useCallback } from 'react';

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
export const Communities = styled.div(({ theme }) => {
    const gapFactorX = 0.5;
    const gapFactorY = 1;

    return {
        gridArea: 'communities',
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr repeat(7, max-content)',
        gridAutoRows: 'min-content',
        gap: theme.spacing(gapFactorX, gapFactorY)
    };
});
const ImgWrapper = styled.div({ '& img': { maxHeight: '1.2em' } });
const ActionWrapper = styled.div(({ theme }) => {
    const actionsGapFactor = 0.25;
    return {
        '&, & *': {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(actionsGapFactor)
        }
    };
});


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
    const onReportPost = useCallback(
        () => {
            if (share) {
                // TODO: add reason dialog with optional user blocking
                // TODO: add toast with confirmation
                void dispatch(postActions.report({ postId, reason: 'spam/ad' }));
            }
        },
        [dispatch, postId, share]
    );

    if (!share || !community) {
        return null;
    }

    const communityInstance = instance?.domain ?? community.instance;
    const communityName = community.displayName ?? community.name;

    return (
        <>
            <ImgWrapper>
                {community.logoUrl
                    ? (
                        <img
                            src={community.logoUrl}
                            alt={communityName}
                        />
                    )
                    : null}
            </ImgWrapper>
            <div>{`${communityName}@${communityInstance}`}</div>
            <ActionWrapper>
                {/* TODO: nice format */}
                {dayjs(share.date).format(
                    'DD-MM-YYYY HH:mm:ss'
                )}
            </ActionWrapper>
            <ActionWrapper>
                <Button onClick={onToggleUpvote}>
                    {share.vote === PostShareVote.UP ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                </Button>
                {`+${share.upvotes}`}
            </ActionWrapper>
            <ActionWrapper>
                <Button onClick={onToggleDownvote}>
                    {share.vote === PostShareVote.DOWN ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                </Button>
                {`-${share.downvotes}`}
            </ActionWrapper>
            <ActionWrapper>
                <CommentIcon />
                {share.comments}
            </ActionWrapper>
            <ActionWrapper>
                <Button onClick={onReportPost}>
                    <FlagIcon />
                </Button>
            </ActionWrapper>
            <Button onClick={onToggleSave}>
                {share.saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </Button>
            <ActionWrapper>
                <a
                    href={`${userInstance}/post/${postId}`}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    see &gt;
                </a>
            </ActionWrapper>
        </>
    );
}
Community.displayName = 'Community';

export default memo(Community);

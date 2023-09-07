import type { PostReportView, PostView } from 'lemmy-js-client';

import type { Author, Community, Post, PostShare } from '../../types';
import { PostShareVote } from '../../types';


export function mapPost(post: PostView): { author: Author; community: Community; post: Post; postShare: PostShare };
export function mapPost(post: PostReportView): { author: Author; community: Community; post: Post; postShare: Omit<PostShare, 'saved'> };
export function mapPost(post: PostView | PostReportView): { author: Author; community: Community; post: Post; postShare: Partial<PostShare> } {
    const key = `${post.post.name}-${post.creator.name}@${post.creator.instance_id}-${post.post.url}`;

    return {
        author: {
            name: post.creator.name,
            avatarUrl: post.creator.avatar,
            instance: post.creator.instance_id
        },
        community: {
            displayName: post.community.title,
            logoUrl: post.community.icon,
            name: post.community.name,
            instance: post.community.instance_id
        },
        post: {
            id: key,
            author: `${post.creator.name}@${post.creator.instance_id}`,
            title: post.post.name,
            link: post.post.url,
            thumbnail: post.post.thumbnail_url,
            nsfw: post.post.nsfw,
            published: [post.post.id]
        },
        postShare: {
            id: post.post.id,
            community: `${post.community.name}@${post.community.instance_id}`,
            date: `${post.post.published}Z`,

            ...'saved' in post ? { saved: post.saved } : {},
            vote: post.my_vote ?? PostShareVote.NO,

            upvotes: post.counts.upvotes,
            downvotes: post.counts.downvotes,
            comments: post.counts.comments
        }
    };
}

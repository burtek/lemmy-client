import type { PostView } from 'lemmy-js-client';

import type { Author, Community, Post, PostShare } from '../../types';


export function mapPost(post: PostView): { author: Author; community: Community; post: Post; postShare: PostShare } {
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

            saved: post.saved,
            vote: post.my_vote as PostShare['vote'],

            upvotes: post.counts.upvotes,
            downvotes: post.counts.downvotes,
            comments: post.counts.comments
        }
    };
}

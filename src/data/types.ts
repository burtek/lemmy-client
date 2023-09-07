import type { Instance as LemmyInstance } from 'lemmy-js-client';

import type { FetchStatus } from './fetch_status';


export interface Author {
    name: string;
    instance: Instance['id'];
    avatarUrl?: string;
}

export interface Post {
    id: string;
    author: `${Author['name']}@${Author['instance']}`;
    title: string;
    link?: string;
    thumbnail?: string;
    nsfw: boolean;
    published: PostShare['id'][];
}

export enum PostShareVote {
    UP = 1,
    NO = 0,
    DOWN = -1
}
export interface PostShare {
    id: number;
    community: `${Community['name']}@${Community['instance']}`;
    date: string; // ISO

    saved?: boolean;
    vote: PostShareVote;

    upvotes: number;
    downvotes: number;
    comments: number;
}

export type Instance = Pick<LemmyInstance, 'id' | 'domain'>;

export interface Community {
    name: string;
    displayName?: string;
    instance?: number;
    logoUrl?: string;
}

export interface AuthLoggedOut {
    error: string | null;
    instance: string | null;
    jwt: null;
    status: Exclude<FetchStatus, FetchStatus.SUCCESS>;
}
export interface AuthLoggedIn {
    error: null;
    instance: string;
    jwt: string;
    status: FetchStatus.SUCCESS;
}
export type Auth = AuthLoggedIn | AuthLoggedOut;

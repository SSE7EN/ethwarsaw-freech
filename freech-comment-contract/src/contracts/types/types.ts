export interface FreechState {
    commentsCount: number;
    siteComments: Map<String, Comment[]>;
    sites: Map<String, Site>;
    users: Map<String, User>;
}

interface User {
    comments: Map<number, Comment>
}

interface Site {
    votes: {
        addresses: string[];
        up: number;
        down: number;
    };
}

export interface Comment {
    id: number;
    timestamp: number;
    creator: string;
    content: string;
    votes: {
        addresses: string[];
        up: number;
        down: number;
    };
}

export interface FreechAction {
    input: FreechInput;
    caller: string;
}

export interface FreechInput {
    function: FreechFunction;
    originHash: string;
    commentId: number;
    content: string;
    user: string;
}

export type FreechFunction =
    | 'postComment'
    | 'upvoteComment'
    | 'downvoteComment'
    | 'upvoteSite'
    | 'downvoteSite'
    | 'readComment'
    | 'readComments'
    | 'readSite'
    | 'readUser';

// src/contracts/types/types.ts

export type FreechCommentResult = Comment;
export type FreechCommentsResult = Comment[];
export type FreechSiteResult = Site;
export type FreechUserResult = User;


export type ContractResult = { state: FreechState } | { result: FreechCommentResult } |
    { result: FreechCommentsResult } |  { result: FreechSiteResult } | { result: FreechUserResult } | {result: {} };

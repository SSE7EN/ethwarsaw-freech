import {readSite} from "../actions/read/readSite";

export interface FreechState {
    siteComments: Map<String, Comment[]>;
    sites: Map<String, Site>;
}

interface Site {
    votes: {
        addresses: string[];
        up: number;
        down: number;
    };
}

interface Comment {
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
}

export type FreechFunction =
    | 'postComment'
    | 'upvoteComment'
    | 'downvoteComment'
    | 'upvoteSite'
    | 'downvoteSite'
    | 'readComment'
    | 'readComments'
    | `readSite`;

// src/contracts/types/types.ts

export type FreechCommentResult = Comment;
export type FreechCommentsResult = Comment[];
export type FreechSiteResult = Site;


export type ContractResult = { state: FreechState } | { result: FreechCommentResult } |
    { result: FreechCommentsResult } |  { result: FreechSiteResult };

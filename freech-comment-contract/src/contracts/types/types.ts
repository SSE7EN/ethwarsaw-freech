export interface FreechState {
    siteComments: Map<String, Comment[]>;
}

interface Comment {
    id: number;
    timestamp: number;
    creator: string;
    content: string;
    votes: {
        addresses: string[];
        status: number;
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
    | 'readComment'
    | 'readComments';

// src/contracts/types/types.ts

export type FreechCommentResult = Comment;
export type FreechCommentsResult = Comment[];

export type ContractResult = { state: FreechState } | { result: FreechCommentResult } | { result: FreechCommentsResult };

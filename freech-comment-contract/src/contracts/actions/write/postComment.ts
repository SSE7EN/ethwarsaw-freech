import {ContractResult, FreechAction, FreechState} from "../../types/types";
declare const ContractError;

export const postComment = async (
    state: FreechState,
    { caller, input: { content, originHash } }: FreechAction
): Promise<ContractResult> => {
    const comments = state.siteComments[originHash] == undefined ? [] : state.siteComments[originHash];
    const id = ++state.commentsCount;
    if (!content) {
        throw new ContractError(`Creator must provide a message content.`);
    }
    const comment = {
        id,
        timestamp: SmartWeave.block.timestamp,
        creator: caller,
        content,
        votes: {
            addresses: [],
            up: 0,
            down: 0,
        },
    };

    state.users[caller] = state.users[caller] != undefined ? state.users[caller] : {comments: new Map<number, Comment>};
    state.users[caller].comments[comment.id] = comment;

    comments.push(comment)

    state.siteComments[originHash] = comments;
    return { state };
};

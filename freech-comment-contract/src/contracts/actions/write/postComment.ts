import {ContractResult, FreechAction, FreechState} from "../../types/types";
declare const ContractError;

export const postComment = async (
    state: FreechState,
    { caller, input: { content, originHash } }: FreechAction
): Promise<ContractResult> => {
    const comments = state.siteComments[originHash] == undefined ? [] : state.siteComments[originHash];
    const id = comments.length == 0 ? 1 : comments.length + 1;
    if (!content) {
        throw new ContractError(`Creator must provide a message content.`);
    }
    comments.push({
        id,
        creator: caller,
        content,
        votes: {
            addresses: [],
            status: 0,
        },
    })

    state.siteComments[originHash] = comments;
    return { state };
};

import {Action, ContractResult, State} from "../../types/types";


export const updateProfile = async (
    state: State,
    { caller, input: { description, twitterUrl } }: Action
) : Promise<ContractResult> => {
    state.users[caller] = state.users[caller] != undefined ? state.users[caller] : { description: "xx", twitterUrl: "xx" };
    state.users[caller].description = description;
    state.users[caller].twitterUrl = twitterUrl;
    return { state }
}

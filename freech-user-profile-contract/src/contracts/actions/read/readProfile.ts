import {Action, ContractResult, State} from "../../types/types";

export const readProfile = async (state: State, { input: { userId } }: Action): Promise<ContractResult> => {

    const user = state.users[userId] != undefined ? state.users[userId] : {};
    return { result:  user};
};

import {Action, ContractResult, State} from "./types/types";
import {updateProfile} from "./actions/write/updateUserProfile";
import {readProfile} from "./actions/read/readProfile";

declare const ContractError;

export async function handle(state: State, action: Action): Promise<ContractResult> {
    const input = action.input;

    switch (input.function) {
        case 'updateProfile':
            return await updateProfile(state, action);
        case 'readProfile':
            return await readProfile(state, action);
        default:
            throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
    }
}

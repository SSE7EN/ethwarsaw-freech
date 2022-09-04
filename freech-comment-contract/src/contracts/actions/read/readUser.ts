import { FreechAction, FreechState, ContractResult } from '../../types/types';

export const readUser = async (state: FreechState, { input: { user } }: FreechAction): Promise<ContractResult> => {

    return { result: state.users[user] != undefined ? state.users[user] : {} };
};

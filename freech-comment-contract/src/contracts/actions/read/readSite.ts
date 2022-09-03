import { FreechAction, FreechState, ContractResult } from '../../types/types';

declare const ContractError;

export const readSite = async (state: FreechState, { input: { originHash } }: FreechAction): Promise<ContractResult> => {

    const site = state.sites[originHash];
    if(!site){
        throw new ContractError(`Site for this hash does not exists`);
    }

    return { result: site };
};

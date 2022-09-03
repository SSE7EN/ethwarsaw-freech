import { FreechAction, FreechState, ContractResult } from '../../types/types';

declare const ContractError;

export const upvoteSite = async (
    state: FreechState,
    { caller, input: { originHash } }: FreechAction
): Promise<ContractResult> => {
    let site = state.sites[originHash];
    if(!site){
        state.sites[originHash] = {
            votes: {
                addresses: [],
                status: 0,
            },
        }
        site = state.sites[originHash];
    }

    if (site.votes.addresses.includes(caller)) {
        throw new ContractError(`Caller has already voted.`);
    }

    site.votes.status++;
    site.votes.addresses.push(caller);

    return { state };
};

export const downvoteSite = async (
    state: FreechState,
    { caller, input: { originHash } }: FreechAction
): Promise<ContractResult> => {
    let site = state.sites[originHash];
    if(!site){
        state.sites[originHash] = {
            votes: {
                addresses: [],
                status: 0,
            },
        }
        site = state.sites[originHash];
    }

    if (site.votes.addresses.includes(caller)) {
        throw new ContractError(`Caller has already voted.`);
    }

    if (site.votes.addresses.includes(caller)) {
        throw new ContractError(`Caller has already voted.`);
    }

    site.votes.status--;
    site.votes.addresses.push(caller);

    return { state };
};

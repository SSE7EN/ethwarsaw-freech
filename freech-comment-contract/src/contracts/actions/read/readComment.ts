import { FreechAction, FreechState, ContractResult } from '../../types/types';

declare const ContractError;

export const readComment = async (state: FreechState, { input: { originHash, commentId } }: FreechAction): Promise<ContractResult> => {

  const comments = state.siteComments[originHash];
  if(!comments){
    throw new ContractError(`Comment for this hash does not exists`);
  }
  const comment = comments.find((m) => (m.id = commentId));

  if (!comment) {
    throw new ContractError(`Comment with id: ${originHash} does not exist`);
  }

  return { result: comment };
};

export const readComments = async (state: FreechState, { input: { originHash } }: FreechAction): Promise<ContractResult> => {

  const comments = state.siteComments[originHash] != undefined ? state.siteComments[originHash] : {};

  return { result: comments };
};

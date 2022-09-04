import {FreechAction, FreechState, ContractResult, Comment} from '../../types/types';

declare const ContractError;

export const upvoteComment = async (
  state: FreechState,
  { caller, input: { originHash, commentId } }: FreechAction
): Promise<ContractResult> => {
  const comments = state.siteComments[originHash];
  if(!comments){
    throw new ContractError(`Comment for this hash does not exists`);
  }

  const comment = comments.find((m) => (m.id == commentId));

  if (!comment) {
    throw new ContractError(`Comment does not exist.`);
  }

  if (caller == comment.creator) {
    throw new ContractError(`Comment creator cannot vote for they own message.`);
  }

  if (comment.votes.addresses.includes(caller)) {
    throw new ContractError(`Caller has already voted.`);
  }

  comment.votes.up++;
  comment.votes.addresses.push(caller);
  updateUserComment(state, comment);

  return { state };
};

export const downvoteComment = async (
  state: FreechState,
  { caller, input: { originHash, commentId } }: FreechAction
): Promise<ContractResult> => {
  const comments = state.siteComments[originHash];
  if(!comments){
    throw new ContractError(`Comment for this hash does not exists`);
  }
  const comment = comments.find((m) => (m.id == commentId));

  if (!comment) {
    throw new ContractError(`Comment does not exist.`);
  }

  if (caller == comment.creator) {
    throw new ContractError(`Comment creator cannot vote for they own message.`);
  }

  if (comment.votes.addresses.includes(caller)) {
    throw new ContractError(`Caller has already voted.`);
  }

  comment.votes.down++;
  comment.votes.addresses.push(caller);
  updateUserComment(state, comment);

  return { state };
};

const updateUserComment =  (
    state: FreechState, comment: Comment
): void => {
  const user = state.users[comment.creator];
  user.comments[comment.id] = comment;
};


import { ContractResult, FreechAction, FreechCommentResult, FreechState } from './types/types';
import { downvoteComment, upvoteComment } from './actions/write/voting';
import { postComment } from './actions/write/postComment';
import { readComment, readComments } from './actions/read/readComment';

declare const ContractError;

export async function handle(state: FreechState, action: FreechAction): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'postComment':
      return await postComment(state, action);
    case 'upvoteComment':
      return await upvoteComment(state, action);
    case 'downvoteComment':
      return await downvoteComment(state, action);
    case 'readComment':
      return await readComment(state, action);
    case 'readComments':
      return await readComments(state, action);
    default:
      throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
  }
}

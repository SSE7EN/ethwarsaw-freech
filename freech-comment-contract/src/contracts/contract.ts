import { ContractResult, FreechAction, FreechCommentResult, FreechState } from './types/types';
import { downvoteComment, upvoteComment } from './actions/write/commentVoting';
import { postComment } from './actions/write/postComment';
import { readComment, readComments } from './actions/read/readComment';
import {upvoteSite, downvoteSite} from "./actions/write/siteVoting";
import {readSite} from "./actions/read/readSite";
import {readUser} from "./actions/read/readUser";

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
    case 'upvoteSite':
      return await upvoteSite(state, action);
    case 'downvoteSite':
      return await downvoteSite(state, action);
    case 'readComment':
      return await readComment(state, action);
    case 'readComments':
      return await readComments(state, action);
    case 'readSite':
      return await readSite(state, action);
    case 'readUser':
      return await readUser(state, action);
    default:
      throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
  }
}

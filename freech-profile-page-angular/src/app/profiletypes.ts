export interface State {
  users: Map<String, UserProfile>
}

interface UserProfile {
  description: string;
  twitterUrl: string;
}

export interface Input {
  function: Function;
  userId: string;
  description: string;
  twitterUrl: string;
}

export interface Action {
  input: Input;
  caller: string;
}

export type Function =
  | 'updateProfile'
  | 'readProfile';

export type UserProfileResult = UserProfile;
export type UserProfileNotExistResult = {};

export type ContractResult = { state: State } | { result: UserProfileResult }
  | {result: UserProfileNotExistResult} | {result: String};

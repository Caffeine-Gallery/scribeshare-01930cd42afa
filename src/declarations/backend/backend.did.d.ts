import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Post {
  'id' : bigint,
  'title' : string,
  'content' : string,
  'timestamp' : bigint,
}
export interface _SERVICE {
  'createPost' : ActorMethod<[string, string], Post>,
  'deletePost' : ActorMethod<[bigint], boolean>,
  'getAllPosts' : ActorMethod<[], Array<Post>>,
  'getPost' : ActorMethod<[bigint], [] | [Post]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

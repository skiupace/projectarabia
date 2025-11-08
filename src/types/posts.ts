import type { UserBadgeWithMetadata } from "./badges";

export type PostWithUsername = {
  postId: string;
  title: string;
  url: string | null;
  text: string | null;
  votes: number;
  username: string;
  userBadges: UserBadgeWithMetadata[];
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
  didReport: boolean;
  didVote: boolean;
  hidden: boolean;
};

export type CommentWithUsername = {
  id: string;
  username: string;
  text: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  didReport: boolean;
  didVote: boolean;
  hidden: boolean;
};

export type PostWithComments = {
  post: PostWithUsername;
  comments: CommentWithUsername[];
};

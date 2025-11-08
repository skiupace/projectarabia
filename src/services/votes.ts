import { createVote, deleteVote } from "@/db/queries/votes";
import { decrementVoteCount, incrementVoteCount } from "@/db/queries/posts";
import {
  decrementVoteCountComment,
  incrementVoteCountComment,
} from "@/db/queries/comments";

export async function votePost(postId: string, userId: string) {
  const vote = await createVote({
    postId,
    userId,
    value: 1, // upvote
  });

  await incrementVoteCount(postId);

  return vote;
}

export async function unvotePost(postId: string, userId: string) {
  const vote = await deleteVote({
    postId,
    userId,
    value: 1,
  });

  if (!vote) {
    throw new Error("Vote not found");
  }

  await decrementVoteCount(postId);

  return vote;
}

export async function voteComment(commentId: string, userId: string) {
  const vote = await createVote({
    commentId,
    userId,
    value: 1, // upvote
  });

  await incrementVoteCountComment(commentId);

  return vote;
}

export async function unvoteComment(commentId: string, userId: string) {
  const vote = await deleteVote({
    commentId,
    userId,
    value: 1,
  });

  if (!vote) {
    throw new Error("Vote not found");
  }

  await decrementVoteCountComment(commentId);

  return vote;
}

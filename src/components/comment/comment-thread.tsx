import CommentItem from "./comment-item";

export interface Comment {
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
}

export interface CommentThreadProps {
  comments: Comment[];
  postId: string;
  postHidden?: boolean;
}

// Build a tree structure from flat comments list
function buildCommentTree(comments: Comment[]): Map<string | null, Comment[]> {
  const commentMap = new Map<string | null, Comment[]>();

  // Group comments by parentId
  comments.forEach((comment) => {
    const parentId = comment.parentId;
    if (!commentMap.has(parentId)) {
      commentMap.set(parentId, []);
    }
    commentMap.get(parentId)?.push(comment);
  });

  // Sort each group by creation time (oldest first, HN style)
  commentMap.forEach((commentList) => {
    commentList.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  });

  return commentMap;
}

// Recursive component to render comment and its children
function CommentNode({
  comment,
  commentMap,
  depth,
  postId,
  postHidden,
}: {
  comment: Comment;
  commentMap: Map<string | null, Comment[]>;
  depth: number;
  postId: string;
  postHidden?: boolean;
}) {
  const children = commentMap.get(comment.id) || [];

  return (
    <CommentItem
      postId={postId}
      depth={depth}
      comment={comment}
      postHidden={postHidden}
    >
      {children.length > 0 &&
        children.map((child) => (
          <CommentNode
            key={child.id}
            comment={child}
            commentMap={commentMap}
            depth={depth + 1}
            postId={postId}
            postHidden={postHidden}
          />
        ))}
    </CommentItem>
  );
}

export default function CommentThread({
  comments,
  postId,
  postHidden = false,
}: CommentThreadProps) {
  // Build tree structure
  const commentMap = buildCommentTree(comments);

  // Get root level comments (parentId is null)
  const rootComments = commentMap.get(null) || [];

  if (rootComments.length === 0) {
    return (
      <div className="w-full px-2 py-4 text-xs font-mono text-zinc-500">
        لا توجد تعليقات بعد.
      </div>
    );
  }

  return (
    <div className="w-full">
      {rootComments.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          commentMap={commentMap}
          depth={0}
          postId={postId}
          postHidden={postHidden}
        />
      ))}
    </div>
  );
}

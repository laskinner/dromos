import { useEffect } from "react";
import { useNodeStore } from "@/stores/useNodeStore";
import { useCommentStore } from "@/stores/useCommentStore";
import { CommentForm } from "./CommentForm";

export const CommentList = () => {
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const { comments, fetchComments } = useCommentStore();

  useEffect(() => {
    if (selectedNodeId) {
      console.log("Fetching comments for Node ID:", selectedNodeId);
      fetchComments(selectedNodeId);
    }
  }, [selectedNodeId, fetchComments]);

  if (!selectedNodeId) {
    return <div>Select a node to view comments.</div>;
  }

  return (
    <div>
      <hr />
      <div>
        <p>Comments</p>
      </div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.content}</p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      <CommentForm nodeId={selectedNodeId} />
    </div>
  );
};

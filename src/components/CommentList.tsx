import { useEffect } from "react";
import { useNodeStore } from "@/stores/useNodeStore"; // Adjust path as needed
import { useCommentStore } from "@/stores/useCommentStore"; // Adjust path as needed
import { CommentForm } from "./CommentForm";

export const CommentList = () => {
  const { getSelectedNode } = useNodeStore();
  const { comments, fetchComments } = useCommentStore();

  useEffect(() => {
    const selectedNode = getSelectedNode();
    console.log("Selected Node ID:", selectedNode?.id);
    if (selectedNode) {
      fetchComments(selectedNode.id);
    }
  }, [getSelectedNode, fetchComments]);

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
            {/* Display other comment details as needed */}
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      <CommentForm nodeId={getSelectedNode()?.id} />
    </div>
  );
};

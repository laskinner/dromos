import { useEffect } from "react";
import { useNodeStore } from "@/stores/useNodeStore"; // Adjust path as needed
import { useCommentStore } from "@/stores/useCommentStore"; // Adjust path as needed
import { CommentForm } from "./CommentForm";

export const CommentList = () => {
  const { getSelectedNode } = useNodeStore();
  const { comments, fetchComments } = useCommentStore();

  // Move selectedNode definition here, outside useEffect
  const selectedNode = getSelectedNode();

  useEffect(() => {
    console.log("Selected Node ID:", selectedNode?.id);
    if (selectedNode) {
      fetchComments(selectedNode.id);
    }
  }, [selectedNode, fetchComments]); // Note: You might need to adjust dependencies based on your state management

  if (!selectedNode) {
    // Handle the case where no node is selected, perhaps with a placeholder message or empty fragment
    return null; // or <div>Select a node to view comments.</div>
  }

  return (
    <div>
      <hr />
      <div>
        <p>Comments</p>
      </div>
      {/* If the component has reached here, selectedNode is defined, so selectedNode.id is safe to use */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.content}</p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      <CommentForm nodeId={selectedNode.id} />{" "}
      {/* Now it's safe because of the check above */}
    </div>
  );
};

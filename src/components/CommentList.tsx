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
        <h2 className="text-2xl font-bold text-gray-700 mt-4">Comments</h2>
      </div>
      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4 p-4 border rounded shadow-sm">
              <p className="font-semibold">{comment.owner_username}</p>
              <p className="text-gray-600">{comment.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      <div className="mt-4">
        <CommentForm nodeId={selectedNodeId} />
      </div>
    </div>
  );
};

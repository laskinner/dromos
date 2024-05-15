import React, { useState, useEffect } from "react";
import { useCommentStore, CommentData } from "@/stores/useCommentStore";
import { useUserStore } from "@/stores/useUserStore";
import { CommentForm } from "./CommentForm";
import { useNodeStore } from "@/stores/useNodeStore";

export const CommentList: React.FC = () => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [initialContent, setInitialContent] = useState<string | null>(null);
  const deleteComment = useCommentStore((state) => state.deleteComment);
  const { comments, fetchComments } = useCommentStore();
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const currentUser = useUserStore((state) => state.currentUser);

  useEffect(() => {
    if (selectedNodeId) {
      console.log("Fetching comments for Node ID:", selectedNodeId);
      fetchComments(selectedNodeId);
      fetchUserProfile();
    }
  }, [selectedNodeId, fetchComments, fetchUserProfile]);

  const handleEdit = (id: string, content: string) => {
    setEditingCommentId(id);
    setInitialContent(content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setInitialContent(null);
  };

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
          comments.map((comment: CommentData) => (
            <div key={comment.id} className="mb-4 p-4 border rounded shadow-sm">
              {editingCommentId === comment.id ? (
                <CommentForm
                  nodeId={comment.node}
                  commentId={comment.id}
                  initialContent={initialContent ?? comment.content} // Ensure initialContent is used
                  onCancelEdit={handleCancelEdit}
                />
              ) : (
                <>
                  <p className="font-semibold">{comment.owner_username}</p>
                  <p className="text-gray-600">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                  {currentUser?.username === comment.owner_username && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        className="text-blue-500"
                        onClick={() => handleEdit(comment.id, comment.content)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => deleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
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

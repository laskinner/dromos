import { create } from "zustand";
import axios from "axios";

// Define the interface for comment data
export interface CommentData {
  id: string;
  content: string;
  owner_username: string;
  created_at: string;
  node: string;
}

// Define the state and actions
interface CommentState {
  comments: CommentData[];
  fetchComments: (nodeId: string) => Promise<void>;
  addComment: (comment: CommentData) => void;
  editComment: (id: string, content: string, nodeId: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  fetchComments: async (nodeId) => {
    try {
      const response = await axios.get<CommentData[]>(
        `/api/comments/?node=${nodeId}`,
      );
      set({ comments: response.data });
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  },
  addComment: (comment: CommentData) =>
    set((state) => ({
      comments: [...state.comments, comment],
    })),
  editComment: async (id, content, nodeId) => {
    try {
      const response = await axios.put<CommentData>(`/api/comments/${id}/`, {
        content,
        node: nodeId,
      });
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === id ? response.data : comment,
        ),
      }));
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  },
  deleteComment: async (id) => {
    try {
      await axios.delete(`/api/comments/${id}/`);
      set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  },
}));

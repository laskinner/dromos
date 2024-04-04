import { create } from "zustand";
import axios from "axios";

interface CommentData {
  id: string;
  content: string;
}

// Define the state and actions for your comment store
interface CommentState {
  comments: CommentData[];
  fetchComments: (nodeId: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  fetchComments: async (nodeId) => {
    try {
      // Use the CommentData interface to type the Axios response
      const response = await axios.get<CommentData[]>(
        `/api/comments/?node=${nodeId}`,
      );
      // Now response.data is an array of CommentData objects
      set({ comments: response.data });
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  },
}));

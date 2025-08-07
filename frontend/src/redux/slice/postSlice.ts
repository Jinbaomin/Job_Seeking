import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IBackendRes, IPost, IComment } from '../../types/backend';
import {
  callGetPosts,
  callCreatePost,
  callUpdatePost,
  callDeletePost,
  callLikePost,
  callGetCommentsByPostId,
  callCreateComment,
  callUpdateComment,
  callDeleteComment,
  callLikeComment,
  callReplyComment,
} from '../../config/api';

interface PostState {
  posts: IPost[];
  currentPost: IPost | null;
  comments: IComment[];
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
}

const initialState: PostState = {
  posts: [],
  currentPost: null,
  comments: [],
  loading: false,
  error: null,
  total: 0,
  pages: 0
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 5, firstFetch = false }: { page?: number; limit?: number, firstFetch?: boolean }) => {
    const response = await callGetPosts({ page, limit });
    return {
      posts: response.data.data.result,
      meta: response.data.data.meta,
      firstFetch
    };
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: { content: string; images?: string[]; tags?: string[] }) => {
    const response = await callCreatePost(postData);
    return response.data.data;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }: { id: string; postData: Partial<IPost> }) => {
    const response = await callUpdatePost(id, postData);
    return response.data.data;
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string) => {
    await callDeletePost(id);
    return id;
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (id: string) => {
    const response = await callLikePost(id);
    return response.data.data;
  }
);

export const fetchComments = createAsyncThunk(
  'posts/fetchComments',
  async ({ postId, page = 1, limit = 10 }: { postId: string; page?: number; limit?: number }) => {
    const response = await callGetCommentsByPostId(postId, { page, limit });
    return response.data.data;
  }
);

export const createComment = createAsyncThunk(
  'posts/createComment',
  async (commentData: { content: string; postId: string; parentCommentId?: string }) => {
    const response = await callCreateComment(commentData);
    return response.data.data;
  }
);

export const updateComment = createAsyncThunk(
  'posts/updateComment',
  async ({ id, commentData }: { id: string; commentData: Partial<IComment> }) => {
    const response = await callUpdateComment(id, commentData);
    return response.data.data;
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async (id: string) => {
    await callDeleteComment(id);
    return id;
  }
);

export const likeComment = createAsyncThunk(
  'posts/likeComment',
  async (id: string) => {
    const response = await callLikeComment(id);
    return response.data.data;
  }
);

export const replyComment = createAsyncThunk(
  'posts/replyComment',
  async ({ id, replyData }: { id: string; replyData: { content: string } }) => {
    const response = await callReplyComment(id, replyData);
    return response.data.data;
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCurrentPost: (state, action: PayloadAction<IPost | null>) => {
      state.currentPost = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.meta.total;
        state.pages = action.payload.meta.pages;

        if(action.payload.firstFetch) state.posts = action.payload.posts;
        else state.posts = [...state.posts, ...action.payload.posts];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      });

    // Create post
    builder
      .addCase(createPost.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        // state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.error.message || 'Failed to create post';
      });

    // Update post
    builder
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update post';
      });

    // Delete post
    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete post';
      });

    // Like post
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      });

    // Fetch comments
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.result;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      });

    // Create comment
    builder
      .addCase(createComment.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        // state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.error.message || 'Failed to create comment';
      });

    // Update comment
    builder
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex(comment => comment._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update comment';
      });

    // Delete comment
    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(comment => comment._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete comment';
      });

    // Like comment
    builder
      .addCase(likeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      });

    // Reply comment
    builder
      .addCase(replyComment.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(replyComment.fulfilled, (state, action) => {
        // state.loading = false;
        // Add reply to the parent comment's replies array
        const indexParentComment = state.comments.findIndex(comment => comment._id === action.payload.parentCommentId);
        if (indexParentComment !== -1) {
          state.comments[indexParentComment].replies.push(action.payload);
        }
      })
      .addCase(replyComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reply to comment';
      });
  },
});

export const { setCurrentPost, clearError, clearComments } = postSlice.actions;
export default postSlice.reducer; 
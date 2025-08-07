import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  replyComment,
  setCurrentPost,
  clearError,
  clearComments,
} from '../redux/slice/postSlice';

export const usePosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, currentPost, comments, loading, error, total } = useSelector(
    (state: RootState) => state.post
  );

  return {
    // State
    posts,
    currentPost,
    comments,
    loading,
    error,
    total,

    // Actions
    fetchPosts: (page?: number, limit?: number) => 
      dispatch(fetchPosts({ page, limit })),
    
    createPost: (postData: { content: string; images?: string[]; tags?: string[] }) =>
      dispatch(createPost(postData)),
    
    updatePost: (id: string, postData: Partial<any>) =>
      dispatch(updatePost({ id, postData })),
    
    deletePost: (id: string) => dispatch(deletePost(id)),
    
    likePost: (id: string) => dispatch(likePost(id)),
    
    fetchComments: (postId: string, page?: number, limit?: number) =>
      dispatch(fetchComments({ postId, page, limit })),
    
    createComment: (commentData: { content: string; postId: string; parentCommentId?: string }) =>
      dispatch(createComment(commentData)),
    
    updateComment: (id: string, commentData: Partial<any>) =>
      dispatch(updateComment({ id, commentData })),
    
    deleteComment: (id: string) => dispatch(deleteComment(id)),
    
    likeComment: (id: string) => dispatch(likeComment(id)),
    
    replyComment: (id: string, replyData: { content: string }) =>
      dispatch(replyComment({ id, replyData })),
    
    setCurrentPost: (post: any) => dispatch(setCurrentPost(post)),
    
    clearError: () => dispatch(clearError()),
    
    clearComments: () => dispatch(clearComments()),
  };
}; 
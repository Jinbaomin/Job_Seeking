"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MessageCircle, ThumbsUp, ArrowLeft, Send } from "lucide-react"
import MainLayout from "../../components/layout/MainLayout"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { fetchComments, createComment, likeComment, fetchPosts, replyComment, likePost } from '../../redux/slice/postSlice'
import type { IUser } from "../../types/backend"

interface IPostDetailPage {
  postId: string;
}

const PostDetailPage: React.FC = () => {
  // const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const [newCommentContent, setNewCommentContent] = useState("")
  const [replyToComment, setReplyToComment] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const postId = window.location.pathname.split('/').at(-1)

  const dispatch = useAppDispatch()
  const { posts, comments, loading, error } = useAppSelector(state => state.post)
  const user: IUser = JSON.parse(localStorage.getItem('user') || '{}')

  // Find the current post
  const currentPost = posts.find(post => post._id === postId)

  const commentsContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTo({
        top: commentsContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  useEffect(() => {
    // Only scroll when new comments are added (not on initial load)
    if (comments.length > 0) {
      scrollToBottom();
    }
  }, [comments.length]);

  // useEffect(() => {
  //   dispatch(fetchPosts({ page: 1, limit: 10 }))
  // }, [dispatch])

  useEffect(() => {
    if (postId) {
      dispatch(fetchComments({ postId, page: 1, limit: 50 }))
    }
  }, [dispatch, postId])

  const handleCreateComment = () => {
    if (newCommentContent.trim() && postId) {
      dispatch(createComment({
        content: newCommentContent,
        postId: postId
      }))
      setNewCommentContent("")
      // Scroll to bottom after a short delay to ensure the comment is added
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }

  const handleReplyComment = (commentId: string) => {
    if (replyContent.trim() && postId) {
      dispatch(replyComment({
        id: commentId,
        replyData: { content: replyContent }
      }))
      setReplyContent("")
      setReplyToComment(null)
      // Scroll to bottom after reply is added
      // setTimeout(() => {
      //   scrollToBottom();
      // }, 100);
    }
  }

  const handleLikeComment = (commentId: string) => {
    dispatch(likeComment(commentId))
  }

  const handleLikePost = (postId: string) => {
    console.log('like');
    // This would need to be implemented in the postSlice
    dispatch(likePost(postId))
  }

  if (!currentPost && loading) {
    return (
      <div>
        <div className="max-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Back Button Skeleton */}
            <div className="flex items-center space-x-2 mb-6 animate-pulse">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>

            {/* Post Detail Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-5 bg-gray-300 rounded w-24"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="flex space-x-1">
                      <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-300 rounded w-full"></div>
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="flex items-center space-x-6 mt-4">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Comment Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-pulse">
              <div className="h-5 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-300 rounded"></div>
                <div className="flex justify-end">
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>

            {/* Comments Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-5 bg-gray-300 rounded w-32 mb-6"></div>
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="h-3 bg-gray-300 rounded w-20"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="h-3 bg-gray-300 rounded w-12"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPost && !loading) {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Bài viết không tồn tại</p>
            <button
              onClick={() => navigate('/forum')}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="px-4 py-8">
        {/* Back Button */}
        {/* <button
          onClick={() => navigate('/forum')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button> */}

        <div className="flex gap-4">
          {/* Post Detail */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 w-[63%] self-start max-h-[80vh] overflow-auto">
            <div className="flex items-start space-x-4">
              {/* <img
                src={currentPost?.author.avatar || "/placeholder.svg"}
                alt={currentPost?.author.name}
                className="w-12 h-12 rounded-full object-cover"
              /> */}

              <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center">
                {currentPost?.author.name.split(' ').at(-1)?.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{currentPost?.author.name}</h4>
                  <span className="text-sm text-gray-500">• {new Date(currentPost?.createdAt || '').toLocaleDateString('vi-VN')}</span>
                  {currentPost?.tags && currentPost.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {currentPost.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {currentPost.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          +{currentPost.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-gray-900 mb-4">
                  <p className="text-lg leading-relaxed">{currentPost?.content}</p>
                </div>

                {currentPost?.images && currentPost.images.length > 0 && (
                  <div className="mb-4">
                    {/* <img
                      src={currentPost.images[0]}
                      alt="Post image"
                      className="w-full max-h-96 object-cover rounded-lg"
                    /> */}
                    <img
                      // src={`${import.meta.env.VITE_BACKEND_URL.split('/api')[0]}/${post.images[0]}`}
                      src={`${!currentPost.images[0].startsWith('https') ? `${import.meta.env.VITE_BACKEND_URL.split('/api')[0]}/${currentPost.images[0]}` : `${currentPost.images[0]}`}`}
                      alt="Post image"
                      className="w-full h-90 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <button
                    onClick={() => handleLikePost(currentPost?._id || '')}
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                  >
                    <ThumbsUp className={`w-5 h-5 hover:cursor-pointer ${currentPost?.likes.some(like => like._id === user._id) ? 'text-blue-500 fill-current' : ''}`} />
                    <span>{currentPost?.likes ? currentPost.likes.length : 0}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-5 h-5" />
                    <span>{comments.length} bình luận</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {/* Comments List */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-6">Bình luận ({comments.length})</h3>

                {loading ? (
                  <div className="space-y-6">
                    {[...Array(1)].map((_, index) => (
                      <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0 animate-pulse">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="h-4 bg-gray-300 rounded w-24"></div>
                              <div className="h-3 bg-gray-300 rounded w-20"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-300 rounded w-full"></div>
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </div>
                            <div className="flex items-center space-x-4 mt-3">
                              <div className="h-3 bg-gray-300 rounded w-12"></div>
                              <div className="h-3 bg-gray-300 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">Lỗi: {error}</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Chưa có bình luận nào</p>
                  </div>
                ) : (
                  <div ref={commentsContainerRef} className="space-y-6 overflow-y-auto max-h-[60vh]">
                    {comments.map((comment) => (
                      <div key={comment._id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          {/* <img
                            src={comment.author.avatar || "/placeholder.svg"}
                            alt={comment.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          /> */}
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center">
                            {comment.author.name.split(' ').at(-1)?.charAt(0)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900 text-sm">{comment.author.name}</h4>
                              <span className="text-xs text-gray-500">• {new Date(comment.createdAt || '').toLocaleDateString('vi-VN')}</span>
                            </div>

                            <p className="text-gray-700 mb-3">{comment.content}</p>

                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <button
                                onClick={() => handleLikeComment(comment._id || '')}
                                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                              >
                                <ThumbsUp className={`w-4 h-4 ${comment.likes.some(like => like._id === user._id) ? 'text-blue-500 fill-current' : ''}`} />
                                <span>{comment.likes ? comment.likes.length : 0}</span>
                              </button>
                              <button
                                onClick={() => setReplyToComment(replyToComment === comment._id ? null : comment._id || '')}
                                className="hover:text-blue-500 transition-colors"
                              >
                                Trả lời
                              </button>
                            </div>

                            {/* Reply Form */}
                            {replyToComment === comment._id && (
                              <div className="mt-4 space-y-3">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Viết trả lời..."
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent resize-none text-sm"
                                  rows={2}
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleReplyComment(comment._id || '')}
                                    disabled={loading || !replyContent.trim()}
                                    className="px-4 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    Gửi
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReplyToComment(null)
                                      setReplyContent("")
                                    }}
                                    className="px-4 py-1 text-gray-600 bg-gray-100 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Replied Comments UI */}
                            {comment.replies.length > 0 && (
                              <div className="mt-3 space-y-3">
                                {comment.replies.map((reply: any) => (
                                  <div
                                    key={reply._id}
                                    className="flex items-start space-x-2 bg-gray-100 rounded-lg p-3"
                                  >
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex justify-center items-center">
                                      {reply.author?.name?.split(' ').at(-1)?.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-medium text-gray-900 text-xs">{reply.author?.name}</span>
                                        <span className="text-xs text-gray-500">
                                          • {new Date(reply.createdAt || '').toLocaleDateString('vi-VN')}
                                        </span>
                                      </div>
                                      <div className="text-gray-700 text-sm">{reply.content}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3">
                {/* <h3 className="font-semibold text-gray-900 mb-4">Thêm bình luận</h3> */}
                <form className="flex gap-2 items-center">
                  {/* <textarea
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent resize-none"
                      rows={3}
                    /> */}
                  <input
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent resize-none"
                  // rows={3}
                  />
                  <button
                    onClick={handleCreateComment}
                    disabled={loading || !newCommentContent.trim()}
                    className="w-12 h-12 px-2 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 flex justify-center items-center"
                  >
                    <Send className="w-4 h-4" />
                    {/* <span>Gửi bình luận</span> */}
                  </button>
                </form>
              </div>
            </div>

            {/* Create Comment */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Thêm bình luận</h3>
                <div className="space-y-4">
                  <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleCreateComment}
                      disabled={loading || !newCommentContent.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Gửi bình luận</span>
                    </button>
                  </div>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage 
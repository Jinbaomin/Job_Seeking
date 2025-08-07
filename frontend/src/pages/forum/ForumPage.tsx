"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MessageCircle, Eye, Heart, ThumbsUp, Plus, Star, Users, FileText } from "lucide-react"
import MainLayout from "../../components/layout/MainLayout"
import { fetchPosts, createPost, likePost } from '../../redux/slice/postSlice'
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import type { IUser } from "../../types/backend"
import Modal from "../../components/common/Modal"
import PostDetailPage from "./PostDetailPage"
import CreatePostModal from '../../components/post/CreatePostModal';
import { callFileUpload } from "../../config/api"
import Header from "../../components/layout/Header"
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll"

const ForumPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("Tất cả chủ đề")
  const [selectedFilter, setSelectedFilter] = useState("Tất cả")
  const [isModalDetailPostOpen, setIsModalDetailOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const firstFetchPost = useRef<boolean>(true);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const dispatch = useAppDispatch();
  const { posts, loading, error, total, pages } = useAppSelector(state => state.post);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(prev => prev + 1);


    if (page == pages - 1)
      setHasMore(false);

    dispatch(fetchPosts({ page: nextPage, limit: 5 }));

  }

  const { isNearBottom } = useInfiniteScroll({
    isLoading: loading,
    hasMore,
    onLoadMore: handleLoadMore,
    threshold: 100
  });

  useEffect(() => {
    dispatch(fetchPosts({ page, limit: 5, firstFetch: true }));
  }, [dispatch])

  useEffect(() => {
    if (!loading && posts.length > 0) firstFetchPost.current = false;
  }, [posts, loading]);

  const handleLikePost = (postId: string) => {
    dispatch(likePost(postId))
  }

  const categories = [
    { name: "Tất cả chủ đề", icon: "📋", color: "bg-blue-500" },
    { name: "Blockchain", icon: "⛓️", color: "bg-purple-500" },
    { name: "C#harp", icon: "🔷", color: "bg-indigo-500" },
    { name: "Docker", icon: "🐳", color: "bg-blue-600" },
    { name: "Javascript", icon: "⚡", color: "bg-yellow-500" },
    { name: "MMO", icon: "🎮", color: "bg-green-500" },
    { name: "Nodejs", icon: "🟢", color: "bg-green-600" },
  ]

  const techTags = ["JavaScript", "Vue.js", "React", "Node.js", "Python", "PHP", "Docker", "AWS"]

  const topMembers = [
    { name: "Huy Đặng Quốc", points: "20,000 điểm", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Đặng Quốc Huy", points: "0 điểm", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Đặng Quốc Huy", points: "0 điểm", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Đặng Quốc Huy", points: "0 điểm", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Đặng Quốc Huy", points: "0 điểm", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  const stats = [
    { label: "Bài viết", value: total.toString(), icon: <FileText className="w-4 h-4" />, color: "text-blue-600" },
    { label: "Thành viên", value: "567", icon: <Users className="w-4 h-4" />, color: "text-green-600" },
    { label: "Lượt xem", value: "12.5k", icon: <Eye className="w-4 h-4" />, color: "text-orange-600" },
  ]

  const quickStats = [
    { label: "Câu hỏi hôm nay", value: "47", icon: "❓", color: "text-blue-600" },
    { label: "Thành viên online", value: "234", icon: "🟢", color: "text-green-600" },
    { label: "Câu trả lời hôm nay", value: "156", icon: "💬", color: "text-purple-600" },
  ]

  const user: IUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6 mt-12">
            {/* Left Sidebar */}
            <div className="col-span-3">
              <div className="sticky top-20">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Danh mục</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${selectedCategory === category.name
                          ? "bg-blue-50 text-blue-700 border border-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>

                  <button className="w-full mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" />
                    <span>Xem thêm</span>
                  </button>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thống kê</h3>
                  <div className="space-y-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={stat.color}>{stat.icon}</span>
                          <span className="text-gray-700">{stat.label}</span>
                        </div>
                        <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-6">
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold mb-2">Nền tảng Hỏi & Đáp IT - ChoCode</h1>
                  <p className="text-blue-100 mb-6">ChoCode là nơi kết nối, giao lưu, chia sẻ kiến thức IT</p>

                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Đặt câu hỏi</span>
                  </button>
                </div>

                {/* Illustration */}
                {/* <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <img
                    src="/images/chocode-illustration.png"
                    alt="ChoCode Illustration"
                    className="w-48 h-32 object-contain opacity-90"
                  />
                </div> */}
              </div>

              {/* Create Post Modal (new) */}
              <CreatePostModal
                onPostCreated={async ({ content, tags, file }) => {
                  let images;
                  if (file) {
                    try {
                      const { data }: any = await callFileUpload(file, 'post');
                      if (data?.data?.fileName) {
                        images = [data.data.fileName];
                      }
                    } catch (e) {
                      // Optionally handle upload error
                      images = undefined;
                    }
                  }
                  const postData: any = { content, tags };
                  if (images) postData.images = images;
                  dispatch(createPost(postData));
                }}
              />

              {/* Tech Tags */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {techTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                      <option>Tất cả câu đáp</option>
                      <option>Chưa trả lời</option>
                      <option>Đã trả lời</option>
                    </select>

                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Tất cả
                      </button>
                      <button className="text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        Đã trả lời
                      </button>
                      <button className="text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        Chưa trả lời
                      </button>
                    </div>
                  </div>

                  <span className="text-sm text-gray-600">{posts.length} bài viết</span>
                </div>
              </div>

              {/* Posts List */}
              {loading && firstFetchPost.current ? (
                <div className="space-y-6">
                  {[...Array(1)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      <div className="flex space-x-4 mt-4">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Lỗi: {error}</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Chưa có bài viết nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        {/* <img
                          src={post.author.avatar || "/placeholder.svg"}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        /> */}

                        <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center">
                          {post.author.name.split(' ').at(-1)?.charAt(0)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                            <span className="text-sm text-gray-500">• {new Date(post.createdAt || '').toLocaleDateString('vi-VN')}</span>
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex space-x-1">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    +{post.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <h3
                            onClick={() => {
                              setIsModalDetailOpen(true)
                              setSelectedPostId(post._id || '')
                              navigate(`/forum/post/${post._id}`)
                            }}
                            className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-4"
                          >
                            {post.content}
                          </h3>

                          {post.images && post.images.length > 0 && (
                            <div className="mb-4">
                              <img
                                // src={`${import.meta.env.VITE_BACKEND_URL.split('/api')[0]}/${post.images[0]}`}
                                src={`${!post.images[0].startsWith('https') ? `${import.meta.env.VITE_BACKEND_URL.split('/api')[0]}/${post.images[0]}` : `${post.images[0]}`}`}
                                alt="Post image"
                                className="w-full h-70 object-cover rounded-lg"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <button
                                onClick={() => handleLikePost(post._id || '')}
                                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                              >
                                <ThumbsUp className={`w-5 h-5 hover:cursor-pointer ${post.likes.some(like => like._id === user._id) ? 'text-blue-500 fill-current' : ''}`} />
                                <span>{post.likes ? post.likes.length : 0}</span>
                              </button>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-5 h-5" />
                                <span>{post.comments ? post.comments.length : 0} bình luận</span>
                              </div>
                            </div>

                            <button
                              // onClick={() => navigate(`/forum/post/${post._id}`)}
                              onClick={() => {
                                setIsModalDetailOpen(true)
                                setSelectedPostId(post._id || '')
                                navigate(`/forum/post/${post._id}`)
                              }}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 px-4 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="space-y-6">
                      {[...Array(1)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded w-32"></div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          </div>
                          <div className="flex space-x-4 mt-4">
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="col-span-3">
              <div className="sticky top-20">
                {/* Top Members */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Thành viên hàng đầu</h3>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Tuần này</option>
                      <option>Tháng này</option>
                      <option>Năm này</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {topMembers.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.points}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
                  <div className="space-y-4">
                    {quickStats.map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{stat.icon}</span>
                          <span className="text-gray-700 text-sm">{stat.label}</span>
                        </div>
                        <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Quảng cáo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Post Modal */}
      <Modal
        maxWidth="max-w-6xl"
        isOpen={isModalDetailPostOpen}
        onClose={() => {
          setIsModalDetailOpen(false)
          navigate('/forum')
        }}
      >
        <PostDetailPage />
      </Modal>
    </div>
  )
}

export default ForumPage

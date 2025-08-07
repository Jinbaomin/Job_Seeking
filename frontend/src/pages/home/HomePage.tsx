"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import MainLayout from "../../components/layout/MainLayout"
import Button from "../../components/common/Button"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { fetchJobs } from "../../redux/slice/jobSlice"
import { fetchCompanies } from "../../redux/slice/companySlice"
import { HeroSection } from "../../components/common/HeroSection"
import ContactNewsletter from "../../components/layout/ContactNewsLetter"
import { formatSalary } from "../../utils/helper"

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const { jobs, loading: jobsLoading } = useAppSelector((state) => state.job)
  const { companies, loading: companiesLoading } = useAppSelector((state) => state.company)



  useEffect(() => {
    dispatch(fetchJobs({ page: 1, limit: 6 })).unwrap()
    dispatch(fetchCompanies({ page: 1, limit: 6 })).unwrap()
  }, [dispatch])



  const jobCategories = [
    { name: "Công nghệ thông tin", count: "1,234", icon: "💻", color: "bg-blue-500" },
    { name: "Marketing", count: "856", icon: "📈", color: "bg-green-500" },
    { name: "Tài chính", count: "642", icon: "💰", color: "bg-yellow-500" },
    { name: "Nhân sự", count: "423", icon: "👥", color: "bg-purple-500" },
    { name: "Thiết kế", count: "387", icon: "🎨", color: "bg-pink-500" },
    { name: "Bán hàng", count: "756", icon: "🛍️", color: "bg-indigo-500" },
  ]

  const stats = [
    { label: "Việc làm", value: "10,000+", icon: "💼" },
    { label: "Công ty", value: "2,500+", icon: "🏢" },
    { label: "Ứng viên", value: "50,000+", icon: "👨‍💼" },
    { label: "Thành công", value: "95%", icon: "✅" },
  ]

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Software Engineer",
      company: "Tech Corp",
      avatar: "/placeholder.svg?height=60&width=60",
      content: "Tôi đã tìm được công việc mơ ước chỉ sau 2 tuần sử dụng platform này. Rất hài lòng!",
      rating: 5,
    },
    {
      name: "Trần Thị B",
      role: "Marketing Manager",
      company: "Digital Agency",
      avatar: "/placeholder.svg?height=60&width=60",
      content: "Giao diện thân thiện, dễ sử dụng. Đã giúp tôi kết nối với nhiều nhà tuyển dụng.",
      rating: 5,
    },
    {
      name: "Lê Văn C",
      role: "UX Designer",
      company: "Creative Studio",
      avatar: "/placeholder.svg?height=60&width=60",
      content: "Platform tuyệt vời với nhiều cơ hội việc làm chất lượng cao.",
      rating: 5,
    },
  ]

  return (
    <MainLayout>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4">
        {/* Statistics Section */}
        <section className="py-16 -mt-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Job Categories Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Danh mục việc làm</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá các ngành nghề phổ biến với hàng nghìn cơ hội việc làm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobCategories.map((category, index) => (
              <Link
                key={index}
                to={`/job?category=${category.name}`}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">{category.count} việc làm</p>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Enhanced Latest Jobs Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 -mx-4 px-4 rounded-3xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">Việc làm mới nhất</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
                </div>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl">
                Cập nhật liên tục từ các nhà tuyển dụng hàng đầu. Đừng bỏ lỡ cơ hội của bạn!
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Cập nhật 5 phút trước</span>
              </div>
              <Link
                to="/job"
                className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Xem tất cả</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {jobsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg animate-pulse">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chưa có việc làm nào</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Hãy quay lại sau để xem các cơ hội mới hoặc đăng ký nhận thông báo khi có việc làm phù hợp
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  Đăng ký thông báo
                </button>
                <Link
                  to="/job"
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                >
                  Tìm kiếm việc làm
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.slice(0, 6).map((job, index) => (
                  <div
                    key={job._id}
                    className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-blue-100 hover:border-blue-400 relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/60 group-hover:to-blue-100/60 transition-all duration-500 rounded-3xl"></div>

                    <div className="relative z-10">
                      {/* Job Header */}
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          {job.name?.charAt(0) || "J"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-1">
                            {job.name || "Tên công việc"}
                          </h3>
                          <p className="text-black font-medium mb-1">{job.companyId?.name || "Tên công ty"}</p>
                          <div className="flex items-center space-x-2 text-sm text-black">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{job.companyId.address || "Địa điểm"}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="bg-blue-100 text-black text-xs font-semibold px-3 py-1 rounded-full">
                            Mới
                          </span>
                          <span className="text-xs text-gray-400">2 giờ trước</span>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-black">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                            <span className="font-semibold">{formatSalary(job.salary)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-black">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{job.level || "Full-time"}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {job.description ||
                            "Mô tả công việc sẽ được hiển thị ở đây. Đây là một cơ hội tuyệt vời để phát triển sự nghiệp của bạn."}
                        </p>

                        {/* Skills Tags */}
                        <div className="flex flex-wrap gap-2">
                          {(job.skills || ["React", "Node.js", "TypeScript"]).slice(0, 3).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="bg-blue-50 text-black text-xs font-medium px-3 py-1 rounded-full border border-blue-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {(job.skills || []).length > 3 && (
                            <span className="bg-blue-100 text-black text-xs font-medium px-3 py-1 rounded-full">
                              +{(job.skills || []).length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Job Footer */}
                      <div className="flex items-center justify-end pt-4 border-t border-blue-100">
                        <Link
                          to={`/job/${job._id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md"
                        >
                          Ứng tuyển ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Section */}
              <div className="text-center mt-16">
                <div className="inline-flex items-center space-x-4 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-gray-600">
                    <span className="font-semibold text-blue-600">{jobs.length}</span> việc làm được hiển thị
                  </div>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <Link to="/job">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Xem tất cả việc làm
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Enhanced Featured Companies Section */}
        <section className="py-20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a1 1 0 011-1h4a1 1 0 011 1v12m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">Công ty nổi bật</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mt-2"></div>
                </div>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl">
                Những đối tác tin cậy với môi trường làm việc tuyệt vời và cơ hội phát triển không giới hạn
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>2,500+ công ty đối tác</span>
              </div>
              <Link
                to="/company"
                className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Khám phá tất cả</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {companiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg animate-pulse">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-300 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-28"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a1 1 0 011-1h4a1 1 0 011 1v12m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chưa có công ty nào</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Hãy quay lại sau để khám phá các công ty mới hoặc đăng ký để nhận thông báo về các đối tác mới
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                  Đăng ký thông báo
                </button>
                <Link
                  to="/company"
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
                >
                  Tìm hiểu công ty
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {companies.slice(0, 6).map((company, index) => (
                  <div
                    key={company._id}
                    className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-blue-100 hover:border-blue-400 relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/50 transition-all duration-500 rounded-3xl"></div>

                    <div className="relative z-10">
                      {/* Company Header */}
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          {company.name?.charAt(0) || "C"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-2 line-clamp-1">
                            {company.name || "Tên công ty"}
                          </h3>
                          <p className="text-gray-600 font-medium mb-2">{company.address || "Địa chỉ công ty"}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1 text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              <span>500-1000 nhân viên</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">4.8 (234 đánh giá)</span>
                        </div>
                      </div>

                      {/* Company Details */}
                      <div className="space-y-4 mb-6">
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {company.description ||
                            "Mô tả công ty sẽ được hiển thị ở đây. Chúng tôi là một công ty công nghệ hàng đầu với môi trường làm việc năng động và nhiều cơ hội phát triển."}
                        </p>

                        {/* Company Stats */}
                        <div className="grid grid-cols-3 gap-4 py-4 bg-blue-50 rounded-2xl">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">25</div>
                            <div className="text-xs text-gray-600">Việc làm</div>
                          </div>
                          <div className="text-center border-l border-r border-gray-200">
                            <div className="text-lg font-bold text-gray-900">1.2K</div>
                            <div className="text-xs text-gray-600">Theo dõi</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">95%</div>
                            <div className="text-xs text-gray-600">Phản hồi</div>
                          </div>
                        </div>

                        {/* Industry Tags */}
                        <div className="flex flex-wrap gap-2">
                          {["Công nghệ", "Startup", "Remote"].map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-blue-50 text-black text-xs font-medium px-3 py-1 rounded-full border border-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Company Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                        <div className="flex items-center space-x-4 text-xs text-black">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Đang tuyển dụng</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Phản hồi trong 24h</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-black hover:text-black hover:bg-blue-50 rounded-lg transition-all duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                          <Link
                            to={`/company/${company._id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-md"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Section */}
              <div className="text-center mt-16">
                <div className="inline-flex items-center space-x-4 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-gray-600">
                    <span className="font-semibold text-blue-600">{companies.length}</span> công ty nổi bật
                  </div>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <Link to="/company">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Khám phá tất cả công ty
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Câu chuyện thành công</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nghe từ những người đã tìm được công việc mơ ước thông qua nền tảng của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center mb-6">
                  {/* <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform duration-300"
                  /> */}
                  <div className="w-16 h-16 rounded-full text-xl object-cover mr-4 bg-blue-500 text-white flex items-center justify-center hover:scale-105 hover:cursor-pointer">
                    {testimonial.name.split(' ').at(-1)?.at(0)}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                    <p className="text-blue-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những tính năng vượt trội giúp bạn tìm việc hiệu quả hơn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Tìm kiếm thông minh</h3>
              <p className="text-gray-600 leading-relaxed">
                Công nghệ AI giúp bạn tìm việc làm phù hợp nhất với kỹ năng và kinh nghiệm của mình
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Ứng tuyển dễ dàng</h3>
              <p className="text-gray-600 leading-relaxed">
                Quy trình ứng tuyển đơn giản, nhanh chóng với chỉ vài cú click chuột
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Cộng đồng lớn</h3>
              <p className="text-gray-600 leading-relaxed">
                Kết nối với hàng nghìn ứng viên và công ty uy tín trên toàn quốc
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        {/* <section className="py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Đăng ký nhận thông báo việc làm</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Nhận thông báo về những cơ hội việc làm mới nhất phù hợp với bạn
            </p>

            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </section> */}
        <ContactNewsletter />

        {/* Enhanced CTA Section */}
        <section className="py-16">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Sẵn sàng bắt đầu sự nghiệp mới?</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Tạo tài khoản ngay hôm nay để khám phá những cơ hội việc làm tốt nhất và kết nối với các nhà tuyển dụng
                hàng đầu
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Đăng ký miễn phí
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Đăng nhập
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Miễn phí 100%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Không spam</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default HomePage

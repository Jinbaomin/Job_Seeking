"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { fetchUsers } from "../../redux/slice/userSlice"
import { fetchJobs } from "../../redux/slice/jobSlice"
import { fetchCompanies } from "../../redux/slice/companySlice"

// Mock data - replace with your Redux selectors
const mockUsers = [
  { _id: "1", name: "Nguyễn Văn A", email: "nguyenvana@email.com", role: "USER", createdAt: "2024-01-15T10:30:00Z" },
  { _id: "2", name: "Trần Thị B", email: "tranthib@email.com", role: "ADMIN", createdAt: "2024-01-14T09:15:00Z" },
  { _id: "3", name: "Lê Văn C", email: "levanc@email.com", role: "USER", createdAt: "2024-01-13T14:20:00Z" },
  { _id: "4", name: "Phạm Thị D", email: "phamthid@email.com", role: "USER", createdAt: "2024-01-12T11:45:00Z" },
  { _id: "5", name: "Hoàng Văn E", email: "hoangvane@email.com", role: "USER", createdAt: "2024-01-11T16:30:00Z" },
]

const mockJobs = [
  {
    _id: "1",
    name: "Frontend Developer",
    companyId: { name: "Tech Corp" },
    salary: 25000000,
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    name: "Backend Developer",
    companyId: { name: "StartUp XYZ" },
    salary: 30000000,
    isActive: true,
    createdAt: "2024-01-14T09:15:00Z",
  },
  {
    _id: "3",
    name: "UI/UX Designer",
    companyId: { name: "Design Studio" },
    salary: 20000000,
    isActive: false,
    createdAt: "2024-01-13T14:20:00Z",
  },
  {
    _id: "4",
    name: "DevOps Engineer",
    companyId: { name: "Cloud Solutions" },
    salary: 35000000,
    isActive: true,
    createdAt: "2024-01-12T11:45:00Z",
  },
  {
    _id: "5",
    name: "Product Manager",
    companyId: { name: "Innovation Hub" },
    salary: 40000000,
    isActive: true,
    createdAt: "2024-01-11T16:30:00Z",
  },
]

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useAppDispatch();
  const { users, total: totalUsers } = useAppSelector(state => state.user);
  const { jobs, total: totalJobs } = useAppSelector(state => state.job);
  const { companies, total: totalCompanies } = useAppSelector(state => state.company);

  // Mock Redux data - replace with actual selectors
  // const users = mockUsers
  // const totalUsers = 1234
  // const jobs = mockJobs
  // const totalJobs = 567
  // const totalCompanies = 89

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 700)

    // Mock dispatch calls - replace with actual Redux dispatch
    dispatch(fetchUsers({ page: 1, limit: 5 }));
    dispatch(fetchJobs({ page: 1, limit: 5 }));
    dispatch(fetchCompanies({ page: 1, limit: 5 }));

    return () => clearTimeout(timer)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên"
      case "USER":
        return "Người dùng"
      default:
        return role
    }
  }

  const StatCard = ({
    title,
    value,
    icon,
    gradient,
    trend,
    trendUp = true,
  }: {
    title: string
    value: number
    icon: React.ReactNode
    gradient: string
    trend?: string
    trendUp?: boolean
  }) => (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
      ></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</p>
            {trend && (
              <div className="flex items-center">
                <div className={`flex items-center text-sm font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}>
                  <svg
                    className={`w-4 h-4 mr-1 ${trendUp ? "" : "rotate-180"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  {trend}
                </div>
                <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>{icon}</div>
        </div>
      </div>
    </div>
  )

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-8">
        <LoadingSkeleton />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hệ thống quản lý việc làm</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={totalUsers}
          trend="+12.5%"
          gradient="from-blue-500 to-blue-600"
          icon={
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Tổng việc làm"
          value={totalJobs}
          trend="+8.2%"
          gradient="from-green-500 to-green-600"
          icon={
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
          }
        />

        <StatCard
          title="Tổng công ty"
          value={totalCompanies}
          trend="+5.7%"
          gradient="from-purple-500 to-purple-600"
          icon={
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Người dùng mới nhất</h3>
              <p className="text-sm text-gray-600 mt-1">Danh sách người dùng đăng ký gần đây</p>
            </div>
            <Link
              to="/admin/users"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Xem tất cả
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.slice(0, 5).map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Việc làm mới nhất</h3>
              <p className="text-sm text-gray-600 mt-1">Các vị trí tuyển dụng được đăng gần đây</p>
            </div>
            <Link
              to="/admin/jobs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              Xem tất cả
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {jobs.slice(0, 5).map((job, index) => (
              <div
                key={job._id}
                className="group border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold mr-4">
                        {job.companyId.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job.name}
                        </h4>
                        <p className="text-sm text-gray-600">{job.companyId.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        {job.salary.toLocaleString()} VND
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                          />
                        </svg>
                        {formatDate(job.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        job.isActive
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${job.isActive ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      {job.isActive ? "Đang tuyển" : "Đã đóng"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

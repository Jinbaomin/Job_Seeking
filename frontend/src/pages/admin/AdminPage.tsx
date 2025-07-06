"use client"

import type React from "react"
import { useEffect, useState } from "react"
// import UserPage from "./UserPage"
// import JobPage from "./JobPage"
// import CompanyPage from "./CompanyPage"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

// Mock data - replace with your Redux selectors
const mockStats = {
  totalUsers: 1234,
  totalJobs: 567,
  totalCompanies: 89,
  activeJobs: 234,
}

const mockUser = {
  name: "Admin User",
  email: "admin@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
}

const AdminPage: React.FC = () => {
  // const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split("/")[2] || 'dashboard';


  // Mock dispatch calls - replace with your actual Redux dispatch
  useEffect(() => {
    // dispatch(fetchUsers({ page: 1, limit: 5 }));
    // dispatch(fetchJobs({ page: 1, limit: 5 }));
    // dispatch(fetchCompanies({ page: 1, limit: 5 }));
  }, [])

  const navigationItems = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "users", name: "Người dùng", icon: "👥" },
    { id: "jobs", name: "Việc làm", icon: "💼" },
    { id: "companies", name: "Công ty", icon: "🏢" },
    { id: "resumes", name: "Hồ sơ ứng tuyển", icon: "🎲" },
  ]

  const StatCard = ({
    title,
    value,
    description,
    icon,
    trend,
    trendColor = "text-green-600",
  }: {
    title: string
    value: string | number
    description: string
    icon: string
    trend?: string
    trendColor?: string
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            {trend && (
              <span className={`text-sm font-medium ${trendColor} flex items-center`}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                {trend}
              </span>
            )}
            <span className="text-sm text-gray-500 ml-2">{description}</span>
          </div>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )

  const DashboardContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Tổng quan về hệ thống quản lý việc làm</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={mockStats.totalUsers}
          description="Tăng so với tháng trước"
          icon="👥"
          trend="+12%"
        />
        <StatCard
          title="Tổng việc làm"
          value={mockStats.totalJobs}
          description="Việc làm đã đăng"
          icon="💼"
          trend="+8%"
        />
        <StatCard
          title="Công ty"
          value={mockStats.totalCompanies}
          description="Công ty đã đăng ký"
          icon="🏢"
          trend="+5%"
        />
        <StatCard
          title="Việc làm đang tuyển"
          value={mockStats.activeJobs}
          description="Đang hoạt động"
          icon="✅"
          trend="+15%"
        />
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
            <p className="text-sm text-gray-600">Các hoạt động mới nhất trong hệ thống</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: "Người dùng mới đăng ký", user: "Nguyễn Văn A", time: "2 phút trước", avatar: "🧑" },
                { action: "Công ty đăng việc làm mới", user: "Công ty ABC", time: "5 phút trước", avatar: "🏢" },
                { action: "Ứng viên nộp đơn", user: "Trần Thị B", time: "10 phút trước", avatar: "👩" },
                { action: "Công ty cập nhật thông tin", user: "Công ty XYZ", time: "15 phút trước", avatar: "🏭" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                    {activity.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Thống kê nhanh</h3>
            <p className="text-sm text-gray-600">Các chỉ số quan trọng</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { label: "Tỷ lệ ứng tuyển thành công", value: "68%", color: "bg-green-100 text-green-800" },
                { label: "Công ty hoạt động", value: "85%", color: "bg-blue-100 text-blue-800" },
                { label: "Việc làm mới hôm nay", value: "23", color: "bg-purple-100 text-purple-800" },
                { label: "Người dùng online", value: "156", color: "bg-orange-100 text-orange-800" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // const renderTabContent = () => {
  //   switch (activeTab) {
  //     case "dashboard":
  //       return <DashboardContent />
  //     case "users":
  //       return <UserPage />
  //       // return (
  //       //   <div className="space-y-6">
  //       //     <h2 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h2>
  //       //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
  //       //       <div className="text-center">
  //       //         <div className="text-6xl mb-4">👥</div>
  //       //         <p className="text-gray-600">Nội dung quản lý người dùng sẽ được hiển thị ở đây</p>
  //       //       </div>
  //       //     </div>
  //       //   </div>
  //       // )
  //     case "jobs":
  //       return <JobPage />
  //       // return (
  //       //   <div className="space-y-6">
  //       //     <h2 className="text-3xl font-bold text-gray-900">Quản lý việc làm</h2>
  //       //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
  //       //       <div className="text-center">
  //       //         <div className="text-6xl mb-4">💼</div>
  //       //         <p className="text-gray-600">Nội dung quản lý việc làm sẽ được hiển thị ở đây</p>
  //       //       </div>
  //       //     </div>
  //       //   </div>
  //       // )
  //     case "companies":
  //       // return (
  //       //   <div className="space-y-6">
  //       //     <h2 className="text-3xl font-bold text-gray-900">Quản lý công ty</h2>
  //       //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
  //       //       <div className="text-center">
  //       //         <div className="text-6xl mb-4">🏢</div>
  //       //         <p className="text-gray-600">Nội dung quản lý công ty sẽ được hiển thị ở đây</p>
  //       //       </div>
  //       //     </div>
  //       //   </div>
  //       // )
  //       return <CompanyPage />
  //     default:
  //       return <DashboardContent />
  //   }
  // }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/admin/${item.id}`);
                  // setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-700 border-x-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile in Sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {mockUser.name.charAt(0)}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                <p className="text-xs text-gray-500">{mockUser.email}</p>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Cài đặt
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zM15 7h5l-5-5v5zM9 17H4l5 5v-5z"
                  />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Chào mừng trở lại!</p>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        {/* <main className="flex-1 overflow-y-auto p-6">{renderTabContent()}</main> */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export default AdminPage

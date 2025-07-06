"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { fetchResumes, updateResumeStatus } from "../../redux/slice/resumeSlice"
import useDebounce from "../../hooks/useDebounce"
import Modal from "../../components/common/Modal"

const ResumePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { resumes, loading, total, currentPage, limit, totalPages } = useAppSelector(state => state.resume);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");

  // Bulk selection
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);

  const debounceValue = useDebounce(searchTerm, 1000);

  // Fetch resumes on mount and when filters/page change
  useEffect(() => {
    dispatch(fetchResumes({
      page: currentPage,
      limit: limit,
      status: statusFilter || '',
      companyId: companyFilter || '',
      query: debounceValue || '',
    }));
  }, [dispatch, currentPage, limit, statusFilter, companyFilter, debounceValue]);

  // Get unique companies for filter
  const companies = useMemo(() => {
    const map = new Map();
    resumes.forEach((resume: any) => {
      if (resume.companyId && !map.has(resume.companyId._id)) {
        map.set(resume.companyId._id, resume.companyId.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ _id: id, name }));
  }, [resumes]);

  // Pagination
  const paginatedResumes = resumes;
  const startIndex = (currentPage - 1) * limit;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REVIEWING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "REVIEWING":
        return "Đang xem xét";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Từ chối";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "REVIEWING":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        );
      case "APPROVED":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "REJECTED":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedResumes(paginatedResumes.map((resume: any) => resume._id));
    } else {
      setSelectedResumes([]);
    }
  };

  const handleSelectResume = (resumeId: string, checked: boolean) => {
    if (checked) {
      setSelectedResumes([...selectedResumes, resumeId]);
    } else {
      setSelectedResumes(selectedResumes.filter((id) => id !== resumeId));
    }
  };

  const handleUpdateStatus = (resume: any, status: string) => {
    setSelectedResume(resume);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedResume && newStatus) {
      dispatch(updateResumeStatus({ id: selectedResume._id, status: newStatus }));
      setShowStatusModal(false);
      setSelectedResume(null);
      setNewStatus("");
    }
  };

  const handleBulkStatusUpdate = (status: string) => {
    selectedResumes.forEach(id => {
      dispatch(updateResumeStatus({ id, status }));
    });
    setSelectedResumes([]);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setCompanyFilter("");
    setSearchTerm("");
    // Optionally reset page
    // dispatch(setCurrentPage(1));
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    status,
  }: {
    title: string
    value: number
    icon: React.ReactNode
    color: string
    status: string
  }) => (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setStatusFilter(status)}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div> */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );

  // if (loading) {
  //   return <LoadingSkeleton />;
  // }

  // Count by status for StatCard
  const countByStatus = (status: string) => resumes.filter((r: any) => r.status === status).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn ứng tuyển</h1>
        <p className="text-gray-600 mt-2">Xem và quản lý tất cả đơn ứng tuyển từ ứng viên</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Chờ xử lý"
          value={countByStatus("PENDING")}
          status="PENDING"
          color="bg-yellow-100"
          icon={
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Đang xem xét"
          value={countByStatus("REVIEWING")}
          status="REVIEWING"
          color="bg-blue-100"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          }
        />
        <StatCard
          title="Đã duyệt"
          value={countByStatus("APPROVED")}
          status="APPROVED"
          color="bg-green-100"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <StatCard
          title="Từ chối"
          value={countByStatus("REJECTED")}
          status="REJECTED"
          color="bg-red-100"
          icon={
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h3>
          <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Xóa bộ lọc
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                placeholder="Tìm theo tên ứng viên, email, vị trí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="REVIEWING">Đang xem xét</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Công ty</label>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả công ty</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? <LoadingSkeleton /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Danh sách đơn ứng tuyển ({total})
                </h3>
                <p className="text-sm text-gray-600">Quản lý các đơn ứng tuyển từ ứng viên</p>
              </div>

              {selectedResumes.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Đã chọn {selectedResumes.length}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBulkStatusUpdate("REVIEWING")}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Xem xét
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate("APPROVED")}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate("REJECTED")}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {resumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium">Không tìm thấy đơn ứng tuyển nào</p>
              <p className="text-sm">
                {statusFilter || companyFilter || searchTerm
                  ? "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Chưa có đơn ứng tuyển nào được gửi đến hệ thống"}
              </p>
            </div>
          ) : (
            <>
              {/* Bulk Selection Header */}
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedResumes.length === paginatedResumes.length && paginatedResumes.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Chọn tất cả</span>
                </label>
              </div>

              {/* Resume Cards */}
              <div className="p-6">
                <div className="space-y-4">
                  {paginatedResumes.map((resume: any) => (
                    <div
                      key={resume._id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedResumes.includes(resume._id)}
                          onChange={(e) => handleSelectResume(resume._id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        />

                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          {resume.userId && resume.userId.avatar ? (
                            <img
                              src={resume.userId.avatar || "/placeholder.svg"}
                              alt={resume.userId.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {resume.userId && resume.userId.name ? resume.userId.name.charAt(0) : "?"}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="text-lg font-semibold text-gray-900">{resume.userId && resume.userId.name}</h4>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(resume.status)}`}
                                >
                                  {getStatusIcon(resume.status)}
                                  <span className="ml-1">{getStatusText(resume.status)}</span>
                                </span>
                              </div>
                              <p className="text-gray-600 mt-1">{resume.userId && resume.userId.email}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                                    />
                                  </svg>
                                  {resume.jobId && resume.jobId.name}
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                  {resume.companyId && resume.companyId.name}
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
                                  {formatDate(resume.createdAt)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm text-gray-600 line-clamp-2">{resume.coverLetter}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {resume.skills && resume.skills.slice(0, 4).map((skill: string, index: number) => (
                                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => {
                                  setSelectedResume(resume);
                                  setShowDetailModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                              >
                                Xem chi tiết
                              </button>
                              <a
                                href={`http://localhost:3000/${resume.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                              >
                                Tải CV
                              </a>
                            </div>

                            <div className="flex items-center space-x-2">
                              {resume.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(resume, "REVIEWING")}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                  >
                                    Xem xét
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(resume, "APPROVED")}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                                  >
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(resume, "REJECTED")}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                  >
                                    Từ chối
                                  </button>
                                </>
                              )}
                              {resume.status === "REVIEWING" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(resume, "APPROVED")}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                                  >
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(resume, "REJECTED")}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                  >
                                    Từ chối
                                  </button>
                                </>
                              )}
                              {(resume.status === "APPROVED" || resume.status === "REJECTED") && (
                                <button
                                  onClick={() => handleUpdateStatus(resume, "PENDING")}
                                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                                >
                                  Đặt lại
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Hiển thị {startIndex + 1} đến {Math.min(startIndex + limit, total)} trong tổng số {total} đơn ứng tuyển
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => dispatch(fetchResumes({ page: Math.max(1, currentPage - 1), limit, status: statusFilter || undefined, companyId: companyFilter || undefined, query: searchTerm || undefined }))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => dispatch(fetchResumes({ page, limit, status: statusFilter || '', companyId: companyFilter || '', query: searchTerm || '' }))}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => dispatch(fetchResumes({ page: Math.min(totalPages, currentPage + 1), limit, status: statusFilter || '', companyId: companyFilter || '', query: searchTerm || '' }))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Resume Detail Modal */}
      <Modal isOpen={showDetailModal && selectedResume} onClose={() => setShowDetailModal(false)} maxWidth="max-w-2xl">
        {/* <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"> */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {selectedResume?.userId?.avatar ? (
                  <img
                    src={selectedResume?.userId?.avatar || "/placeholder.svg"}
                    alt={selectedResume?.userId?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {selectedResume?.userId?.name ? selectedResume?.userId?.name?.charAt(0) : "?"}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedResume?.userId?.name}</h3>
                <p className="text-gray-600">{selectedResume?.userId?.email}</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(selectedResume?.status)}`}
                >
                  {getStatusIcon(selectedResume?.status)}
                  <span className="ml-1">{getStatusText(selectedResume?.status)}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Thông tin ứng tuyển</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                    <span className="font-medium">Vị trí:</span>
                    <span className="ml-2">{selectedResume?.jobId?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="font-medium">Công ty:</span>
                    <span className="ml-2">{selectedResume?.companyId?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                      />
                    </svg>
                    <span className="font-medium">Ngày ứng tuyển:</span>
                    <span className="ml-2">{formatDate(selectedResume?.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="font-medium">Cập nhật cuối:</span>
                    <span className="ml-2">{formatDate(selectedResume?.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Kỹ năng</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResume?.jobId?.skills?.map((skill: string, index: number) => (
                    <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              {/* </div> */}
            </div>

            {/* <div>
              <h4 className="font-semibold text-gray-900 mb-3">Kinh nghiệm</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedResume?.experience}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Thư xin việc</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedResume?.coverLetter}</p>
            </div> */}

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">CV</h4>
              <a
                href={selectedResume?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Tải xuống CV
              </a>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => setShowDetailModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>
      {/* {showDetailModal && selectedResume && (
        <div className="fixed inset-0 bg-gray-400 opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {selectedResume.userId && selectedResume.userId.avatar ? (
                    <img
                      src={selectedResume.userId.avatar || "/placeholder.svg"}
                      alt={selectedResume.userId.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {selectedResume.userId && selectedResume.userId.name ? selectedResume.userId.name.charAt(0) : "?"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedResume.userId && selectedResume.userId.name}</h3>
                  <p className="text-gray-600">{selectedResume.userId && selectedResume.userId.email}</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(selectedResume.status)}`}
                  >
                    {getStatusIcon(selectedResume.status)}
                    <span className="ml-1">{getStatusText(selectedResume.status)}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Thông tin ứng tuyển</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                        />
                      </svg>
                      <span className="font-medium">Vị trí:</span>
                      <span className="ml-2">{selectedResume.jobId && selectedResume.jobId.name}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className="font-medium">Công ty:</span>
                      <span className="ml-2">{selectedResume.companyId && selectedResume.companyId.name}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                        />
                      </svg>
                      <span className="font-medium">Ngày ứng tuyển:</span>
                      <span className="ml-2">{formatDate(selectedResume.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span className="font-medium">Cập nhật cuối:</span>
                      <span className="ml-2">{formatDate(selectedResume.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Kỹ năng</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResume.skills && selectedResume.skills.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Kinh nghiệm</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedResume.experience}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Thư xin việc</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedResume.coverLetter}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">CV</h4>
                <a
                  href={selectedResume.cv || selectedResume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Tải xuống CV
                </a>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Status Update Confirmation Modal */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)}>
        {/* <div className="bg-white rounded-xl shadow-xl max-w-lg w-full"> */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận cập nhật trạng thái</h3>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn cập nhật trạng thái đơn ứng tuyển thành "{getStatusText(newStatus)}"?
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={confirmStatusUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xác nhận
            </button>
          </div>
        {/* </div> */}
      </Modal>
      {/* {showStatusModal && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        //   <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        //     <div className="p-6">
        //       <div className="flex items-center mb-4">
        //         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        //           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //             <path
        //               strokeLinecap="round"
        //               strokeLinejoin="round"
        //               strokeWidth={2}
        //               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        //             />
        //           </svg>
        //         </div>
        //         <div className="ml-4">
        //           <h3 className="text-lg font-semibold text-gray-900">Xác nhận cập nhật trạng thái</h3>
        //           <p className="text-sm text-gray-600">
        //             Bạn có chắc chắn muốn cập nhật trạng thái đơn ứng tuyển thành "{getStatusText(newStatus)}"?
        //           </p>
        //         </div>
        //       </div>
        //     </div>
        //     <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
        //       <button
        //         onClick={() => setShowStatusModal(false)}
        //         className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        //       >
        //         Hủy
        //       </button>
        //       <button
        //         onClick={confirmStatusUpdate}
        //         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        //       >
        //         Xác nhận
        //       </button>
        //     </div>
        //   </div>
        // </div>
      )} */}
    </div>
  );
};

export default ResumePage;

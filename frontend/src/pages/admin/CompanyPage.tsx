"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { fetchCompanies, deleteCompany } from "../../redux/slice/companySlice"
import useDebounce from "../../hooks/useDebounce"
import Modal from "../../components/common/Modal"

const CompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { companies, loading, total, currentPage, limit, totalPages } = useAppSelector(state => state.company);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companyToDelete, setCompanyToDelete] = useState<any>(null);

  // Bulk selection
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const debounceValue = useDebounce(searchTerm, 1000);

  // Fetch companies on mount and when filters/page change
  useEffect(() => {
    dispatch(fetchCompanies({
      page: currentPage,
      limit: limit,
      search: debounceValue || '',
    }));
  }, [dispatch, currentPage, limit, debounceValue]);

  // Pagination
  const paginatedCompanies = companies;
  const startIndex = (currentPage - 1) * limit;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCompanies(paginatedCompanies.map((company: any) => company._id));
    } else {
      setSelectedCompanies([]);
    }
  };

  const handleSelectCompany = (companyId: string, checked: boolean) => {
    if (checked) {
      setSelectedCompanies([...selectedCompanies, companyId]);
    } else {
      setSelectedCompanies(selectedCompanies.filter((id) => id !== companyId));
    }
  };

  const handleDeleteCompany = (company: any) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await dispatch(deleteCompany(companyToDelete._id)).unwrap();
        setCompanyToDelete(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedCompanies) {
        await dispatch(deleteCompany(id)).unwrap();
      }
      setSelectedCompanies([]);
    } catch (error) {
      console.error('Error bulk deleting companies:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
  }: {
    title: string
    value: number
    icon: React.ReactNode
    color: string
    subtitle?: string
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Count by status for StatCard
  const countByStatus = (isDeleted: boolean) => companies.filter((c: any) => c.isDeleted === isDeleted).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý công ty</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin các công ty trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Tổng công ty"
          value={total}
          color="bg-blue-100"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />
        <StatCard
          title="Đang hoạt động"
          value={countByStatus(false)}
          color="bg-green-100"
          subtitle="Công ty hoạt động"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Đã xóa"
          value={countByStatus(true)}
          color="bg-red-100"
          subtitle="Công ty đã xóa"
          icon={
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          }
        />
        <StatCard
          title="Trang hiện tại"
          value={currentPage}
          color="bg-purple-100"
          subtitle={`Tổng ${totalPages} trang`}
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
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
                placeholder="Tìm theo tên công ty hoặc địa chỉ..."
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Đã xóa</option>
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
                <h3 className="text-lg font-semibold text-gray-900">Danh sách công ty ({total})</h3>
                <p className="text-sm text-gray-600">Quản lý thông tin các công ty</p>
              </div>

              <div className="flex items-center space-x-3">
                {selectedCompanies.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Đã chọn {selectedCompanies.length}</span>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm công ty
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="text-lg font-medium">Không tìm thấy công ty nào</p>
              <p className="text-sm">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <>
              {/* Bulk Selection Header */}
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCompanies.length === paginatedCompanies.length && paginatedCompanies.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Chọn tất cả</span>
                </label>
              </div>

              {/* Company Cards */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedCompanies.map((company: any) => (
                    <div
                      key={company._id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.includes(company._id)}
                          onChange={(e) => handleSelectCompany(company._id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        />

                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {company.logo ? (
                            <img
                              src={company.logo || "/placeholder.svg"}
                              alt={company.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {company.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-lg font-semibold text-gray-900 truncate">{company.name}</h4>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{company.address}</p>
                              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{company.description}</p>
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                  company.isDeleted
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : "bg-green-100 text-green-800 border-green-200"
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full mr-1 ${
                                    company.isDeleted ? "bg-red-500" : "bg-green-500"
                                  }`}
                                ></div>
                                {company.isDeleted ? "Đã xóa" : "Hoạt động"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                                  />
                                </svg>
                                {formatDate(company.createdAt)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setSelectedCompany(company);
                                setShowDetailModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                            >
                              Xem chi tiết
                            </button>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setShowEditModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteCompany(company)}
                                className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                              >
                                Xóa
                              </button>
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
                      Hiển thị {startIndex + 1} đến {Math.min(startIndex + limit, total)} trong tổng số {total} công ty
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => dispatch(fetchCompanies({ page: Math.max(1, currentPage - 1), limit, search: searchTerm || '' }))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => dispatch(fetchCompanies({ page, limit, search: searchTerm || '' }))}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => dispatch(fetchCompanies({ page: Math.min(totalPages, currentPage + 1), limit, search: searchTerm || '' }))}
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

      {/* Company Detail Modal */}
      <Modal isOpen={showDetailModal && selectedCompany} onClose={() => setShowDetailModal(false)} maxWidth="max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {selectedCompany?.logo ? (
                <img
                  src={selectedCompany.logo || "/placeholder.svg"}
                  alt={selectedCompany.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {selectedCompany?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedCompany?.name}</h3>
              <p className="text-gray-600">{selectedCompany?.address}</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Thông tin công ty</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {selectedCompany?.address}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Thông tin hệ thống</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạng thái:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      selectedCompany?.isDeleted
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-1 ${
                        selectedCompany?.isDeleted ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></div>
                    {selectedCompany?.isDeleted ? "Đã xóa" : "Hoạt động"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ngày tạo:</span>
                  <span className="text-sm">{formatDate(selectedCompany?.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cập nhật cuối:</span>
                  <span className="text-sm">{formatDate(selectedCompany?.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Mô tả công ty</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{selectedCompany?.description}</p>
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
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa công ty "{companyToDelete?.name}" không?
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Xóa
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyPage;

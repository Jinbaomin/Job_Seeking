import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import ResumeCard from '../../components/resume/ResumeCard';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchResumes, deleteResume, updateResumeStatus, setCurrentPage, clearError } from '../../redux/slice/resumeSlice';
import useDebounce from '../../hooks/useDebounce';

const ResumePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { resumes, loading, deleting, updating, total, currentPage, totalPages, error } = useAppSelector(state => state.resume);
  
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: 10,
    };

    if (statusFilter) {
      params.status = statusFilter;
    }

    if (companyFilter) {
      params.companyId = companyFilter;
    }

    if (searchTerm) {
      params.query = debouncedSearchTerm;
    }

    dispatch(fetchResumes(params));
  }, [dispatch, currentPage, statusFilter, companyFilter, debouncedSearchTerm, updating]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn ứng tuyển này?')) {
      try {
        await dispatch(deleteResume(id)).unwrap();
        alert('Xóa đơn ứng tuyển thành công!');
      } catch (error: any) {
        alert(error.message || 'Có lỗi xảy ra khi xóa đơn ứng tuyển');
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await dispatch(updateResumeStatus({ id, status })).unwrap();
      alert('Cập nhật trạng thái thành công!');
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleFilterChange = (filter: string, type: 'status' | 'company') => {
    if (type === 'status') {
      setStatusFilter(filter);
    } else {
      setCompanyFilter(filter);
    }
    dispatch(setCurrentPage(1)); // Reset to first page when filtering
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setCurrentPage(1)); // Reset to first page when searching
  };

  const clearFilters = () => {
    setStatusFilter('');
    setCompanyFilter('');
    setSearchTerm('');
    dispatch(setCurrentPage(1));
  };

  // Get unique companies for filter
  const companies = Array.from(new Set(resumes.map(resume => resume.companyId._id)))
    .map(companyId => {
      const resume = resumes.find(r => r.companyId._id === companyId);
      return {
        _id: companyId,
        name: resume?.companyId.name || ''
      };
    });

  return (
    // <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn ứng tuyển</h1>
          <p className="text-gray-600">Xem và quản lý tất cả đơn ứng tuyển từ ứng viên</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(e.target.value, 'status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Công ty
              </label>
              <select
                value={companyFilter}
                onChange={(e) => handleFilterChange(e.target.value, 'company')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả công ty</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSearch}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên công việc, email ứng viên..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="submit" className="px-4 py-2">
                    Tìm kiếm
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-blue-600">
              {resumes.filter(r => r.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-600">Chờ xử lý</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {resumes.filter(r => r.status === 'REVIEWING').length}
            </div>
            <div className="text-sm text-gray-600">Đang xem xét</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-green-600">
              {resumes.filter(r => r.status === 'APPROVED').length}
            </div>
            <div className="text-sm text-gray-600">Đã duyệt</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-red-600">
              {resumes.filter(r => r.status === 'REJECTED').length}
            </div>
            <div className="text-sm text-gray-600">Từ chối</div>
          </div>
        </div>

        {/* Resume List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border rounded-lg p-6 bg-white animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn ứng tuyển nào</h3>
            <p className="text-gray-600">
              {statusFilter || companyFilter || searchTerm 
                ? 'Không tìm thấy đơn ứng tuyển nào phù hợp với bộ lọc hiện tại.'
                : 'Chưa có đơn ứng tuyển nào được gửi đến hệ thống.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onDelete={handleDelete}
                onUpdateStatus={handleUpdateStatus}
                showActions={true} // Admin can manage all applications
                deleting={deleting}
                updating={updating}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
              >
                Trước
              </Button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
              >
                Sau
              </Button>
            </div>
          </div>
        )}

        {/* Summary */}
        {resumes.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Hiển thị {resumes.length} trong tổng số {total} đơn ứng tuyển
          </div>
        )}
      </div>
    // </AdminLayout>
  );
};

export default ResumePage; 
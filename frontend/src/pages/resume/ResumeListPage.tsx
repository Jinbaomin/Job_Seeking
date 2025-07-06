import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import ResumeCard from '../../components/resume/ResumeCard';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import useDebounce from '../../hooks/useDebounce';
import { fetchResumes, deleteResume, updateResumeStatus, setCurrentPage, clearError, fetchMyResumes } from '../../redux/slice/resumeSlice';

const ResumeListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { resumes, loading, deleting, updating, total, currentPage, totalPages, error } = useAppSelector(state => state.resume);
  const { user } = useAppSelector(state => state.account);
  
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 700); // 1000ms delay

  useEffect(() => {
    if (user) {
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      if (searchTerm) {
        // Use debounced search term instead of searchTerm
        params.query = debouncedSearchTerm;
      }

      dispatch(fetchMyResumes(params));
    }
  }, [dispatch, user, currentPage, statusFilter, debouncedSearchTerm]); // Use debouncedSearchTerm

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

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    dispatch(setCurrentPage(1)); // Reset to first page when filtering
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // No need to manually trigger search since debounce handles it
    dispatch(setCurrentPage(1)); // Reset to first page when searching
  };

  const clearFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
    dispatch(setCurrentPage(1));
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h2>
            <p className="text-gray-600">Bạn cần đăng nhập để xem đơn ứng tuyển của mình.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn ứng tuyển của tôi</h1>
          <p className="text-gray-600">Quản lý và theo dõi các đơn ứng tuyển của bạn</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="REVIEWING">Đang xem xét</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <form onSubmit={handleSearch}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên công việc, công ty..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="submit" className="px-4 py-2">
                    Tìm kiếm
                  </Button>
                </div>
              </form>
              {/* Show debounce indicator */}
              {searchTerm !== debouncedSearchTerm && (
                <div className="mt-1 text-xs text-gray-500">
                  Đang tìm kiếm...
                </div>
              )}
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

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
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn ứng tuyển nào</h3>
            <p className="text-gray-600 mb-4">
              Bạn chưa ứng tuyển việc làm nào. Hãy tìm việc làm phù hợp và ứng tuyển ngay!
            </p>
            <Button
              onClick={() => window.location.href = '/job'}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Tìm việc làm
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onDelete={handleDelete}
                onUpdateStatus={handleUpdateStatus}
                showActions={false} // Users can only view their own applications
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
    </MainLayout>
  );
};

export default ResumeListPage; 
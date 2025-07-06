import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchCompanyById, clearCurrentCompany } from '../../redux/slice/companySlice';

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentCompany, loading, error } = useAppSelector(state => state.company);

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyById(id));
    }
    return () => {
      dispatch(clearCurrentCompany());
    };
  }, [dispatch, id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !currentCompany) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <p className="text-red-500">{error || 'Không tìm thấy thông tin công ty'}</p>
          <Link to="/company" className="text-blue-600 hover:underline mt-4 inline-block">
            Quay lại danh sách công ty
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/company" className="text-blue-600 hover:underline">
            ← Quay lại danh sách công ty
          </Link>
        </nav>

        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start gap-6">
            {currentCompany.logo && (
              <img 
                src={currentCompany.logo} 
                alt={currentCompany.name} 
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0" 
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentCompany.name}</h1>
              <div className="text-lg text-gray-600 mb-4">
                📍 {currentCompany.address}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {currentCompany.description}
              </p>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <div>
                <span className="text-gray-500 font-medium">Tên công ty:</span>
                <div className="text-lg font-semibold">{currentCompany.name}</div>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Địa chỉ:</span>
                <div className="text-lg">{currentCompany.address}</div>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Mô tả:</span>
                <div className="text-gray-700 mt-1">{currentCompany.description}</div>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Trạng thái:</span>
                <div className={`font-medium ${currentCompany.isDeleted ? 'text-red-600' : 'text-green-600'}`}>
                  {currentCompany.isDeleted ? 'Đã xóa' : 'Hoạt động'}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Lịch sử</h2>
            <div className="space-y-4">
              <div>
                <span className="text-gray-500 font-medium">Ngày tạo:</span>
                <div className="text-lg">{formatDate(currentCompany.createdAt)}</div>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Cập nhật lần cuối:</span>
                <div className="text-lg">{formatDate(currentCompany.updatedAt)}</div>
              </div>
              {currentCompany.deletedAt && (
                <div>
                  <span className="text-gray-500 font-medium">Ngày xóa:</span>
                  <div className="text-lg text-red-600">{formatDate(currentCompany.deletedAt)}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Information */}
        {(currentCompany.createdBy || currentCompany.updatedBy || currentCompany.deletedBy) && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Thông tin người quản lý</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentCompany.createdBy && (
                <div>
                  <span className="text-gray-500 font-medium">Người tạo:</span>
                  <div className="text-sm">{currentCompany.createdBy.email}</div>
                </div>
              )}
              {currentCompany.updatedBy && (
                <div>
                  <span className="text-gray-500 font-medium">Người cập nhật:</span>
                  <div className="text-sm">{currentCompany.updatedBy.email}</div>
                </div>
              )}
              {currentCompany.deletedBy && (
                <div>
                  <span className="text-gray-500 font-medium">Người xóa:</span>
                  <div className="text-sm text-red-600">{currentCompany.deletedBy.email}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Việc làm tại công ty này</h2>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Tính năng này sẽ được phát triển trong tương lai</p>
            <Link to="/job" className="text-blue-600 hover:underline">
              Xem tất cả việc làm →
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CompanyDetailPage; 
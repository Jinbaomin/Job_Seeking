import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchCompanies, deleteCompany } from '../../redux/slice/companySlice';
import Button from '../../components/common/Button';
import CompanyModal from '../../components/admin/CompanyModal';
import Modal from '../../components/common/Modal';

const CompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { companies, total, currentPage, limit, totalPages, loading } = useAppSelector(state => state.company);
  const [currentPageState, setCurrentPageState] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companyToDelete, setCompanyToDelete] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchCompanies({ page: currentPageState, limit: 10 }));
  }, [dispatch, currentPageState]);

  const handlePageChange = (page: number) => {
    setCurrentPageState(page);
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company: any) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = (company: any) => {
    setCompanyToDelete(company);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await dispatch(deleteCompany(companyToDelete._id)).unwrap();
        setIsDeleteModalOpen(false);
        setCompanyToDelete(null);
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Quản lý công ty</h3>
        <Button 
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleAddCompany}
        >
          Thêm công ty
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div key={company._id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {company.logo && (
                    <img src={company.logo} alt={company.name} className="w-12 h-12 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{company.name}</h4>
                    <p className="text-sm text-gray-600">{company.address}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{company.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        company.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {company.isDeleted ? 'Đã xóa' : 'Hoạt động'}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 text-sm"
                          onClick={() => handleEditCompany(company)}
                        >
                          Sửa
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 text-sm"
                          onClick={() => handleDeleteCompany(company)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Hiển thị {((currentPage - 1) * limit) + 1} đến {Math.min(currentPage * limit, total)} trong tổng số {total} công ty
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Company Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        company={selectedCompany}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCompanyToDelete(null);
        }}
        title="Xác nhận xóa"
      >
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Bạn có chắc chắn muốn xóa công ty "{companyToDelete?.name}" không? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCompanyToDelete(null);
              }}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Hủy
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyPage; 
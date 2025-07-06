import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import CompanyCard from '../../components/company/CompanyCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchCompanies, setCurrentPage } from '../../redux/slice/companySlice';

const CompanyListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { companies, loading, error, total, currentPage, limit, totalPages } = useAppSelector(state => state.company);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCompanies({ page: currentPage, limit, search: searchTerm }));
  }, [dispatch, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setCurrentPage(1));
    dispatch(fetchCompanies({ page: 1, limit, search: searchTerm }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Khám phá công ty</h1>
        
        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Tìm kiếm công ty"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tên công ty, địa chỉ..."
              />
            </div>
            <Button type="submit" className="h-10 mt-6">
              Tìm kiếm
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Tìm thấy {total} công ty
          </p>
        </div>

        {/* Company List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Không tìm thấy công ty nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2"
              >
                Trước
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CompanyListPage; 
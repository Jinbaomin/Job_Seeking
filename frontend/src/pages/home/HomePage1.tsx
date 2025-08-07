import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import JobCard from '../../components/job/JobCard';
import CompanyCard from '../../components/company/CompanyCard';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchJobs } from '../../redux/slice/jobSlice';
import { fetchCompanies } from '../../redux/slice/companySlice';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, loading: jobsLoading } = useAppSelector(state => state.job);
  const { companies, loading: companiesLoading } = useAppSelector(state => state.company);

  useEffect(() => {
    // Fetch latest jobs and companies
    dispatch(fetchJobs({ page: 1, limit: 6 })).unwrap();
    dispatch(fetchCompanies({ page: 1, limit: 6 })).unwrap();
  }, [dispatch]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tìm việc làm mơ ước
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu. 
            Tạo hồ sơ và ứng tuyển ngay hôm nay!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/job">
              <Button className="bg-blue hover:text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Tìm việc làm
              </Button>
            </Link>
            <Link to="/company">
              <Button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                Khám phá công ty
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Latest Jobs Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Việc làm mới nhất</h2>
            <Link to="/job" className="text-blue-600 hover:underline font-medium">
              Xem tất cả →
            </Link>
          </div>
          
          {jobsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải việc làm...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Chưa có việc làm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 6).map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Companies Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Công ty nổi bật</h2>
            <Link to="/company" className="text-blue-600 hover:underline font-medium">
              Xem tất cả →
            </Link>
          </div>
          
          {companiesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải công ty...</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Chưa có công ty nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.slice(0, 6).map((company) => (
                <CompanyCard key={company._id} company={company} />
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tìm kiếm thông minh</h3>
              <p className="text-gray-600">
                Công nghệ AI giúp bạn tìm việc làm phù hợp nhất với kỹ năng và kinh nghiệm
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ứng tuyển dễ dàng</h3>
              <p className="text-gray-600">
                Quy trình ứng tuyển đơn giản, nhanh chóng với chỉ vài cú click
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cộng đồng lớn</h3>
              <p className="text-gray-600">
                Kết nối với hàng nghìn ứng viên và công ty uy tín
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sẵn sàng bắt đầu sự nghiệp mới?
          </h2>
          <p className="text-gray-600 mb-6">
            Tạo tài khoản ngay hôm nay để khám phá những cơ hội việc làm tốt nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3">
                Đăng ký ngay
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage; 
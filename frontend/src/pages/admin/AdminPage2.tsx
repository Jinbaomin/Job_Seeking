import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchUsers } from '../../redux/slice/userSlice';
import { fetchJobs } from '../../redux/slice/jobSlice';
import { fetchCompanies } from '../../redux/slice/companySlice';
import Button from '../../components/common/Button';

const AdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.account);
  // const { users, total: totalUsers } = useAppSelector(state => state.user);
  // const { jobs, total: totalJobs } = useAppSelector(state => state.job);
  // const { companies, total: totalCompanies } = useAppSelector(state => state.company);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Fetch data for dashboard
    dispatch(fetchUsers({ page: 1, limit: 5 }));
    dispatch(fetchJobs({ page: 1, limit: 5 }));
    dispatch(fetchCompanies({ page: 1, limit: 5 }));
  }, [dispatch]);

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('vi-VN');
  // };

  // const getRoleText = (role: string) => {
  //   switch (role) {
  //     case 'ADMIN':
  //       return 'Quản trị viên';
  //     case 'USER':
  //       return 'Người dùng';
  //     default:
  //       return role;
  //   }
  // };


  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản trị hệ thống</h1>
          <p className="text-gray-600 mt-2">Chào mừng {user?.name}, quản lý hệ thống tìm việc làm</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: '📊' },
              { id: 'users', name: 'Người dùng', icon: '👥' },
              { id: 'jobs', name: 'Việc làm', icon: '💼' },
              { id: 'companies', name: 'Công ty', icon: '🏢' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {/* {activeTab === 'dashboard' && <DashboardTab />} */}
        {/* {activeTab === 'users' && <UsersTab />} */}
        {/* {activeTab === 'jobs' && <JobsTab />} */}
        {/* {activeTab === 'companies' && <CompaniesTab />} */}
      </div>
    </MainLayout>
  );
};

export default AdminPage; 
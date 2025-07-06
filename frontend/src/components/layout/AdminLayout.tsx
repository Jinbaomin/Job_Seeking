import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import { useAppSelector } from '../../hooks/reduxHooks';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAppSelector(state => state.account);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/jobs')) return 'jobs';
    if (path.includes('/admin/companies')) return 'companies';
    if (path.includes('/admin/resumes')) return 'resumes';
    return 'dashboard';
  });

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'users', name: 'Người dùng', icon: '👥', path: '/admin/users' },
    { id: 'jobs', name: 'Việc làm', icon: '💼', path: '/admin/jobs' },
    { id: 'companies', name: 'Công ty', icon: '🏢', path: '/admin/companies' },
    { id: 'resumes', name: 'Đơn ứng tuyển', icon: '📄', path: '/admin/resumes' },
  ];

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
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {children || <Outlet />}
      </div>
    </MainLayout>
  );
};

export default AdminLayout; 
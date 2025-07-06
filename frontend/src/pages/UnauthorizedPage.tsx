import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-yellow-500 mb-4">401</h1>
        <p className="text-lg mb-4">Bạn không có quyền truy cập trang này.</p>
        <Link to="/" className="text-blue-600 hover:underline">Quay về trang chủ</Link>
      </div>
    </MainLayout>
  );
};

export default UnauthorizedPage; 
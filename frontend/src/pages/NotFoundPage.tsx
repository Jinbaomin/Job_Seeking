import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-lg mb-4">Không tìm thấy trang bạn yêu cầu.</p>
        <Link to="/" className="text-blue-600 hover:underline">Quay về trang chủ</Link>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage; 
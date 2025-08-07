import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        {/* <img src={ReactLogo} alt="Not Found" className="w-32 h-32 mb-4 animate-bounce" /> */}
        <h1 className="text-6xl font-extrabold text-red-500 mb-2">404</h1>
        <p className="text-xl text-gray-700 mb-2 font-medium">Oops! Trang bạn tìm kiếm không tồn tại.</p>
        <p className="text-base text-gray-500 mb-4">Có thể bạn đã nhập sai địa chỉ hoặc trang đã bị xóa.</p>
        <Button onClick={() => navigate('/')} variant="primary" className="mt-2">Quay về trang chủ</Button>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage; 
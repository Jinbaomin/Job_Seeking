import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../redux/slice/accountSlice';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(state => state.account);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="w-full bg-white shadow p-4 fixed z-50">
      <div className='max-w-[95%] mx-auto flex items-center justify-between'>
        <a href='/' className="text-xl font-bold text-blue-600 hover:cursor-pointer">Job Seeking</a>
        <nav>
          <ul className="flex gap-4 items-center">
            <li><a href="/" className="transition-colors px-4 py-2 rounded-lg hover:text-blue-500 font-medium hover:font-semibold">Trang chủ</a></li>
            <li><a href="/job" className="transition-colors px-4 py-2 rounded-lg hover:text-blue-500 font-medium hover:font-semibold">Việc làm</a></li>
            <li><a href="/company" className="transition-colors px-4 py-2 rounded-lg hover:text-blue-500 font-medium hover:font-semibold">Công ty</a></li>
            <li><a href="/forum" className="transition-colors px-4 py-2 rounded-lg hover:text-blue-500 font-medium hover:font-semibold">Thảo luận</a></li>
            <li><a href="/chat-ai" className="transition-colors px-4 py-2 rounded-lg hover:text-blue-500 font-medium hover:font-semibold">Chat AI</a></li>

            {isAuthenticated ? (
              <>
                <li className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Xin chào, {user?.name}</span>
                  <a href="/profile" className="hover:text-blue-500">Cá nhân</a>
                  {user?.role === 'ADMIN' && (
                    <a href="/admin" className="hover:text-blue-500">Admin</a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Đăng xuất
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><a href="/login" className="hover:text-blue-500">Đăng nhập</a></li>
                <li><a href="/register" className="hover:text-blue-500">Đăng ký</a></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchAccount } from '../../redux/slice/accountSlice';

interface ProtectedRouteProps {
  requiredRole?: string; // Nếu muốn bảo vệ theo role (ví dụ: 'ADMIN')
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: globalLoading } = useAppSelector(state => state.account);

  // Track previous user
  // const prevUserRef = useRef(user);
  // Local loading state
  // const [localLoading, setLocalLoading] = useState(false);

  // Memoize user
  // const memoizedUser = useMemo(() => user, [user]);

  // Detect user modification
  // useEffect(() => {
  //   if (!globalLoading && prevUserRef.current !== user) {
  //     setLocalLoading(true);
  //     // Simulate loading end after user is set (you can adjust this logic)
  //     setTimeout(() => setLocalLoading(false), 0); // or setLocalLoading(false) when your async action ends
  //     prevUserRef.current = user;
  //     // setLocalLoading(false);
  //   }
  // }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!isAuthenticated && !token) {
      navigate('/login', { replace: true });
    }

    if (isAuthenticated && requiredRole && user?.role !== requiredRole) {
      // console.log('unauthorized');
      navigate('/unauthorized', { replace: true });
    }
  }, [navigate, isAuthenticated, requiredRole]);

  // Show loading only when user is being modified
  if (globalLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Nếu hợp lệ, render các route con
  return <Outlet />;
};

export default ProtectedRoute; 
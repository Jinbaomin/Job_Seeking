import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import JobListPage from './pages/job/JobListPage';
import JobDetailPage from './pages/job/JobDetailPage';
import CompanyListPage from './pages/company/CompanyListPage';
import CompanyDetailPage from './pages/company/CompanyDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UserPage from './pages/admin/UserPage';
import JobPage from './pages/admin/JobPage';
import CompanyPage from './pages/admin/CompanyPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { fetchAccount, setAccount } from './redux/slice/accountSlice';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import ChatAI from './pages/AI/ChatAI';
import ResumeListPage from './pages/resume/ResumeListPage';
import ResumePage from './pages/admin/ResumePage';
import AdminPage from './pages/admin/AdminPage';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    // const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (!user) {
      dispatch(fetchAccount()).unwrap();
    } else {
      dispatch(setAccount(JSON.parse(user)));
    }
  }, [dispatch, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/job" element={<JobListPage />} />
      <Route path="/job/:id" element={<JobDetailPage />} />
      <Route path="/company" element={<CompanyListPage />} />
      <Route path="/company/:id" element={<CompanyDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/chat-ai" element={<ChatAI />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resume" element={<ResumeListPage />} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route element={<AdminPage />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UserPage />} />
            <Route path="jobs" element={<JobPage />} />
            <Route path="companies" element={<CompanyPage />} />
            <Route path="resumes" element={<ResumePage />} />
          </Route>
        </Route>
      </Route>
      {/* <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route path="/admin/resume" element={<ResumePage />} />
      </Route> */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

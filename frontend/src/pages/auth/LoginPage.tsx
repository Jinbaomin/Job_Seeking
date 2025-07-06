import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchAccount } from '../../redux/slice/accountSlice';
import { callLogin } from '../../config/api';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(state => state.account);
  const [form, setForm] = useState({ username: '', password: '' });
  const [errorMsg, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Navigate khi đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await callLogin(form.username, form.password);
      localStorage.setItem('access_token', res.data.data.access_token);
      
      // Dispatch fetchAccount - useEffect sẽ handle navigation
      dispatch(fetchAccount());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <Input
            label="Mật khẩu"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
          <div className="w-full mt-2 flex justify-center">
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center">
          Chưa có tài khoản? <a href="/register" className="text-blue-600 hover:underline">Đăng ký</a>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { callRegister } from '../../config/api';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    address: '',
  });
  const [errorMsg, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await callRegister(form.name, form.email, form.password, form.age, form.gender, form.address);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
        <form onSubmit={handleSubmit}>
          <Input label="Họ tên" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} required />
          <Input label="Tuổi" name="age" type="number" value={form.age} onChange={handleChange} required />
          <Input label="Giới tính" name="gender" value={form.gender} onChange={handleChange} required />
          <Input label="Địa chỉ" name="address" value={form.address} onChange={handleChange} required />
          {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
          <div className="w-full mt-2 flex justify-center">
            <Button className='text-white' type="submit" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center">
          Đã có tài khoản? <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage; 
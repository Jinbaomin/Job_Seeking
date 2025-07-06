import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import Modal from '../../components/common/Modal';
import { callChangePassword, callUpdateUser } from '../../config/api';
import { fetchAccount } from '../../redux/slice/accountSlice';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.account);

  // State cho modal đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  // State show/hide password
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // State cho cập nhật thông tin
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    address: user?.address || '',
  });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);
    try {
      await callUpdateUser(user?._id || '', {
        name: editForm.name,
        email: editForm.email,
        age: editForm.age,
        gender: editForm.gender,
        address: editForm.address,
      });
      await dispatch(fetchAccount());
      setIsEditing(false);
      setEditSuccess('Cập nhật thông tin thành công!');
      setTimeout(() => setEditSuccess(''), 2500);
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditError('');
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      age: user?.age || '',
      gender: user?.gender || '',
      address: user?.address || '',
    });
  };

  const handleOpenModal = () => {
    setShowChangePassword(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowChangePassword(false);
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setLoading(true);
    try {
      await callChangePassword(oldPassword, newPassword);
      setSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <p>Không tìm thấy thông tin user</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Alert nhỏ khi cập nhật thành công */}
      {editSuccess && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white bg-green-600 transition-all" style={{ minWidth: 240, textAlign: 'center' }}>{editSuccess}</div>
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Thông tin cá nhân</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Thông tin cơ bản</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <p className="mt-1 text-lg">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tuổi</label>
                  <p className="mt-1 text-lg">{user.age}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  <p className="mt-1 text-lg">{user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : 'Khác'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <p className="mt-1 text-lg">{user.address}</p>
                </div>
              </div>
            </div>

            {/* Thông tin bổ sung */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Thông tin bổ sung</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID người dùng</label>
                  <p className="mt-1 text-sm text-gray-500 font-mono">{user._id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái tài khoản</label>
                  <p className="mt-1">
                    <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lịch sử ứng tuyển (placeholder) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Lịch sử ứng tuyển</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              <p>Chưa có lịch sử ứng tuyển nào</p>
              <p className="text-sm mt-2">Bạn có thể tìm việc làm và ứng tuyển để xem lịch sử ở đây</p>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="mt-6 flex gap-4 justify-center">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsEditing(true)}
              type="button"
              disabled={isEditing}
            >
              Cập nhật thông tin
            </button>
            <button
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={handleOpenModal}
              type="button"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Modal cập nhật thông tin cá nhân */}
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Cập nhật thông tin cá nhân">
          <form onSubmit={handleEditSave} className="space-y-3 p-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input
                name="name"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                value={editForm.email}
                disabled
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tuổi</label>
              <input
                name="age"
                type="number"
                value={editForm.age}
                onChange={e => setEditForm({ ...editForm, age: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giới tính</label>
              <select
                name="gender"
                value={editForm.gender}
                onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <input
                name="address"
                value={editForm.address}
                onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {editError && <div className="text-red-600 text-sm">{editError}</div>}
            <div className="flex gap-2 pt-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={() => setIsEditing(false)}
                disabled={editLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={editLoading}
              >
                {editLoading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal đổi mật khẩu */}
        <Modal isOpen={showChangePassword} onClose={handleCloseModal} title="Đổi mật khẩu">
          <form onSubmit={handleChangePassword} className="space-y-4 p-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu cũ</label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowOld(v => !v)}
                >
                  {!showOld ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
                  }
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowNew(v => !v)}
                >
                  {!showNew ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
                  }
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(v => !v)}
                >
                  {!showConfirm ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
                  }
                </button>
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default ProfilePage; 
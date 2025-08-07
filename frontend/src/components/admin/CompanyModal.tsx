import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { createCompany, updateCompany } from '../../redux/slice/companySlice';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: {
    _id: string;
    name: string;
    address: string;
    description: string;
    logo?: string;
  } | null;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, company }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    logo: '',
  });
  const [loading, setLoading] = useState(false);

  const isEditMode = !!company;

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        address: company.address,
        description: company.description,
        logo: company.logo || '',
      });
    } else {
      setFormData({
        name: '',
        address: '',
        description: '',
        logo: '',
      });
    }
  }, [company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && company) {
        await dispatch(updateCompany({ id: company._id, data: formData })).unwrap();
      } else {
        await dispatch(createCompany(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Error saving company:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Chỉnh sửa công ty' : 'Thêm công ty mới'}>
      <form onSubmit={handleSubmit} className="space-y-4 p-7 max-h-[80vh] overflow-y-auto">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên công ty *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên công ty"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ *
          </label>
          <Input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ công ty"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả công ty"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
            Logo URL
          </label>
          <Input
            id="logo"
            name="logo"
            type="text"
            value={formData.logo}
            onChange={handleInputChange}
            placeholder="Nhập URL logo công ty"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CompanyModal; 
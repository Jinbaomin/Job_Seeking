import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { createJob, updateJob, fetchJobs } from '../../redux/slice/jobSlice';
import { fetchCompanies  } from '../../redux/slice/companySlice';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  // companies: any;
  skills: any;
  job?: {
    _id: string;
    name: string;
    skills: string[];
    companyId: {
      _id: string;
      name: string;
    };
    salary: number;
    quantity: number;
    level: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  } | null;
}

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, job }) => {
  const dispatch = useAppDispatch();
  const { companies } = useAppSelector(state => state.company);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    companyId: '',
    salary: '',
    quantity: '',
    level: 'Junior',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const isEditMode = !!job;

  useEffect(() => {
    // Fetch companies for dropdown
    dispatch(fetchCompanies({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (job) {
      setFormData({
        name: job.name,
        skills: job.skills.join(', '),
        companyId: job.companyId._id,
        salary: job.salary.toString(),
        quantity: job.quantity.toString(),
        level: job.level,
        description: job.description,
        startDate: job.startDate.split('T')[0],
        endDate: job.endDate.split('T')[0],
        isActive: job.isActive,
      });
    } else {
      setFormData({
        name: '',
        skills: '',
        companyId: '',
        salary: '',
        quantity: '',
        level: 'Intern',
        description: '',
        startDate: '',
        endDate: '',
        isActive: true,
      });
    }
  }, [job]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        salary: parseInt(formData.salary),
        quantity: parseInt(formData.quantity),
      };

      if (isEditMode && job) {
        await dispatch(updateJob({ id: job._id, data: jobData })).unwrap();
      } else {
        await dispatch(createJob(jobData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} maxWidth='max-w-xl' onClose={onClose} title={isEditMode ? 'Chỉnh sửa việc làm' : 'Thêm việc làm mới'}>
      <form onSubmit={handleSubmit} className="space-y-4 p-7 max-h-[80vh] overflow-y-auto">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên việc làm *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên việc làm"
            required
          />
        </div>

        <div>
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
            Công ty *
          </label>
          <select
            id="companyId"
            name="companyId"
            value={formData.companyId}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Chọn công ty</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
              Lương (VND) *
            </label>
            <Input
              id="salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="Nhập mức lương"
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng *
            </label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Nhập số lượng"
              required
              autoComplete='off'
              spellCheck={false}
            />
          </div>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
            Cấp độ *
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Intern">Intern</option>
            <option value="Fresher">Fresher</option>
            <option value="Junior">Junior</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Kỹ năng (phân cách bằng dấu phẩy)
          </label>
          <Input
            id="skills"
            name="skills"
            type="text"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="JavaScript, React, Node.js"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu *
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc *
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
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
            placeholder="Nhập mô tả việc làm"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Đang tuyển dụng
          </label>
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
            className={`bg-blue-600 text-white hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JobModal; 
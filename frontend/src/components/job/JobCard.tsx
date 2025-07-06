import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import ApplyJobModal from './ApplyJobModal';
import { useAppSelector } from '../../hooks/reduxHooks';

interface Job {
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
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    email: string;
  };
  deletedBy?: {
    _id: string;
    email: string;
  };
}

export interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { user } = useAppSelector(state => state.account);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const formatSalary = () => {
    return `${job.salary.toLocaleString()} VND`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getLevelText = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'Intern': 'Thực tập sinh',
      'Fresher': 'Fresher',
      'Junior': 'Junior',
      'Middle': 'Middle',
      'Senior': 'Senior',
      'Lead': 'Lead',
      'Manager': 'Manager',
    };
    return levelMap[level] || level;
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowApplyModal(true);
  };

  return (
    <>
      <Link to={`/job/${job._id}`} className="block">
        <div className="border rounded-lg p-6 shadow hover:shadow-lg transition cursor-pointer bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-700 mb-2">{job.name}</h3>
              <div className="text-sm text-gray-600 mb-2">
                {job.companyId.name}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {getLevelText(job.level)}
                </span>
                <span>Số lượng: {job.quantity}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">
                {formatSalary()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Đăng {formatDate(job.createdAt)}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 line-clamp-2">
            {job.description.substring(0, 150)}...
          </p>
          
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="text-xs text-gray-500">+{job.skills.length - 3} kỹ năng khác</span>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Hạn nộp: {formatDate(job.endDate)}
            </div>
            {user && job.isActive && (
              <Button
                onClick={handleApplyClick}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                Ứng tuyển nhanh
              </Button>
            )}
          </div>
        </div>
      </Link>

      {/* Apply Modal */}
      <ApplyJobModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobId={job._id}
        jobTitle={job.name}
        companyName={job.companyId.name}
        companyId={job.companyId._id}
      />
    </>
  );
};

export default JobCard; 
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

interface Company {
  _id: string;
  name: string;
  address: string;
  description: string;
  logo: string;
}

interface Job {
  _id: string;
  name: string;
  skills: string[];
  salary: number;
  level: string;
}

interface Resume {
  _id: string;
  email: string;
  userId: string;
  url: string;
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
  companyId: Company;
  jobId: Job;
  createdAt: string;
  updatedAt: string;
}

interface ResumeCardProps {
  resume: Resume;
  onDelete?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  showActions?: boolean;
  deleting?: boolean;
  updating?: boolean;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onDelete,
  onUpdateStatus,
  showActions = false,
  deleting = false,
  updating = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatSalary = (salary: number) => {
    return `${salary.toLocaleString()} VND`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },
      REVIEWING: { color: 'bg-blue-100 text-blue-800', text: 'Đang xem xét' },
      APPROVED: { color: 'bg-green-100 text-green-800', text: 'Đã duyệt' },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Từ chối' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getLevelText = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'Intern': 'Thực tập sinh',
      'Fresher': 'Mới tốt nghiệp',
      'Junior': 'Junior',
      'Middle': 'Middle',
      'Senior': 'Senior',
      'Lead': 'Lead',
      'Manager': 'Manager',
    };
    return levelMap[level] || level;
  };

  const handleDownload = () => {
    // Create download link for the resume file
    // const link = document.createElement('a');
    // link.href = `${import.meta.env.VITE_BACKEND_URL}/resumes/${resume.url}`;
    // link.download = resume.url;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    window.open(`http://localhost:3000${resume.url}`, '_blank');
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {resume.jobId.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {resume.companyId.name}
          </p>
          <div className="flex items-center gap-2">
            {getStatusBadge(resume.status)}
            <span className="text-xs text-gray-500">
              Ứng tuyển: {formatDate(resume.createdAt)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-green-600">
            {formatSalary(resume.jobId.salary)}
          </div>
          <div className="text-xs text-gray-500">
            {getLevelText(resume.jobId.level)}
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Email:</span>
            <div className="font-medium">{resume.email}</div>
          </div>
          <div>
            <span className="text-gray-500">File CV:</span>
            <div className="font-medium">{resume.url}</div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {resume.jobId.skills && resume.jobId.skills.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">Kỹ năng yêu cầu:</div>
          <div className="flex flex-wrap gap-2">
            {resume.jobId.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {resume.jobId.skills.length > 3 && (
              <span className="text-xs text-gray-500">
                +{resume.jobId.skills.length - 3} kỹ năng khác
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            Xem CV
          </Button>
          <Link
            to={`/job/${resume.jobId._id}`}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded"
          >
            Xem việc làm
          </Link>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {resume.status === 'PENDING' && (
              <>
                <Button
                  onClick={() => onUpdateStatus?.(resume._id, 'REVIEWING')}
                  disabled={updating}
                  className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700"
                >
                  {updating ? 'Đang cập nhật...' : 'Bắt đầu xem xét'}
                </Button>
                <Button
                  onClick={() => onUpdateStatus?.(resume._id, 'REJECTED')}
                  disabled={updating}
                  className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  {updating ? 'Đang cập nhật...' : 'Từ chối'}
                </Button>
              </>
            )}

            {resume.status === 'REVIEWING' && (
              <>
                <Button
                  onClick={() => onUpdateStatus?.(resume._id, 'APPROVED')}
                  disabled={updating}
                  className="px-3 py-1 text-sm bg-green-600 text-white hover:bg-green-700"
                >
                  {updating ? 'Đang cập nhật...' : 'Duyệt'}
                </Button>
                <Button
                  onClick={() => onUpdateStatus?.(resume._id, 'REJECTED')}
                  disabled={updating}
                  className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  {updating ? 'Đang cập nhật...' : 'Từ chối'}
                </Button>
              </>
            )}

            <Button
              onClick={() => onDelete?.(resume._id)}
              disabled={deleting}
              className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeCard; 
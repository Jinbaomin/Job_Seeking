import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import ApplyJobModal from '../../components/job/ApplyJobModal';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchJobById, clearCurrentJob } from '../../redux/slice/jobSlice';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentJob, loading, error } = useAppSelector(state => state.job);
  const { user } = useAppSelector(state => state.account);
  const [showApplyModal, setShowApplyModal] = React.useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [dispatch, id]);

  const formatSalary = () => {
    if (!currentJob) return '';
    return `${currentJob.salary.toLocaleString()} VND`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !currentJob) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy việc làm</h2>
            <p className="text-gray-600 mb-4">{error || 'Việc làm này không tồn tại hoặc đã bị xóa.'}</p>
            <Link to="/job" className="text-blue-600 hover:underline">
              ← Quay lại danh sách việc làm
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/job" className="text-blue-600 hover:underline">
            ← Quay lại danh sách việc làm
          </Link>
        </nav>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentJob.name}</h1>
              <div className="text-lg text-gray-600 mb-2">
                {currentJob.companyId.name}
              </div>
              <div className="text-2xl font-semibold text-green-600 mb-4">
                {formatSalary()}
              </div>
            </div>
            {user && currentJob.isActive && (
              <Button onClick={() => setShowApplyModal(true)} className="px-6 py-3">
                Ứng tuyển ngay
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Cấp độ:</span>
              <div className="font-medium">{getLevelText(currentJob.level)}</div>
            </div>
            <div>
              <span className="text-gray-500">Số lượng:</span>
              <div className="font-medium">{currentJob.quantity} người</div>
            </div>
            <div>
              <span className="text-gray-500">Ngày đăng:</span>
              <div className="font-medium">{formatDate(currentJob.createdAt)}</div>
            </div>
            <div>
              <span className="text-gray-500">Hạn nộp:</span>
              <div className="font-medium">{formatDate(currentJob.endDate)}</div>
            </div>
          </div>
        </div>

        {/* Job Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả công việc</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{currentJob.description}</p>
          </div>
        </div>

        {/* Skills */}
        {currentJob.skills && currentJob.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Kỹ năng yêu cầu</h2>
            <div className="flex flex-wrap gap-2">
              {currentJob.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin công ty</h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">
                {currentJob.companyId.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentJob.companyId.name}</h3>
              <p className="text-gray-600">Công ty công nghệ</p>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        <ApplyJobModal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          jobId={currentJob._id}
          companyId={currentJob.companyId._id}
          jobTitle={currentJob.name}
          companyName={currentJob.companyId.name}
        />
      </div>
    </MainLayout>
  );
};

export default JobDetailPage; 
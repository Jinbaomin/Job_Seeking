import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FileUpload from '../common/FileUpload';
import { useAppSelector } from '../../hooks/reduxHooks';
import { callCreateResume, callFileUpload } from '../../config/api';

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  companyId: string;
  jobTitle: string;
  companyName: string;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  isOpen,
  onClose,
  jobId,
  companyId,
  jobTitle,
  companyName,
}) => {
  const { user } = useAppSelector(state => state.account);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
  };

  const handleApply = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file CV');
      return;
    }

    if (!user) {
      setError('Vui lòng đăng nhập để ứng tuyển');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const { data } = await callFileUpload(jobId, selectedFile);
      console.log(data);

      await callCreateResume({ url: data.data.fileName, jobId, companyId });

      // Success
      alert('Ứng tuyển thành công!');
      onClose();
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Apply job error:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi ứng tuyển');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      onClose();
      setSelectedFile(null);
      setError('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ứng tuyển việc làm">
      <div className="p-6">
        {/* Job Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {jobTitle}
          </h3>
          <p className="text-gray-600">
            Công ty: <span className="font-medium">{companyName}</span>
          </p>
          {user && (
            <p className="text-gray-600 mt-1">
              Email: <span className="font-medium">{user.email}</span>
            </p>
          )}
        </div>

        {/* File Upload */}
        <FileUpload
          onFileSelect={handleFileSelect}
          acceptedTypes={['.pdf', '.doc', '.docx']}
          maxSize={5}
          label="Upload CV của bạn"
          error={error}
          disabled={uploading}
        />

        {/* Selected File Info */}
        {selectedFile && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                <p className="text-xs text-green-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Lưu ý:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• File CV phải có định dạng PDF, DOC hoặc DOCX</li>
            <li>• Kích thước file tối đa 5MB</li>
            <li>• Đảm bảo thông tin trong CV chính xác và đầy đủ</li>
            <li>• CV sẽ được gửi trực tiếp đến nhà tuyển dụng</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={handleClose}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            disabled={uploading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Đang ứng tuyển...' : 'Ứng tuyển ngay'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplyJobModal; 
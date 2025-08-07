import React, { useState } from 'react';
import Modal from '../../components/common/Modal';

interface CreatePostModalProps {
  onPostCreated?: (data: { content: string; tags: string[] }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onPostCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setContent('');
    setTags('');
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    // Simulate async post creation
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      if (onPostCreated) {
        onPostCreated({ content, tags: tags.split(',').map(t => t.trim()).filter(Boolean) });
      }
      setContent('');
      setTags('');
    }, 1000);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
      >
        Tạo bài viết mới
      </button>
      <Modal title="Tạo bài viết mới" isOpen={isModalOpen} onClose={handleClose}>
        <div className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung bài viết
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Bạn đang nghĩ gì?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent resize-none"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Ví dụ: react, javascript, web-development"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Đang tạo..." : "Đăng bài"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreatePostModal; 
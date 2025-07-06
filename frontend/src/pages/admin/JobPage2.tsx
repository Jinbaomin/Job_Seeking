import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchJobs, deleteJob } from '../../redux/slice/jobSlice';
import Button from '../../components/common/Button';
import JobModal from '../../components/admin/JobModal';
import Modal from '../../components/common/Modal';
import { callGetCompanies } from '../../config/api';
import useDebounce from '../../hooks/useDebounce';

const JobPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, total, currentPage, limit, totalPages, loading, creating, updating } = useAppSelector(state => state.job);
  const [currentPageState, setCurrentPageState] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobToDelete, setJobToDelete] = useState<any>(null);
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [companies, setCompanies] = useState<{ _id: string; name: string }[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Fetch companies and skills on mount
  useEffect(() => {
    callGetCompanies({ page: 1, limit: 100 }).then(res => {
      setCompanies(res.data?.data?.result || []);
    });
    // Fetch all skills from jobs (if no API)
    setSkillsLoading(true);
    dispatch(fetchJobs({ page: 1, limit: 1000 })).then((action: any) => {
      const jobsData = action.payload?.data?.result || [];
      const allSkills = Array.from(new Set(jobsData.flatMap((job: any) => job.skills)));
      setSkills(allSkills as string[]);
      setSkillsLoading(false);
    });
  }, [dispatch]);

  // Fetch jobs when filters or page change
  useEffect(() => {
    dispatch(fetchJobs({
      page: currentPageState,
      limit: 10,
      search: debouncedSearchTerm,
      companyId: selectedCompany || undefined,
      skills: selectedSkills.length > 0 ? selectedSkills.join(',') : undefined,
    }));
  }, [dispatch, currentPageState, creating, updating, debouncedSearchTerm, selectedCompany, selectedSkills]);

  const handlePageChange = (page: number) => {
    setCurrentPageState(page);
  };

  const handleAddJob = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  const handleEditJob = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = (job: any) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
      try {
        await dispatch(deleteJob(jobToDelete._id)).unwrap();
        setIsDeleteModalOpen(false);
        setJobToDelete(null);
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Filter/Search UI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên việc làm..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
          >
            <option value="">Tất cả công ty</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>{company.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Kỹ năng</label>
          <div className="flex flex-wrap gap-2">
            {skillsLoading ? (
              <span>Đang tải...</span>
            ) : (
              skills.map(skill => (
                <label key={skill} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={selectedSkills.includes(skill)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedSkills(prev => [...prev, skill]);
                      } else {
                        setSelectedSkills(prev => prev.filter(s => s !== skill));
                      }
                    }}
                  />
                  <span className="text-xs">{skill}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Quản lý việc làm</h3>
        <Button 
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleAddJob}
        >
          Thêm việc làm
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          {/* <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75v14.5m7.25-7.25H4.75" />
          </svg> */}
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
          <p className="text-lg font-medium">Không có việc làm nào phù hợp</p>
          <p className="text-sm">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{job.name}</h4>
                    <p className="text-sm text-gray-600">{job.companyId.name}</p>
                    <p className="text-sm text-gray-500">{job.salary.toLocaleString()} VND • {job.level}</p>
                    <p className="text-sm text-gray-500">Số lượng: {job.quantity}</p>
                    <p className="text-sm text-gray-500">
                      Thời gian: {formatDate(job.startDate)} - {formatDate(job.endDate)}
                    </p>
                    {job.skills && job.skills.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Kỹ năng:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {job.isActive ? 'Đang tuyển' : 'Đã đóng'}
                    </span>
                    <button 
                      className="text-blue-600 hover:text-blue-900 text-sm"
                      onClick={() => handleEditJob(job)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 text-sm"
                      onClick={() => handleDeleteJob(job)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Hiển thị {((currentPage - 1) * limit) + 1} đến {Math.min(currentPage * limit, total)} trong tổng số {total} việc làm
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Job Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={closeModal}
        job={selectedJob}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setJobToDelete(null);
        }}
        title="Xác nhận xóa"
      >
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Bạn có chắc chắn muốn xóa việc làm "{jobToDelete?.name}" không? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setJobToDelete(null);
              }}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Hủy
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobPage; 
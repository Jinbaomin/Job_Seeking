import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import JobCard from '../../components/job/JobCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchJobs, setCurrentPage } from '../../redux/slice/jobSlice';
import { callGetCompanies } from '../../config/api';
import useDebounce from '../../hooks/useDebounce';
import { Pagination } from 'antd';

const JobListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, loading, error, total, pages } = useAppSelector(state => state.job);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  // Filter state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get('company') || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get('skills') ? searchParams.get('skills')!.split(',') : []
  );
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || '');
  const [companies, setCompanies] = useState<{ _id: string; name: string }[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || '5'));

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Sync state to URL (like JobPage)
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (selectedCompany) params.set("company", selectedCompany);
    if (levelFilter) params.set("level", levelFilter);
    if (selectedSkills.length > 0) params.set("skills", selectedSkills.join(","));
    if (currentPage !== 1) params.set("page", String(currentPage));
    if (limit !== 5) params.set("limit", String(limit));
    setSearchParams(params);
  }, [debouncedSearchTerm, selectedCompany, levelFilter, selectedSkills, currentPage, limit, setSearchParams]);

  // Sync state from URL (for browser navigation)
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSelectedCompany(searchParams.get("company") || "");
    setLevelFilter(searchParams.get("level") || "");
    setSelectedSkills(searchParams.get("skills") ? searchParams.get("skills")!.split(",") : []);
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
    setLimit(parseInt(searchParams.get("limit") || "5"));
  }, [searchParams]);

  // Fetch companies and skills on mount
  useEffect(() => {
    callGetCompanies({ page: 1, limit: 100 }).then(res => {
      setCompanies(res.data?.data?.result || []);
    });

    // Fetch all skills from jobs
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
    let page = parseInt(searchParams.get('page') || '1');
    let limit = parseInt(searchParams.get('limit') || '5');

    // dispatch(setCurrentPage(page));

    dispatch(fetchJobs({
      page,
      limit,
      search: debouncedSearchTerm,
      companyId: selectedCompany || undefined,
      skills: selectedSkills.length > 0 ? selectedSkills.join(',') : undefined,
      level: levelFilter || undefined,
    }));
  }, [dispatch, debouncedSearchTerm, selectedCompany, selectedSkills, levelFilter, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by debounced effect
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setLimit(pageSize);
  }

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCompany("");
    setSelectedSkills([]);
    setLevelFilter("");
    setCurrentPage(1);
    setLimit(5);
  };

  const handleSkillToggle = (skill: string, checked: boolean) => {
    if (checked) {
      setSelectedSkills(prev => [...prev, skill]);
    } else {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tìm việc làm</h1>

        {/* Enhanced Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch}>
            {/* Search and Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
              <div>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả cấp độ</option>
                  <option value="INTERN">Intern</option>
                  <option value="FRESHER">Fresher</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEADER">Leader</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
              <div>
                <Button
                  type="button"
                  onClick={clearFilters}
                  className="w-full bg-gray-500 text-white hover:bg-gray-600"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>

            {/* Skills Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                {skillsLoading ? (
                  <span className="text-sm text-gray-500">Đang tải...</span>
                ) : (
                  skills.map(skill => (
                    <label key={skill} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        value={skill}
                        // checked={selectedSkills.includes(skill)}
                        checked={selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase())}
                        onChange={e => handleSkillToggle(skill, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCompany || selectedSkills.length > 0 || levelFilter) && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <div className="text-sm font-medium text-gray-700 mb-2">Bộ lọc đang áp dụng:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Công ty: {companies.find(c => c._id === selectedCompany)?.name}
                    </span>
                  )}
                  {levelFilter && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Cấp độ: {levelFilter}
                    </span>
                  )}
                  {selectedSkills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Tìm thấy {total} việc làm
          </p>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-400">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
            <p className="text-lg font-medium text-gray-500">Không có việc làm nào phù hợp</p>
            <p className="text-sm text-gray-400">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-700">
              Hiển thị {((currentPage - 1) * limit) + 1} đến {Math.min(currentPage * limit, total)} trong tổng số {total} việc làm
            </div>
            <Pagination
              align="end"
              current={currentPage}
              total={pages * limit}
              pageSize={limit}
              showSizeChanger
              onChange={(page, pageSize) => {
                console.log(page, pageSize);
                handlePageChange(page);
                handlePageSizeChange(pageSize);
                // if (changedPage != currentPage) setCurrentPage(changedPage);
                // if (changedLimit != limit) setLimit(changedLimit);
              }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default JobListPage; 
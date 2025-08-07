"use client"

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { fetchJobs, deleteJob, setCurrentPage } from "../../redux/slice/jobSlice";
import Button from "../../components/common/Button";
import JobModal from "../../components/admin/JobModal";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { Pagination, Select, Space } from "antd";
import Modal from "../../components/common/Modal";
import { formatSalary } from "../../utils/helper";

const JobPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, loading, deleting, error, total, pages } = useAppSelector((state) => state.job);

  // UI state
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSkills, setSelectedSkills] = useState(
    searchParams.get("skills") ? searchParams.get("skills")!.split(",") : []
  );
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "all");
  const [salaryRange, setSalaryRange] = useState({
    min: searchParams.get("minSalary") || "",
    max: searchParams.get("maxSalary") || "",
  });
  const [skills, setSkills] = useState<string[]>([
    'JavaScript', 'NodeJS', 'ReactJS', 'MongoDB', 'Redis', 'Go Lang', 'NestJS'
  ]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 5);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobToDelete, setJobToDelete] = useState<any>(null);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Fetch jobs when filters or page change
  useEffect(() => {
    dispatch(fetchJobs({
      page: currentPage,
      limit,
      search: debouncedSearchTerm || undefined,
      companyId: selectedCompany || undefined,
      skills: selectedSkills.length > 0 ? selectedSkills.join(",") : undefined,
      level: selectedLevel || undefined,
      minSalary: salaryRange.min || undefined,
      maxSalary: salaryRange.max || undefined,
    }));

    // })).then((action: any) => {
    //   const jobsData = action.payload?.data?.result || [];
    //   const allSkills = Array.from(new Set(jobsData.flatMap((job: any) => job.skills)));
    //   setSkills(allSkills as string[]);
    //   setSkillsLoading(false);
    // });
  }, [dispatch, currentPage, limit, debouncedSearchTerm, selectedCompany, selectedSkills, selectedLevel]);

  // Filter jobs client-side for status and salary (since backend may not support these filters)
  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && job.isActive) ||
      (selectedStatus === "inactive" && !job.isActive);
    const matchesSalary =
      (!salaryRange.min || job.salary >= Number.parseInt(salaryRange.min) * 1000000) &&
      (!salaryRange.max || job.salary <= Number.parseInt(salaryRange.max) * 1000000);
    return matchesStatus && matchesSalary;
  });

  // Pagination
  const startIndex = (currentPage - 1) * limit;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + limit);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(paginatedJobs.map((job) => job._id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (jobId: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs([...selectedJobs, jobId]);
    } else {
      setSelectedJobs(selectedJobs.filter((id) => id !== jobId));
    }
  };

  const handleDeleteJob = (job: any) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
      try {
        await dispatch(deleteJob(jobToDelete._id)).unwrap();
        setShowDeleteModal(false);
        setJobToDelete(null);
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    for (const jobId of selectedJobs) {
      await dispatch(deleteJob(jobId));
    }
    setSelectedJobs([]);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCompany("");
    setSelectedSkills([]);
    setSelectedLevel("");
    setSelectedStatus("all");
    setSalaryRange({ min: "", max: "" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Intern":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Fresher":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Junior":
        return "bg-green-100 text-green-800 border-green-200";
      case "Mid-level":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Senior":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
  }: {
    title: string
    value: number
    icon: React.ReactNode
    color: string
    subtitle?: string
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (selectedLevel) params.set("level", selectedLevel);
    if (selectedStatus !== "all") params.set("status", selectedStatus);
    if (salaryRange.min) params.set("minSalary", salaryRange.min);
    if (salaryRange.max) params.set("maxSalary", salaryRange.max);
    if (selectedSkills.length > 0) params.set("skills", selectedSkills.join(","));
    if (currentPage !== 1) params.set("page", String(currentPage));
    if (limit !== 5) params.set("limit", String(limit));
    setSearchParams(params);
  }, [debouncedSearchTerm, selectedLevel, selectedStatus, salaryRange, selectedSkills, currentPage, limit, setSearchParams]);

  // Sync state from URL (for browser navigation)
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSelectedLevel(searchParams.get("level") || "");
    setSelectedStatus(searchParams.get("status") || "all");
    setSalaryRange({
      min: searchParams.get("minSalary") || "",
      max: searchParams.get("maxSalary") || "",
    });
    setSelectedSkills(searchParams.get("skills") ? searchParams.get("skills")!.split(",") : []);
    setCurrentPage(Number(searchParams.get("page")) || 1);
    setLimit(Number(searchParams.get("limit")) || 5);
    // eslint-disable-next-line
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý việc làm</h1>
        <p className="text-gray-600 mt-2">Quản lý các vị trí tuyển dụng trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Tổng việc làm"
          value={total}
          color="bg-blue-100"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
          }
        />
        <StatCard
          title="Đang tuyển"
          value={jobs.filter((j) => j.isActive).length}
          color="bg-green-100"
          subtitle="Việc làm hoạt động"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Đã đóng"
          value={jobs.filter((j) => !j.isActive).length}
          color="bg-red-100"
          subtitle="Việc làm không hoạt động"
          icon={
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Công ty"
          value={jobs.length}
          color="bg-purple-100"
          subtitle="Đang tuyển dụng"
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h3>
          <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Xóa bộ lọc
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm theo tên việc làm hoặc công ty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cấp độ</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả cấp độ</option>
              <option value="Intern">Intern</option>
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang tuyển</option>
              <option value="inactive">Đã đóng</option>
            </select>
          </div>

          {/* Salary Range */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lương tối thiểu (triệu)</label>
            <input
              type="number"
              placeholder="VD: 20"
              value={salaryRange.min}
              onChange={(e) => setSalaryRange({ ...salaryRange, min: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lương tối đa (triệu)</label>
            <input
              type="number"
              placeholder="VD: 50"
              value={salaryRange.max}
              onChange={(e) => setSalaryRange({ ...salaryRange, max: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */}
          <Space wrap>
            <div className="flex gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lương tối thiểu (triệu)</label>
                <Select
                  defaultValue="1.000.000"
                  style={{ width: 300 }}
                  onChange={(value) => setSalaryRange({ ...salaryRange, min: value })}
                  // onChange={handleChange}
                  options={[
                    { value: '1000000', label: '1.000.000' },
                    { value: '5000000', label: '5.000.000' },
                    { value: '10000000', label: '10.000.000' },
                    { value: '15000000', label: '15.000.000' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lương tối đa (triệu)</label>
                <Select
                  defaultValue="5.000.000"
                  style={{ width: 300 }}
                  onChange={(value) => setSalaryRange({ ...salaryRange, max: value })}
                  // onChange={handleChange}
                  options={[
                    { value: '5000000', label: '5.000.000' },
                    { value: '10000000', label: '10.000.000' },
                    { value: '15000000', label: '15.000.000' },
                    { value: '20000000', label: '20.000.000' },
                  ]}
                />
              </div>
            </div>
          </Space>
        </div>

        {/* Skills Filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Kỹ năng</label>
          <div className="flex flex-wrap gap-2">
            {skillsLoading ? (
              <div className="text-sm text-gray-500">Đang tải kỹ năng...</div>
            ) : skills.length === 0 ? (
              <div className="text-sm text-gray-500">Không có kỹ năng nào được tìm thấy.</div>
            ) : (
              skills.map((skill) => (
                <label key={skill} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={selectedSkills.includes(skill)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSkills([...selectedSkills, skill]);
                      } else {
                        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{skill}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      {loading ? <LoadingSkeleton /> : (
        <>
          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Danh sách việc làm ({jobs.length})</h3>
                  <p className="text-sm text-gray-600">Quản lý các vị trí tuyển dụng</p>
                </div>

                <div className="flex items-center space-x-3">
                  {selectedJobs.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Đã chọn {selectedJobs.length}</span>
                      <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm việc làm
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg font-medium">Không tìm thấy việc làm nào</p>
                <p className="text-sm">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <>
                {/* Bulk Selection Header */}
                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedJobs.length === paginatedJobs.length && paginatedJobs.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Chọn tất cả</span>
                  </label>
                </div>

                {/* Job Cards */}
                <div className="p-6">
                  <div className="grid gap-6">
                    {jobs.map((job) => (
                      <div
                        key={job._id}
                        className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedJobs.includes(job._id)}
                              onChange={(e) => handleSelectJob(job._id, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                            />

                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                              {job.companyId.name.charAt(0)}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                    {job.name}
                                  </h4>
                                  <p className="text-gray-600 font-medium">{job.companyId.name}</p>
                                  <p className="text-sm text-gray-500 mt-1">{job.description}</p>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${job.isActive
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-red-100 text-red-800 border-red-200"
                                      }`}
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full mr-2 ${job.isActive ? "bg-green-500" : "bg-red-500"}`}
                                    ></div>
                                    {job.isActive ? "Đang tuyển" : "Đã đóng"}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                  </svg>
                                  {formatSalary(job.salary)}
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {job.companyId.address}
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                  </svg>
                                  {job.quantity} vị trí
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                                    />
                                  </svg>
                                  {formatDate(job.endDate)}
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(job.level)}`}
                                  >
                                    {job.level}
                                  </span>

                                  <div className="flex flex-wrap gap-1">
                                    {job.skills.slice(0, 3).map((skill, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {job.skills.length > 3 && (
                                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                        +{job.skills.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => {
                                      setSelectedJob(job);
                                      setShowEditModal(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJob(job)}
                                    className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Hiển thị {startIndex + 1} đến {Math.min(startIndex + limit, total)} trong tổng
                        số {total} việc làm
                      </div>
                      <Pagination
                        align="end"
                        current={currentPage}
                        total={pages * limit}
                        pageSize={limit}
                        showSizeChanger
                        onChange={(changedPage, changedLimit) => {
                          console.log(changedPage, changedLimit);
                          if (changedPage != currentPage) setCurrentPage(changedPage);
                          if (changedLimit != limit) setLimit(changedLimit);
                        }}
                      />
                      {/* <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </button>

                        {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                              }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentPage(Math.min(pages, currentPage + 1))}
                          disabled={currentPage === pages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sau
                        </button>
                      </div> */}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {/* <Pagination
            align="end"
            current={currentPage}
            total={pages * limit}
            pageSize={limit}
            onChange={(changedPage, changedLimit) => {
              console.log(changedPage, changedLimit);
              if (changedPage != currentPage) setCurrentPage(changedPage);
              if (changedLimit != limit) setLimit(changedLimit);
            }}
          /> */}
        </>
      )}

      {/* Add Job Modal */}
      {showAddModal && (
        <JobModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={() => {
            // TODO: Implement add job logic
            setShowAddModal(false);
          }}
          job={null}
          skills={skills}
        />
      )}

      {/* Edit Job Modal */}
      {showEditModal && selectedJob && (
        <JobModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={() => {
            // TODO: Implement edit job logic
            setShowEditModal(false);
          }}
          job={selectedJob}
          skills={skills}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn xóa việc làm "{jobToDelete?.name}" không?
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={confirmDelete}
              className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {deleting ? 'Đang xóa' : 'Xóa'}
            </button>
          </div>
        </div>
      </Modal>
      {/* {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
                  <p className="text-sm text-gray-600">
                    Bạn có chắc chắn muốn xóa việc làm "{jobToDelete?.name}" không?
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default JobPage;

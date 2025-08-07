import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { callGetJobs, callGetJobById, callCreateJob, callUpdateJob, callDeleteJob } from '../../config/api';

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

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
  pages: number;
}

const initialState: JobState = {
  jobs: [],
  currentJob: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  total: 0,
  currentPage: 1,
  limit: 5,
  pages: 0,
};

// Async thunk: lấy danh sách jobs
export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async (params?: { page?: number; limit?: number; search?: string; skills?: string; companyId?: string; level?: string, minSalary?: string, maxSalary?: string }) => {
    const response = await callGetJobs(params);
    // console.log(response.data);
    return response.data;
  }
);

// Async thunk: lấy chi tiết job
export const fetchJobById = createAsyncThunk(
  'job/fetchJobById',
  async (id: string) => {
    const response = await callGetJobById(id);
    return response.data;
  }
);

// Async thunk: tạo job mới
export const createJob = createAsyncThunk(
  'job/createJob',
  async (data: any) => {
    const response = await callCreateJob(data);
    return response.data;
  }
);

// Async thunk: cập nhật job
export const updateJob = createAsyncThunk(
  'job/updateJob',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await callUpdateJob(id, data);
    return response.data;
  }
);

// Async thunk: xóa job
export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (id: string) => {
    const response = await callDeleteJob(id);
    return { id, data: response.data };
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    clearCurrentJob(state) {
      state.currentJob = null;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data.result;
        state.total = action.payload.data.meta.total;
        state.currentPage = action.payload.data.meta.currentPage;
        state.limit = action.payload.data.meta.pageSize;
        state.pages = action.payload.data.meta.pages;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      // Fetch job by id
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.data;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch job details';
      })
      // Create job
      .addCase(createJob.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.creating = false;
        // Add new job to the list
        state.jobs.unshift(action.payload.data);
        state.total += 1;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create job';
      })
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.updating = false;
        // Update job in list if exists
        const updatedJob = action.payload.data;
        const index = state.jobs.findIndex(job => job._id === updatedJob._id);
        if (index !== -1) {
          state.jobs[index] = updatedJob;
        }
        // Update current job if it's the same job
        if (state.currentJob && state.currentJob._id === updatedJob._id) {
          state.currentJob = updatedJob;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to update job';
      })
      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.deleting = false;
        // Remove job from list
        state.jobs = state.jobs.filter(job => job._id !== action.payload.id);
        state.total -= 1;
        // Clear current job if it's the deleted one
        if (state.currentJob && state.currentJob._id === action.payload.id) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message || 'Failed to delete job';
      });
  },
});

export const { clearCurrentJob, setCurrentPage, clearError } = jobSlice.actions;
export default jobSlice.reducer; 
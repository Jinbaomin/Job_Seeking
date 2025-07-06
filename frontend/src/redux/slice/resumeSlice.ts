import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { callGetResumes, callGetResumeById, callGetMyResumes, callCreateResume, callUpdateResume, callDeleteResume, callUpdateResumeStatus } from '../../config/api';

interface Company {
  _id: string;
  name: string;
  address: string;
  description: string;
  logo: string;
  createdBy: {
    _id: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    email: string;
  };
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Job {
  _id: string;
  name: string;
  skills: string[];
  companyId: string;
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    email: string;
  };
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  age: number;
  gender: string;
  address: string;
}

interface Resume {
  _id: string;
  email: string;
  url: string;
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
  companyId: Company;
  jobId: Job;
  userId: User;
  createdBy: {
    userId: string;
    email: string;
  };
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

const initialState: ResumeState = {
  resumes: [],
  currentResume: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  total: 0,
  currentPage: 1,
  limit: 10,
  totalPages: 0,
};

// Async thunk: lấy danh sách resumes
export const fetchResumes = createAsyncThunk(
  'resume/fetchResumes',
  async (params?: { page?: number; limit?: number; userId?: string; jobId?: string; companyId?: string; status?: string, query?: string }) => {
    const response = await callGetResumes(params);
    return response.data;
  }
);

// Async thunk: lấy danh sách resumes của user hiện tại
export const fetchMyResumes = createAsyncThunk(
  'resume/fetchMyResumes',
  async (params?: { page?: number; limit?: number; status?: string, query?: string }) => {
    const response = await callGetMyResumes(params);
    return response.data;
  }
);

// Async thunk: lấy chi tiết resume
export const fetchResumeById = createAsyncThunk(
  'resume/fetchResumeById',
  async (id: string) => {
    const response = await callGetResumeById(id);
    return response.data;
  }
);

// Async thunk: tạo resume mới
export const createResume = createAsyncThunk(
  'resume/createResume',
  async (data: FormData) => {
    const response = await callCreateResume(data);
    return response.data;
  }
);

// Async thunk: cập nhật resume
export const updateResume = createAsyncThunk(
  'resume/updateResume',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await callUpdateResume(id, data);
    return response.data;
  }
);

// Async thunk: xóa resume
export const deleteResume = createAsyncThunk(
  'resume/deleteResume',
  async (id: string) => {
    const response = await callDeleteResume(id);
    return { id, data: response.data };
  }
);

// Async thunk: cập nhật trạng thái resume
export const updateResumeStatus = createAsyncThunk(
  'resume/updateResumeStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await callUpdateResumeStatus(id, status);
    return response.data;
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearCurrentResume(state) {
      state.currentResume = null;
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
      // Fetch resumes
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload.data.result;
        state.total = action.payload.data.meta.total;
        state.currentPage = action.payload.data.meta.currentPage;
        state.limit = action.payload.data.meta.pageSize;
        state.totalPages = action.payload.data.meta.pages;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resumes';
      })
      // Fetch my resumes
      .addCase(fetchMyResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload.data.result;
        state.total = action.payload.data.meta.total;
        state.currentPage = action.payload.data.meta.currentPage;
        state.limit = action.payload.data.meta.pageSize;
        state.totalPages = action.payload.data.meta.pages;
      })
      .addCase(fetchMyResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch my resumes';
      })
      // Fetch resume by id
      .addCase(fetchResumeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload.data;
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resume details';
      })
      // Create resume
      .addCase(createResume.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.creating = false;
        // Add new resume to the list
        state.resumes.unshift(action.payload.data);
        state.total += 1;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create resume';
      })
      // Update resume
      .addCase(updateResume.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.updating = false;
        // Update resume in list if exists
        const updatedResume = action.payload.data;
        const index = state.resumes.findIndex(resume => resume._id === updatedResume._id);
        if (index !== -1) {
          state.resumes[index] = updatedResume;
        }
        // Update current resume if it's the same resume
        if (state.currentResume && state.currentResume._id === updatedResume._id) {
          state.currentResume = updatedResume;
        }
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to update resume';
      })
      // Delete resume
      .addCase(deleteResume.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.deleting = false;
        // Remove resume from list
        state.resumes = state.resumes.filter(resume => resume._id !== action.payload.id);
        state.total -= 1;
        // Clear current resume if it's the deleted one
        if (state.currentResume && state.currentResume._id === action.payload.id) {
          state.currentResume = null;
        }
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message || 'Failed to delete resume';
      })
      // Update resume status
      .addCase(updateResumeStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateResumeStatus.fulfilled, (state, action) => {
        state.updating = false;
        // Update resume in list if exists
        const updatedResume = action.payload.data;
        const index = state.resumes.findIndex(resume => resume._id === updatedResume._id);
        if (index !== -1) {
          state.resumes[index] = updatedResume;
        }
        // Update current resume if it's the same resume
        if (state.currentResume && state.currentResume._id === updatedResume._id) {
          state.currentResume = updatedResume;
        }
      })
      .addCase(updateResumeStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to update resume status';
      });
  },
});

export const { clearCurrentResume, setCurrentPage, clearError } = resumeSlice.actions;
export default resumeSlice.reducer; 
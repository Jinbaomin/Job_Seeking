import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { callGetCompanies, callGetCompanyById, callCreateCompany, callUpdateCompany, callDeleteCompany } from '../../config/api';

interface Company {
  _id: string;
  name: string;
  address: string;
  description: string;
  logo?: string;
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

interface CompanyState {
  companies: Company[];
  currentCompany: Company | null;
  loading: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

const initialState: CompanyState = {
  companies: [],
  currentCompany: null,
  loading: false,
  updating: false,
  deleting: false,
  error: null,
  total: 0,
  currentPage: 1,
  limit: 5,
  totalPages: 0,
};

// Async thunk: lấy danh sách companies
export const fetchCompanies = createAsyncThunk(
  'company/fetchCompanies',
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await callGetCompanies(params);
    return response.data;
  }
);

// Async thunk: lấy chi tiết company
export const fetchCompanyById = createAsyncThunk(
  'company/fetchCompanyById',
  async (id: string) => {
    const response = await callGetCompanyById(id);
    return response.data;
  }
);

// Async thunk: tạo company mới
export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (data: any) => {
    const response = await callCreateCompany(data);
    return response.data;
  }
);

// Async thunk: cập nhật company
export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await callUpdateCompany(id, data);
    return response.data;
  }
);

// Async thunk: xóa company
export const deleteCompany = createAsyncThunk(
  'company/deleteCompany',
  async (id: string) => {
    const response = await callDeleteCompany(id);
    return { id, data: response.data };
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearCurrentCompany(state) {
      state.currentCompany = null;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data.result;
        state.total = action.payload.data.meta.total;
        state.currentPage = action.payload.data.meta.currentPage;
        state.limit = action.payload.data.meta.pageSize;
        state.totalPages = action.payload.data.meta.pages;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch companies';
      })
      // Fetch company by id
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompany = action.payload.data;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch company details';
      })
      // Create company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Add new company to the list
        state.companies.push(action.payload.data);
        state.total += 1;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create company';
      })
      // Update company
      .addCase(updateCompany.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.updating = false;
        // Update company in list if exists
        const updatedCompany = action.payload.data;
        const index = state.companies.findIndex(company => company._id === updatedCompany._id);
        if (index !== -1) {
          state.companies[index] = updatedCompany;
        }
        // Update current company if it's the same company
        if (state.currentCompany && state.currentCompany._id === updatedCompany._id) {
          state.currentCompany = updatedCompany;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to update company';
      })
      // Delete company
      .addCase(deleteCompany.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.deleting = false;
        // Remove company from list
        state.companies = state.companies.filter(company => company._id !== action.payload.id);
        state.total -= 1;
        // Clear current company if it's the deleted one
        if (state.currentCompany && state.currentCompany._id === action.payload.id) {
          state.currentCompany = null;
        }
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message || 'Failed to delete company';
      });
  },
});

export const { clearCurrentCompany, setCurrentPage } = companySlice.actions;
export default companySlice.reducer; 
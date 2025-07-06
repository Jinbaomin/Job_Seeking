import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { callGetUsers, callGetUserById, callUpdateUser, callDeleteUser, callToggleStatusUser } from '../../config/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  age: number;
  gender: string;
  address: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  refreshToken?: string;
  isActive?: string;
}

interface Meta {
  currentPage: number;
  pageSize: number;
  pages: number;
  total: number;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
  pages: number;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  limit: 10,
  pages: 0,
};

// Async thunk: lấy danh sách users
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const response = await callGetUsers(params);
    // console.log(response.data);
    return response.data;
  }
);

// Async thunk: lấy chi tiết user
export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id: string) => {
    const response = await callGetUserById(id);
    return response.data;
  }
);

// Async thunk: cập nhật user
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await callUpdateUser(id, data);
    return response.data;
  }
);

// Async thunk: xóa user
export const toggleStatusUser = createAsyncThunk(
  'user/toggleStatusUser',
  async (id: string) => {
    const response = await callToggleStatusUser(id);
    return { ...response.data };
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearCurrentUser(state) {
      state.currentUser = null;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Handle new API response structure
        const { data } = action.payload;
        state.users = data.result;
        state.total = data.meta.total;
        state.currentPage = data.meta.currentPage;
        state.limit = data.meta.pageSize;
        state.pages = data.meta.pages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Fetch user by id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data.user;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user details';
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update user in list if exists
        const updatedUser = action.payload.data.user;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        // Update current user if it's the same user
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      // Delete user
      .addCase(toggleStatusUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleStatusUser.fulfilled, (state, action) => {
        state.loading = false;
        // Remove user from list
        // state.users = state.users.filter(user => user._id !== action.payload.id);
        // state.total -= 1;
        // Clear current user if it's the deleted one
        // if (state.currentUser && state.currentUser._id === action.payload.id) {
        //   state.currentUser = action.payload.data;
        // }
        console.log(action.payload);
        for (let i = 0; i < state.users.length; i++) {
          if (state.users[i]._id === action.payload.data._id) {
            state.users[i].isDeleted = action.payload.data.isDeleted;
          }
        }
      })
      .addCase(toggleStatusUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
      });
  },
});

export const { clearCurrentUser, setCurrentPage } = userSlice.actions;
export default userSlice.reducer; 
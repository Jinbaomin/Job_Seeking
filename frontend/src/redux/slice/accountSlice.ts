import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { callFetchAccount } from '../../config/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  age: number;
  gender: string;
  address: string;
}

interface AccountState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Async thunk: lấy thông tin tài khoản
export const fetchAccount = createAsyncThunk(
  'account/fetchAccount',
  async () => {
    const response = await callFetchAccount();
    console.log(response.data);
    return response.data;
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.clear();
      // localStorage.removeItem('access_token');
      // localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
      })
      .addCase(fetchAccount.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, setAccount } = accountSlice.actions;
export default accountSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
// Import các slice reducer
import accountReducer from './slice/accountSlice';
import jobReducer from './slice/jobSlice';
import companyReducer from './slice/companySlice';
import userReducer from './slice/userSlice';
import resumeReducer from './slice/resumeSlice';
import postReducer from './slice/postSlice';

export const store = configureStore({
  reducer: {
    // Đăng ký các slice reducer
    account: accountReducer,
    job: jobReducer,
    company: companyReducer,
    user: userReducer,
    resume: resumeReducer,
    post: postReducer,
  },
});

// Type cho toàn bộ state và dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import axios from './axios-customize';

// Auth APIs
export const callLogin = (username: string, password: string) => {
  return axios.post('/auth/login', { username, password });
};

export const callRegister = (name: string, email: string, password: string, age: string, gender: string, address: string) => {
  return axios.post('/auth/register', { name, email, password, age, gender, address });
};

export const callFetchAccount = () => {
  return axios.get('/auth/account');
};

// Job APIs
export const callGetJobs = (params?: { page?: number; limit?: number; search?: string; skills?: string; companyId?: string; level?: string }) => {
  return axios.get('/jobs', { params });
};

export const callGetJobById = (id: string) => {
  return axios.get(`/jobs/${id}`);
};

export const callCreateJob = (data: any) => {
  return axios.post('/jobs', data);
};

export const callUpdateJob = (id: string, data: any) => {
  return axios.patch(`/jobs/${id}`, data);
};

export const callDeleteJob = (id: string) => {
  return axios.delete(`/jobs/${id}`);
};

// Company APIs
export const callGetCompanies = (params?: { page?: number; limit?: number; search?: string }) => {
  return axios.get('/companies', { params });
};

export const callGetCompanyById = (id: string) => {
  return axios.get(`/companies/${id}`);
};

export const callCreateCompany = (data: any) => {
  return axios.post('/companies', data);
};

export const callUpdateCompany = (id: string, data: any) => {
  return axios.patch(`/companies/${id}`, data);
};

export const callDeleteCompany = (id: string) => {
  return axios.delete(`/companies/${id}`);
};

// User APIs
export const callGetUsers = (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
  return axios.get('/users', { params });
};

export const callGetUserById = (id: string) => {
  return axios.get(`/users/${id}`);
};

export const callUpdateUser = (id: string, data: any) => {
  return axios.patch(`/users/${id}`, data);
};

export const callChangePassword = (oldPassword: string, newPassword: string) => {
  return axios.post('/users/change-password', { oldPassword, newPassword });
};

export const callDeleteUser = (id: string) => {
  return axios.delete(`/users/${id}`);
}

export const callToggleStatusUser = (id: string) => {
  return axios.patch(`/users/${id}/status`);
}

// Resume APIs
export const callGetResumes = (params?: { page?: number; limit?: number; userId?: string; jobId?: string; companyId?: string; status?: string, query?: string }) => {
  return axios.get('/resumes', { params });
};

export const callGetResumeById = (id: string) => {
  return axios.get(`/resumes/${id}`);
};

export const callGetMyResumes = (params?: { page?: number; limit?: number; status?: string, query?: string }) => {
  return axios.get(`/resumes/me`, { params });
}

export const callCreateResume = (data: any) => {
  return axios.post('/resumes', data);
};

export const callUpdateResume = (id: string, data: any) => {
  return axios.patch(`/resumes/${id}`, data);
};

export const callDeleteResume = (id: string) => {
  return axios.delete(`/resumes/${id}`);
};

export const callUpdateResumeStatus = (id: string, status: string) => {
  return axios.patch(`/resumes/${id}/status`, { status });
};

// File Upload APIs
export const callUploadFile = (file: File, type: string = 'resume') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  return axios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// File Upload APIs
export const callFileUpload = (jobId: string, file: File) => {
  const formData = new FormData();
  // formData.append('jobId', jobId);
  formData.append('fileUpload', file);
  return axios.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const callGetApplications = (params?: { page?: number; limit?: number; userId?: string; jobId?: string }) => {
  return axios.get('/application', { params });
};

// AI
export const sendChatMessage = (
  // messages: Array<{ role: string; content: string }>,
  message: string
) =>
  axios.post(`/ai/chat`, { message }, {
    headers: {
      'Content-Type': 'application/json',
    },
  }); 

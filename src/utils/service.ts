import axios from 'axios';

export const BASE_URL = 'https://api.chiedzacheafrica.com/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const logout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  localStorage.removeItem('role');
  localStorage.removeItem('isLoggedIn');
  
  window.location.href = '/login';
  
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Session Expired', {
      body: 'You have been logged out. Please log in again.',
      icon: '/favicon.svg'
    });
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Session expired or unauthorized access detected');
      logout();
    }
    return Promise.reject(error);
  }
);

export const get = async <T>(url: string, params?: object): Promise<T> => {
  const response = await axiosInstance.get<T>(url, { params });
  return response.data;
};

export const post = async <T>(url: string, data?: object): Promise<T> => {
  const response = await axiosInstance.post<T>(url, data);
  return response.data;
};

export const put = async <T>(url: string, data?: object): Promise<T> => {
  const response = await axiosInstance.put<T>(url, data);
  return response.data;
};

export const del = async <T>(url: string): Promise<T> => {
  const response = await axiosInstance.delete<T>(url);
  return response.data;
};

export const upload = async <T>(url: string, formData: FormData): Promise<T> => {
  const response = await axiosInstance.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const patch = async <T>(url: string, data?: object): Promise<T> => {
  const response = await axiosInstance.patch<T>(url, data);
  return response.data;
};

export { logout };
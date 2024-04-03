import axios from 'axios';

let baseURL = 'http://localhost:3000';
if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
  baseURL = import.meta.env.VITE_APP_SERVER;
}

const config = {
  baseURL,
  withCredentials: true,
};

const myApi = axios.create(config);

myApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default myApi;
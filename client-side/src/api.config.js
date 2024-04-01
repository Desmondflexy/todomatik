import axios from 'axios';

const development_mode = true;
const baseURL = development_mode
  ? 'http://localhost:3000'
  : 'https://todomatic.onrender.com';

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
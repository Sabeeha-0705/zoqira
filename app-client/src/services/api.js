import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 👇 Replace this IP if changes later (use your IPv4 always)
const API_URL = 'http://10.91.253.162:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      // navigation handled in AuthContext
    }
    return Promise.reject(error);
  }
);

export default api;

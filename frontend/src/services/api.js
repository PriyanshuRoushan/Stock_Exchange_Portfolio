import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Crucial for sending and receiving JWT HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

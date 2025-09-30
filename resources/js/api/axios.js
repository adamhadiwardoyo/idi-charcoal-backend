import axios from "axios";

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true, // 👈 important
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://quiz-site-production-d05e.up.railway.app')
});

export default api;

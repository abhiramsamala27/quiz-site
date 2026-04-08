import axios from 'axios';

const api = axios.create({
  baseURL: 'https://quiz-backend-live.onrender.com'
});

export default api;

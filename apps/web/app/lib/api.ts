import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api/email', // Adjust if behind proxy
    withCredentials: true,
});

export const authApi = axios.create({
    baseURL: 'http://localhost:3001/auth',
    withCredentials: true,
});

export default api;

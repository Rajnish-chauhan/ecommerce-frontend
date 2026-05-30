import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // Crucial for security and sessions
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://ecommerce.backend.rajnishsystems.in/',
    withCredentials: true, // Crucial for security and sessions
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;
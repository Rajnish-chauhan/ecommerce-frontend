import axios from 'axios';
import URL_TEST from '../jsconfig';
const axiosClient = axios.create({
    baseURL: `${URL_TEST}`,
    withCredentials: true, // Crucial for security and sessions
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;
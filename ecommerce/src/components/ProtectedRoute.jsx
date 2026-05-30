import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component wraps around secret pages to protect them
export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { user } = useContext(AuthContext);

    // 1. If not logged in, kick them to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If the page requires Admin, and the user is NOT an Admin, kick them to Home
    if (requireAdmin && user.role !== 'ADMIN') {
        alert("Access Denied: You do not have Admin privileges.");
        return <Navigate to="/" replace />;
    }

    // 3. If they pass the checks, show them the page
    return children;
}
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { user } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'ADMIN') {
        showToast("Access Denied: Administrative privileges required.", "error");
        return <Navigate to="/" replace />;
    }

    return children;
}
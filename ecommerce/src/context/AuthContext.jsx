import { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('ecommerce_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('ecommerce_user', JSON.stringify(userData));
    };

    // Update user state and persist to local storage after profile updates
    const updateUser = (updatedData) => {
        const newData = { ...user, ...updatedData };
        setUser(newData);
        localStorage.setItem('ecommerce_user', JSON.stringify(newData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ecommerce_user');
    };

    // Handle Google OAuth post-login redirect and fetch user profile
    useEffect(() => {
        // Read URL query parameters from standard path or HashRouter fragment
        let emailFromUrl = new URLSearchParams(window.location.search).get('email');
        if (!emailFromUrl && window.location.hash.includes('?')) {
            const queryPart = window.location.hash.split('?')[1];
            emailFromUrl = new URLSearchParams(queryPart).get('email');
        }

        if (emailFromUrl) {
            axiosClient.get(`/users/by-email?email=${encodeURIComponent(emailFromUrl)}`)
                .then(response => {
                    login(response.data);
                    // Remove query parameters from address bar to prevent repeated requests on refresh
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(error => {
                    console.error("Error retrieving user details after OAuth sign-in:", error);
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
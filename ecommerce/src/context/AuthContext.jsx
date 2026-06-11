import { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient'; // 🔥 Apne API client ko import karein

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

    // Profile update ke baad local state change karne ke liye
    const updateUser = (updatedData) => {
        const newData = { ...user, ...updatedData };
        setUser(newData);
        localStorage.setItem('ecommerce_user', JSON.stringify(newData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ecommerce_user');
    };

    //  Google OAuth Success Handler
    useEffect(() => {
        // URL se query parameters padhein
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get('email');

        // Agar URL mein email aaya hai (Google login ke baad)
        if (emailFromUrl) {
            // Backend se full user details (image, name, id) fetch karein
            axiosClient.get(`/users/by-email?email=${emailFromUrl}`)
                .then(response => {
                    // Pura user object context aur localStorage mein save ho jayega
                    login(response.data); 
                    
                    // URL ko clean kar dein taaki refresh karne par baar-baar API call na ho
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(error => {
                    console.error("❌ Error fetching user data after Google Login:", error);
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
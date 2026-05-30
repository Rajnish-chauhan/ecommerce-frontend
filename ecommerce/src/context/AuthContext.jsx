import { createContext, useState } from 'react';

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

    // NAYA FUNCTION: Profile update ke baad local state change karne ke liye
    const updateUser = (updatedData) => {
        const newData = { ...user, ...updatedData };
        setUser(newData);
        localStorage.setItem('ecommerce_user', JSON.stringify(newData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ecommerce_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
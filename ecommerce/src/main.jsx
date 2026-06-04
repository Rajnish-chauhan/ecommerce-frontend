import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css'; 

// 🔥 1. Import your Context Providers here
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
       
        <AuthProvider>
            <SearchProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </SearchProvider>
        </AuthProvider>
    </React.StrictMode>
);
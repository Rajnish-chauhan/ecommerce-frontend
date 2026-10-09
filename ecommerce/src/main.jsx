import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* ToastProvider must wrap the root tree so all child contexts have access to notifications */}
        <ToastProvider>
            <AuthProvider>
                <SearchProvider>
                    <CartProvider>
                        <App />
                    </CartProvider>
                </SearchProvider>
            </AuthProvider>
        </ToastProvider>
    </React.StrictMode>
);
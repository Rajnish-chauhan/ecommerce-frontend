import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Purana import './index.css' yahan se hata diya hai
import './App.css'; // <-- Ab sirf humari Master App.css import hogi

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
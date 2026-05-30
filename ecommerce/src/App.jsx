import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <SearchProvider>
                    <Router>
                        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
                            <Navbar />
                            <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                    <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                                    
                                
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    </Router>
                </SearchProvider>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import AdminAddProduct from './pages/AdminAddProduct';
import ProtectedRoute from './components/ProtectedRoute'; // Bring in your protected route

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main className="min-h-screen px-4 pt-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cart" element={<Cart />} />
                    
                    {/*  PROTECTED ROUTES: Wrap sensitive pages to prevent crashes  */}
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <MyOrders />
                        </ProtectedRoute>
                    } />
                    
                    {/* Admin Only Route */}
                    <Route path="/add-product" element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminAddProduct />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}
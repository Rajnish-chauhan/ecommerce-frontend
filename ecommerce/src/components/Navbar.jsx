import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { searchQuery, setSearchQuery } = useContext(SearchContext);
    const { user, logout } = useContext(AuthContext);

    return (
        <motion.nav 
            className="sticky top-0 z-50 bg-slate-900 text-white shadow-xl"
            initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100 }}
        >
            <div className="flex flex-wrap items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-4">
                <Link to="/" className="text-2xl font-black text-amber-400 tracking-tight shrink-0">
                    SastaHai
                </Link>
                
                <div className="flex-grow max-w-xl mx-4">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    />
                </div>

                <div className="flex items-center gap-6 text-sm font-semibold shrink-0">
                    <Link to="/" className="hover:text-amber-400 transition">Home</Link>
                    <Link to="/cart" className="hover:text-amber-400 transition">Cart</Link>
                    
                    {/* 🔥 MY ORDERS ALWAYS VISIBLE NOW 🔥 */}
                    <Link to="/orders" className="hover:text-amber-400 transition">My Orders</Link>
                    
                    {user?.role === 'ADMIN' && (
                        <Link to="/add-product" className="text-rose-400 hover:text-rose-300 transition">Admin Panel</Link>
                    )}
                    
                    {!user ? (
                        <Link to="/login" className="px-5 py-2 rounded-lg bg-amber-400 text-slate-900 font-bold hover:bg-amber-300 transition shadow">Login</Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                                <img 
                                    src={user.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                    alt="Profile" 
                                    className="w-8 h-8 rounded-full border-2 border-amber-400 object-cover"
                                />
                                <span className="font-bold text-amber-400">{user.name?.split(' ')[0]}</span>
                            </Link>
                            <button onClick={logout} className="text-sm font-bold text-slate-300 hover:text-white transition">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
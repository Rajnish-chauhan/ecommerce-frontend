import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useState } from 'react';
import { SearchContext } from '../context/SearchContext';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { searchQuery, setSearchQuery } = useContext(SearchContext);
    const { user, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 🔥 Mobile Menu State

    return (
        <motion.nav 
            className="sticky top-0 z-50 bg-slate-900 text-white shadow-xl"
            initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    
                    {/* LOGO */}
                    <Link to="/" className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight shrink-0">
                        ⚡ SastaHai
                    </Link>
                    
                    {/* SEARCH BAR (Flexible width) */}
                    <div className="flex-grow max-w-xl mx-2 sm:mx-4 hidden sm:block">
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                        />
                    </div>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-semibold shrink-0">
                        <Link to="/" className="hover:text-amber-400 transition">Home</Link>
                        <Link to="/cart" className="hover:text-amber-400 transition">Cart</Link>
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
                                    <span className="font-bold text-amber-400 hidden lg:block">{user.name?.split(' ')[0]}</span>
                                </Link>
                                <button onClick={logout} className="text-sm font-bold text-slate-300 hover:text-white transition cursor-pointer">Logout</button>
                            </div>
                        )}
                    </div>

                    {/* MOBILE HAMBURGER BUTTON */}
                    <div className="flex md:hidden items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white hover:text-amber-400 focus:outline-none cursor-pointer"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-800 border-t border-slate-700 overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-3">
                            {/* Mobile Search Bar */}
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 mb-2 rounded-lg bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 font-bold hover:bg-slate-700 rounded-md transition">Home</Link>
                            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 font-bold hover:bg-slate-700 rounded-md transition">Cart</Link>
                            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 font-bold hover:bg-slate-700 rounded-md transition">My Orders</Link>
                            
                            {user?.role === 'ADMIN' && (
                                <Link to="/add-product" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 font-bold text-rose-400 hover:bg-slate-700 rounded-md transition">Admin Panel</Link>
                            )}
                            
                            {!user ? (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-5 py-2 mt-4 rounded-lg bg-amber-400 text-slate-900 font-bold hover:bg-amber-300 transition">Login</Link>
                            ) : (
                                <div className="pt-4 pb-2 border-t border-slate-700 mt-2">
                                    <div className="flex items-center justify-between px-3">
                                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                                            <img 
                                                src={user.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                                alt="Profile" 
                                                className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover"
                                            />
                                            <span className="font-bold text-amber-400">{user.name}</span>
                                        </Link>
                                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-sm font-bold bg-rose-500 px-4 py-2 rounded-lg text-white hover:bg-rose-600 transition cursor-pointer">Logout</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
import { Link, NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { SearchContext } from '../context/SearchContext';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { searchQuery, setSearchQuery } = useContext(SearchContext);
    const { user, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const desktopNavStyle = ({ isActive }) =>
        isActive ? "text-indigo-400 font-semibold transition" : "text-slate-300 hover:text-white transition";

    const mobileNavStyle = ({ isActive }) =>
        `block px-3 py-2 font-medium rounded-lg transition ${isActive ? 'bg-slate-800 text-indigo-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`;

    return (
        <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Clean Professional Logo */}
                    <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-extrabold text-white text-sm shadow-sm">
                            S
                        </span>
                        <span>SastaHai</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-grow max-w-md mx-4 hidden sm:block">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            />
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <NavLink to="/" className={desktopNavStyle}>Home</NavLink>
                        <NavLink to="/cart" className={desktopNavStyle}>Cart</NavLink>
                        <NavLink to="/orders" className={desktopNavStyle}>My Orders</NavLink>

                        {user?.role === 'ADMIN' && (
                            <NavLink
                                to="/add-product"
                                className={({ isActive }) => isActive ? "text-amber-400 transition" : "text-amber-300/80 hover:text-amber-300 transition"}
                            >
                                Admin Panel
                            </NavLink>
                        )}

                        {!user ? (
                            <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition shadow-sm">
                                Sign In
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 hover:opacity-90 transition">
                                    <img
                                        src={user.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border border-indigo-500 object-cover"
                                    />
                                    <span className="text-slate-200 hidden lg:block font-medium">{user.name?.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-300 hover:text-white p-2 focus:outline-none"
                            aria-label="Toggle navigation menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-2">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 mb-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavStyle}>Home</NavLink>
                    <NavLink to="/cart" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavStyle}>Cart</NavLink>
                    <NavLink to="/orders" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavStyle}>My Orders</NavLink>

                    {user?.role === 'ADMIN' && (
                        <NavLink to="/add-product" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavStyle}>
                            Admin Panel
                        </NavLink>
                    )}

                    {!user ? (
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-4 py-2 mt-2 rounded-lg bg-indigo-600 text-white font-medium">
                            Sign In
                        </Link>
                    ) : (
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-200">
                                <img
                                    src={user.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border border-indigo-500 object-cover"
                                />
                                <span className="font-medium text-sm">{user.name}</span>
                            </Link>
                            <button
                                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                className="text-xs px-3 py-1.5 rounded bg-rose-600 text-white font-medium hover:bg-rose-500 transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
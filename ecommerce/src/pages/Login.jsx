import { motion } from 'framer-motion';
import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState(''); 
    const [password, setPassword] = useState('');
    
    // Password Visibility (Eye Button)
    const [showPassword, setShowPassword] = useState(false); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Auto-fix email spacing and capitalization
        const cleanEmail = email.trim().toLowerCase();

        if (isLogin && (!cleanEmail || !password)) return alert("⚠️ Please enter Email and Password.");
        if (!isLogin && (!name || !cleanEmail || !dob || !address || !password)) return alert("⚠️ Please fill all details including address.");

        setLoading(true);
        try {
            if (isLogin) {
                const response = await axiosClient.post('/users/login', { email: cleanEmail, password });
                if (!response.data || response.data === "") throw new Error("Invalid Credentials");

                login(response.data);

                if (location.state?.returnToCart) {
                    navigate('/cart');
                } else {
                    navigate('/');
                }
            } else {
                const response = await axiosClient.post('/users/register', { 
                    name, 
                    email: cleanEmail, 
                    dob, 
                    address, 
                    password 
                });
                if (!response.data || response.data === "") throw new Error("Registration Failed");

                alert("✅ Account Created Successfully! Please Sign In");
                setIsLogin(true);
                setPassword('');
            }
        } catch (error) {
            console.error(error);
            alert(`❌ Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="max-w-md p-8 mx-auto my-8 bg-white border border-slate-100 shadow-sm rounded-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="mb-2 text-2xl font-black text-indigo-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="mb-8 font-medium text-slate-500">{isLogin ? 'Please login to your account.' : 'Sign up to continue.'}</p>

            <form className="flex flex-col gap-5">
                {!isLogin && (
                    <>
                        <div>
                            <label className="block mb-1 text-sm font-bold text-slate-700">Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-bold text-slate-700">Date of Birth</label>
                            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-bold text-slate-700">Delivery Address</label>
                            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="2" className="w-full p-3 border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" placeholder="Enter full address" />
                        </div>
                    </>
                )}
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" placeholder="abc@gmail.com" />
                </div>
                
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-3 pr-12 border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" 
                            placeholder="••••••••" 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            )}
                        </button>
                    </div>
                </div>

                <button type="button" onClick={handleSubmit} disabled={loading} className="w-full p-3.5 mt-2 font-bold text-white shadow-md bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-slate-400 cursor-pointer">
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>
            </form>

            <p className="mt-6 text-sm font-medium text-center text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setIsLogin(!isLogin); setPassword(''); }} className="font-bold text-indigo-600 hover:underline cursor-pointer">
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
            </p>

            <div className="flex items-center my-6 text-sm font-bold text-slate-400 gap-3">
                <div className="grow h-px bg-slate-200"></div>OR<div className="grow h-px bg-slate-200"></div>
            </div>

            <div className="flex flex-col gap-3">
                <button type="button" onClick={() => window.location.href = "https://ecommerce-gjjv.onrender.com/oauth2/authorization/google"} className="flex items-center justify-center w-full p-3.5 font-bold transition bg-white border border-slate-200 shadow-sm gap-3 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer">
                    <svg viewBox="0 0 48 48" className="w-5 h-5"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg>
                    Sign in with Google
                </button>
            </div>
        </motion.div>
    );
}
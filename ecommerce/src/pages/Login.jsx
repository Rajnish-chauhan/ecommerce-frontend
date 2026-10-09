import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import axiosClient from '../api/axiosClient';
import URL_TEST from '../jsconfig';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const { login } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');

    // Flow states
    const [step, setStep] = useState(1); // 1 = Registration Details, 2 = OTP Verification
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const cleanEmail = email.trim().toLowerCase();

    const getErrorMessage = (error) => {
        const errData = error.response?.data;
        return errData?.message || (errData ? Object.values(errData)[0] : "Request failed. Please try again.");
    };

    const handleLogin = async (e) => {
        e?.preventDefault();
        if (!cleanEmail || !password) {
            return showToast("Please provide both email address and password.", "warning");
        }
        setLoading(true);
        try {
            const response = await axiosClient.post('/users/login', { email: cleanEmail, password });
            if (!response.data) throw new Error("Invalid credentials");
            login(response.data);
            showToast("Welcome back! Signed in successfully.", "success");
            navigate(location.state?.returnToCart ? '/cart' : '/');
        } catch (error) {
            showToast(getErrorMessage(error), "error");
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Pre-check email existence before generating OTP
    const handleInitiateSignup = async (e) => {
        e?.preventDefault();
        if (!name.trim()) return showToast("Full name is required.", "warning");
        if (!cleanEmail) return showToast("Email address is required.", "warning");
        if (!password || password.length < 6) {
            return showToast("Password must contain at least 6 characters.", "warning");
        }

        setLoading(true);
        try {
            // 1. Verify if account already exists
            const checkRes = await axiosClient.get(`/users/check-email?email=${encodeURIComponent(cleanEmail)}`);
            if (checkRes.data?.exists) {
                showToast("An account with this email address already exists. Please sign in instead.", "warning");
                setIsLogin(true); // Switch to sign in view
                setLoading(false);
                return;
            }

            // 2. Dispatch OTP only if email is new
            await axiosClient.post('/api/otp/send', { email: cleanEmail });
            showToast(`A verification code has been dispatched to ${cleanEmail}`, "success");
            setStep(2);
        } catch (error) {
            showToast(getErrorMessage(error) || "Unable to proceed with registration.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!cleanEmail) return;
        setResending(true);
        try {
            await axiosClient.post('/api/otp/send', { email: cleanEmail });
            showToast(`New verification code sent to ${cleanEmail}`, "success");
        } catch (error) {
            showToast("Failed to resend code. Please try again shortly.", "error");
        } finally {
            setResending(false);
        }
    };

    const handleVerifyAndRegister = async (e) => {
        e?.preventDefault();
        if (!otp.trim()) return showToast("Please enter the 6-digit OTP code.", "warning");

        setLoading(true);
        try {
            // 1. Validate OTP
            await axiosClient.post('/api/otp/verify', { email: cleanEmail, otp: otp.trim() });

            // 2. Persist new user account
            const response = await axiosClient.post('/users/register', {
                name: name.trim(),
                email: cleanEmail,
                phoneNumber: phoneNumber.trim(),
                dob: dob || null,
                address: address.trim() || null,
                password
            });

            if (!response.data) throw new Error("Registration failed.");
            showToast("Account created successfully. Please sign in with your credentials.", "success");
            setIsLogin(true);
            setStep(1);
            setPassword('');
            setOtp('');
        } catch (error) {
            showToast(getErrorMessage(error), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md p-8 mx-auto my-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {isLogin ? 'Sign In to SastaHai' : 'Create Your Account'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    {isLogin ? 'Enter your registered details to continue.' : 'Fill in the information below to register.'}
                </p>
            </div>

            {isLogin ? (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-slate-400 cursor-pointer transition shadow-sm"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            ) : (
                <div className="flex flex-col gap-4">
                    {step === 1 && (
                        <form onSubmit={handleInitiateSignup} className="flex flex-col gap-3.5">
                            <div>
                                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Full Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Email Address *</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Contact Number</label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                                    placeholder="+91 9876543210"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Set Password (Required) *</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                                        placeholder="Min. 6 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Delivery Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                                        placeholder="City, State"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-slate-400 cursor-pointer transition shadow-sm"
                            >
                                {loading ? 'Checking Availability...' : 'Proceed to Verification'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyAndRegister} className="flex flex-col gap-4">
                            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-900 leading-relaxed">
                                Enter the 6-digit OTP code sent to <strong>{cleanEmail}</strong> to verify your account.
                            </div>

                            <div>
                                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-700">Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                    className="w-full px-3.5 py-3 text-center text-2xl font-bold tracking-widest border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                                    placeholder="000000"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 disabled:bg-slate-400 cursor-pointer transition shadow-sm"
                            >
                                {loading ? 'Verifying...' : 'Verify & Complete Registration'}
                            </button>

                            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="hover:text-slate-800 cursor-pointer transition"
                                >
                                    ← Edit details
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resending}
                                    className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer disabled:text-slate-400 transition"
                                >
                                    {resending ? 'Sending...' : 'Resend Code'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            <div className="mt-6 text-sm text-center text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                    onClick={() => { setIsLogin(!isLogin); setStep(1); setPassword(''); setOtp(''); }}
                    className="font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
            </div>

            <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative px-3 text-xs uppercase bg-white text-slate-400 font-semibold tracking-wider">Or</span>
            </div>

            <button
                type="button"
                onClick={() => window.location.href = `${URL_TEST}/oauth2/authorization/google`}
                className="flex items-center justify-center w-full py-2.5 px-4 text-sm font-semibold transition bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 shadow-sm gap-3 cursor-pointer"
            >
                <svg viewBox="0 0 48 48" className="w-4 h-4">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Continue with Google
            </button>
        </div>
    );
}
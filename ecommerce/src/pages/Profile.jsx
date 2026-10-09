import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import axiosClient from '../api/axiosClient';

export default function Profile() {
    const { user, updateUser, logout } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Profile Details
    const [name, setName] = useState(user?.name || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [dob, setDob] = useState(user?.dob || '');
    const [address, setAddress] = useState(user?.address || '');
    const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || '');

    // Password Update Fields
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Account Deletion Confirmation State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);

    // Handle local image file upload & conversion to Base64
    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limit file size to 2MB
        if (file.size > 2 * 1024 * 1024) {
            return showToast("Selected image must be under 2MB in size.", "warning");
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImageUrl(reader.result);
            showToast("Photo selected. Click 'Save Profile Details' to update.", "info");
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async (e) => {
        e?.preventDefault();

        if (isChangingPassword) {
            if (!currentPassword) {
                return showToast("Please enter your current password.", "warning");
            }
            if (!newPassword || newPassword.length < 6) {
                return showToast("New password must be at least 6 characters.", "warning");
            }
            if (newPassword !== confirmPassword) {
                return showToast("New password and confirm password do not match.", "warning");
            }
        }

        setLoading(true);
        try {
            const payload = {
                name: name.trim(),
                phoneNumber: phoneNumber.trim(),
                dob: dob || null,
                address: address.trim(),
                profileImageUrl,
                ...(isChangingPassword ? { currentPassword, newPassword } : {})
            };

            const res = await axiosClient.put(`/users/update/${user.id}`, payload);
            updateUser(res.data);
            showToast("Profile details updated successfully.", "success");

            if (isChangingPassword) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setIsChangingPassword(false);
            }
        } catch (error) {
            const errData = error.response?.data;
            const errMsg = errData?.message || (errData ? Object.values(errData)[0] : "Failed to update profile.");
            showToast(errMsg, "error");
        } finally {
            setLoading(false);
        }
    };

    // Permanently delete user account and redirect to Home
    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            await axiosClient.delete(`/users/delete/${user.id}`);
            showToast("Your account has been permanently deleted.", "success");
            logout();
            navigate('/');
        } catch (error) {
            const errData = error.response?.data;
            showToast(errData?.message || "Failed to delete account. Please try again.", "error");
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="max-w-2xl p-8 mx-auto my-10 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {/* Header with Photo Upload Overlay */}
            <div className="flex items-center gap-5 pb-6 mb-8 border-b border-slate-100">
                <div className="relative group">
                    <img
                        src={profileImageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-2 border-indigo-500 object-cover shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-full text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Change Profile Photo"
                    >
                        Change
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                    <p className="text-sm text-slate-500">Manage your contact information and security settings</p>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                        Upload Photo
                    </button>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                {/* Email Address (Read-only) */}
                <div>
                    <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">Email Address</label>
                    <input
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                        value={user?.email || ''}
                        disabled
                    />
                </div>

                {/* Full Name & Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">Contact / Phone Number</label>
                        <input
                            type="tel"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                            placeholder="+91 9876543210"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </div>
                </div>

                {/* Date of Birth & Delivery Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Date of Birth {dob && <span className="text-slate-400 font-normal lowercase">({dob})</span>}
                        </label>
                        <input
                            type="date"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                            value={dob || ''}
                            onChange={e => setDob(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">Delivery Address</label>
                        <textarea
                            rows="2"
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition"
                            placeholder="Complete street address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                {/* Security / Password Section */}
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-slate-800">Security & Password</span>
                        <button
                            type="button"
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                        >
                            {isChangingPassword ? 'Cancel Password Change' : 'Change Password'}
                        </button>
                    </div>

                    {isChangingPassword && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <div>
                                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">Current Password *</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full px-3.5 py-2 pr-10 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:border-indigo-600 transition"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showCurrentPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">New Password *</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Min. 6 characters"
                                            className="w-full px-3.5 py-2 pr-10 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:border-indigo-600 transition"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                                        >
                                            {showNewPassword ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">Confirm New Password *</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:border-indigo-600 transition"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-slate-400 cursor-pointer transition shadow-sm"
                >
                    {loading ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
            </form>

            {/* Danger Zone: Account Deletion */}
            <div className="mt-10 pt-6 border-t border-rose-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-rose-200 bg-rose-50/50">
                    <div>
                        <h4 className="text-sm font-bold text-rose-900">Delete Account</h4>
                        <p className="text-xs text-rose-700 mt-0.5">
                            Permanently delete your profile and account data. This action is irreversible.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition cursor-pointer shrink-0"
                    >
                        Delete My Account
                    </button>
                </div>
            </div>

            {/* Account Deletion Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-xl border border-slate-200 animate-slide-up">
                        <div className="flex items-center gap-3 text-rose-600 mb-3">
                            <span className="p-2 rounded-lg bg-rose-100">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </span>
                            <h3 className="text-lg font-bold text-slate-900">Confirm Account Deletion</h3>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            Are you sure you want to permanently delete your account? All your personal details and order history will be removed. This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition cursor-pointer"
                            >
                                {deleting ? 'Deleting Account...' : 'Yes, Delete My Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
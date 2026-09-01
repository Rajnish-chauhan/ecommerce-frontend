import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function Profile() {
    const { user, updateUser } = useContext(AuthContext);
    
    const [name, setName] = useState(user?.name || '');
    const [dob, setDob] = useState(user?.dob || '');
    const [address, setAddress] = useState(user?.address || '');
    const [password, setPassword] = useState(user?.password || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.put(`/users/update/${user.id}`, { 
                name, 
                dob, 
                address, 
                password 
            });
            updateUser(res.data);
            alert("✅ Profile Details Updated Successfully!");
        } catch (err) {
            console.error(err);
            alert("❌ Profile update failed. Retry");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-8 mt-8 bg-white border border-slate-100 shadow-sm rounded-2xl">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                <img src={user?.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Profile" className="w-16 h-16 rounded-full border-4 border-indigo-100 object-cover" />
                <h2 className="text-2xl font-black text-slate-800">My Profile</h2>
            </div>
            
            <div className="flex flex-col gap-5">
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Email Address (Locked 🔒)</label>
                    <input className="w-full p-3 border border-slate-200 outline-none rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed" value={user?.email || ''} disabled />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Full Name</label>
                    <input className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Date of Birth</label>
                    <input type="date" className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" value={dob} onChange={e => setDob(e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Delivery Address</label>
                    <textarea className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" rows="3" placeholder="Enter your full address" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Password</label>
                    <input type="password" className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                
                <button onClick={handleUpdate} disabled={loading} className="w-full p-4 mt-2 font-bold text-white transition shadow-md bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-slate-400 cursor-pointer">
                    {loading ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
            </div>
        </div>
    );
}
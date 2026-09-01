import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function AdminAddProduct() {
    const { user } = useContext(AuthContext); 
    const [product, setProduct] = useState({ 
        name: '', 
        description: '', 
        price: '', 
        stock: '', 
        category: '', 
        imageUrl: '' 
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage('');

        try {
            // 🔥 Backend verification ke liye 'X-User-Id' header bhej rahe hain
            await axiosClient.post('/products/add', product, {
                headers: {
                    'X-User-Id': user?.id || '' 
                }
            });
            
            setMessage(`✅ Product successfully added!`);
            // Form clear karne ke liye
            setProduct({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "❌ Failed to add product. Check admin permissions.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl p-8 mx-auto mt-8 bg-white border border-slate-100 shadow-sm rounded-2xl">
            <h2 className="pb-4 mb-6 text-2xl font-black border-b text-indigo-900">Add New Product (Admin)</h2>
            
            {message && (
                <div className={`p-4 mb-6 rounded-xl font-bold ${message.includes('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Product Name</label>
                    <input 
                        type="text" 
                        value={product.name} 
                        onChange={(e)=>setProduct({...product, name: e.target.value})} 
                        className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" 
                        required 
                    />
                </div>
                
                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Description</label>
                    <textarea 
                        value={product.description} 
                        onChange={(e)=>setProduct({...product, description: e.target.value})} 
                        className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" 
                        rows="3" 
                        required 
                    />
                </div>
                
                <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-bold text-slate-700">Price (₹)</label>
                        <input 
                            type="number" 
                            value={product.price} 
                            onChange={(e)=>setProduct({...product, price: e.target.value})} 
                            className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" 
                            required 
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-bold text-slate-700">Stock Quantity</label>
                        <input 
                            type="number" 
                            value={product.stock} 
                            onChange={(e)=>setProduct({...product, stock: e.target.value})} 
                            className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" 
                            required 
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Category</label>
                    <select 
                        value={product.category} 
                        onChange={(e)=>setProduct({...product, category: e.target.value})} 
                        className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" 
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Cloth">Cloth</option>
                        <option value="Grocery">Grocery</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-bold text-slate-700">Image URL</label>
                    <input 
                        type="url" 
                        value={product.imageUrl} 
                        onChange={(e)=>setProduct({...product, imageUrl: e.target.value})} 
                        className="w-full p-3 transition border border-slate-200 outline-none rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" 
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full p-4 mt-4 font-bold text-white transition shadow-md cursor-pointer bg-indigo-900 rounded-xl hover:bg-indigo-800 disabled:bg-slate-400"
                >
                    {loading ? 'Saving to MongoDB...' : '+ Insert Product'}
                </button>
            </form>
        </div>
    );
}
import { useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!user || !user?.id) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await axiosClient.get(`/orders/user/${user.id}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto">
            <motion.h2 className="pb-4 mb-8 text-3xl font-black border-b text-slate-800" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                My Order History
            </motion.h2>

            {loading ? (
                <p className="font-medium text-center text-slate-500">Loading your orders...</p>
            ) : orders.length === 0 ? (
                <motion.div className="py-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-lg font-medium text-slate-500">You haven't placed any orders yet. 🛒</p>
                </motion.div>
            ) : (
                <motion.div className="flex flex-col gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {orders.map((order) => (
                        <div key={order.id} className="flex flex-col items-start justify-between p-6 transition bg-white border border-slate-100 shadow-sm sm:flex-row sm:items-center rounded-2xl hover:shadow-md gap-4">
                            <div>
                                <h3 className="mb-1 text-lg font-bold text-indigo-900">Order #{String(order.id).substring(0, 8)}...</h3>
                                <p className="text-sm font-medium text-slate-600">Items: {order.orderItems?.length || 0} product(s)</p>
                                <p className="text-sm font-medium text-slate-600">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex flex-col items-start w-full mt-2 sm:items-end sm:w-auto sm:mt-0">
                                <span className="px-3 py-1 mb-2 text-xs font-bold tracking-wider uppercase rounded-full bg-emerald-100 text-emerald-800">
                                    {order.status || 'Success'}
                                </span>
                                <p className="text-xl font-black text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
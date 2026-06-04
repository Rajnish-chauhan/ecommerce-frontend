import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { SearchContext } from '../context/SearchContext';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const { cart, addToCart, decreaseQuantity, clearCart, totalAmount } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { searchQuery } = useContext(SearchContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const filteredCart = cart.filter(item =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (cart.length === 0) return;

        // 1. Check if user is logged in
        if (!user) {
            navigate('/login', { state: { returnToCart: true } });
            return;
        }

        // 🔥 2. NAYA CHECK: ADDRESS VALIDATION 🔥
        if (!user.address || user.address.trim() === "") {
            alert("⚠️ Please set address to place your Order");
            navigate('/profile'); // User ko seedha Profile page par bhej do
            return;
        }

        setLoading(true);
        try {
            const res = await loadRazorpayScript();
            if (!res) {
                alert("❌plz check internet connection");
                setLoading(false);
                return;
            }

            // Create order on your Spring Boot backend
            const { data: orderResponse } = await axiosClient.post('/api/payment/create-order', { amount: totalAmount });

            let razorpayOrderId = "";
            try {
                const parsed = typeof orderResponse === 'string' ? JSON.parse(orderResponse) : orderResponse;
                razorpayOrderId = parsed.id || parsed.get?.("id");
            } catch (e) {
                console.log("Could not found order ID.", e);
            }

            const options = {
                key: "rzp_test_Swr8QaHErZUT7f",
                amount: totalAmount * 100,
                currency: "INR",
                name: "SastaHai",
                description: "Purchase from SastaHai",
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        // 1. Check what Razorpay sent back
                        console.log("Razorpay Success Response:", response);

                        const productQuantities = {};
                        cart.forEach(item => { productQuantities[item.product.id] = item.quantity; });

                        // 2. Send the Razorpay verification details to your backend
                        await axiosClient.post(`/orders/place/${user.id}`, {
                            productQuantities,
                            totalAmount,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // 3. This will now run if the backend responds with a success status (200 OK)
                        alert(`✅ Order successfully placed`);
                        clearCart();
                        navigate('/orders');
                    } catch (err) {
                        // 4. Log the actual error so you can see why it failed
                        console.error("Order API Error:", err.response?.data || err.message);
                        alert("❌ Payment received, but failed to save order on server.");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: { color: "#1e1b4b" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                alert("❌ Payment failed: " + response.error.description);
            });
            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert("❌ error in creating payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="max-w-4xl p-6 mx-auto bg-white border border-slate-100 shadow-sm rounded-2xl md:p-10" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <h2 className="pb-4 mb-8 text-3xl font-black border-b border-slate-100 text-slate-800">Your Cart</h2>

            {cart.length === 0 ? (
                <p className="py-10 font-medium text-center text-slate-500">Cart Empty</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {filteredCart.map((item) => (
                        <div key={item.product.id} className="flex flex-col items-center justify-between p-4 border border-slate-100 gap-4 sm:flex-row rounded-xl bg-slate-50/50">
                            <div className="grow text-center sm:text-left">
                                <h3 className="text-lg font-bold text-slate-800">{item.product.name}</h3>
                                <p className="font-bold text-indigo-600">₹{item.product.price.toLocaleString('en-IN')}</p>
                            </div>

                            <div className="flex items-center p-2 bg-white border border-slate-200 shadow-sm gap-3 rounded-lg shrink-0">
                                <button onClick={() => decreaseQuantity(item.product.id)} className="flex items-center justify-center w-8 h-8 font-bold rounded bg-slate-50 text-indigo-600 shadow-sm">-</button>
                                <span className="w-6 font-bold text-center text-slate-800">{item.quantity}</span>
                                <button onClick={() => addToCart(item.product)} className="flex items-center justify-center w-8 h-8 font-bold rounded bg-slate-50 text-indigo-600 shadow-sm">+</button>
                            </div>

                            <div className="w-full text-center shrink-0 sm:w-32 sm:text-right">
                                <p className="text-xl font-black text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col items-center pt-6 mt-8 border-t border-slate-100 sm:items-end gap-6">
                        <div className="text-2xl font-black text-slate-800">
                            Total to Pay: <span className="text-indigo-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading || cart.length === 0}
                            className="flex items-center justify-center w-full px-12 py-4 text-lg font-bold text-white bg-rose-500 sm:w-auto rounded-xl hover:bg-rose-600 disabled:bg-slate-400 cursor-pointer"
                        >
                            {loading ? 'Secure payment open ho raha hai...' : 'Buy Now'}
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
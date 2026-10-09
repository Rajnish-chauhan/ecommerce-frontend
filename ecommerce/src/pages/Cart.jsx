import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { SearchContext } from '../context/SearchContext';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const { cart, addToCart, decreaseQuantity, clearCart, totalAmount } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const { searchQuery } = useContext(SearchContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const filteredCart = cart.filter(item =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Dynamically inject Razorpay SDK script if not already loaded
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Pre-checkout authentication and address verification
    const handleCheckout = () => {
        if (cart.length === 0) return;

        if (!user) {
            showToast("Please sign in to proceed with checkout.", "info");
            navigate('/login', { state: { returnToCart: true } });
            return;
        }

        if (!user?.address || user?.address.trim() === "") {
            showToast("Please provide a shipping address in your profile before ordering.", "warning");
            navigate('/profile');
            return;
        }

        handlePayment();
    };

    // Process payment through Razorpay gateway
    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await loadRazorpayScript();
            if (!res) {
                showToast("Payment gateway could not be loaded. Please check your network connection.", "error");
                setLoading(false);
                return;
            }

            // 1. Create order on the backend
            const { data: orderResponse } = await axiosClient.post('/api/payment/create-order', { amount: totalAmount });
            const razorpayOrderId = orderResponse?.id;

            if (!razorpayOrderId) {
                showToast("Failed to generate a valid order identifier from the server.", "error");
                setLoading(false);
                return;
            }

            // 2. Configure payment options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: Math.round(totalAmount * 100), // Currency unit in paise
                currency: "INR",
                name: "SastaHai",
                description: "Order Checkout Payment",
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        const productQuantities = {};
                        cart.forEach(item => { productQuantities[item.product.id] = item.quantity; });

                        // 3. Persist order upon payment completion
                        await axiosClient.post(`/orders/place/${user.id}`, {
                            productQuantities,
                            totalAmount,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        showToast("Payment successful! Your order has been placed.", "success");
                        clearCart();
                        navigate('/orders');
                    } catch (err) {
                        console.error("Order fulfillment error:", err.response?.data || err.message);
                        showToast("Payment completed, but order saving encountered an issue. Please contact support.", "error");
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phoneNumber || ""
                },
                theme: { color: "#4f46e5" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                showToast(`Payment declined: ${response.error.description}`, "error");
            });
            paymentObject.open();

        } catch (error) {
            console.error("Payment initiation error:", error);
            showToast("An error occurred during payment processing.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl p-6 mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm md:p-8 my-8">
            <h2 className="pb-4 mb-6 text-2xl font-bold border-b border-slate-100 text-slate-900">
                Shopping Cart
            </h2>

            {cart.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-slate-500 font-medium">Your cart is currently empty.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredCart.map((item) => (
                        <div key={item.product.id} className="flex flex-col items-center justify-between p-4 border border-slate-100 gap-4 sm:flex-row rounded-xl bg-slate-50/60">
                            <div className="grow text-center sm:text-left">
                                <h3 className="text-base font-semibold text-slate-800">{item.product.name}</h3>
                                <p className="text-sm font-bold text-slate-900 mt-1">₹{item.product.price.toLocaleString('en-IN')}</p>
                            </div>

                            <div className="flex items-center p-1 bg-white border border-slate-200 rounded-lg shrink-0 shadow-sm gap-2">
                                <button
                                    onClick={() => decreaseQuantity(item.product.id)}
                                    className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 rounded hover:bg-slate-100 transition"
                                >
                                    −
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                                <button
                                    onClick={() => addToCart(item.product)}
                                    className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 rounded hover:bg-slate-100 transition"
                                >
                                    +
                                </button>
                            </div>

                            <div className="w-full text-center shrink-0 sm:w-32 sm:text-right">
                                <p className="text-base font-bold text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col items-center pt-6 mt-6 border-t border-slate-100 sm:items-end gap-4">
                        <div className="text-lg font-bold text-slate-800">
                            Total Payable: <span className="text-indigo-600 text-xl font-extrabold ml-1">₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading || cart.length === 0}
                            className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-slate-400 transition shadow-sm"
                        >
                            {loading ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
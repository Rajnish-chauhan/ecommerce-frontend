import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const { cart, addToCart, decreaseQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    const safePrice = Number(product?.price) || 0;
    const cartItem = cart.find(item => item.product?.id === product?.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    const handleBuyNow = () => {
        if (currentQuantity === 0) {
            addToCart(product);
        }
        navigate('/cart'); // Direct redirect, no alert
    };

    return (
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="relative flex items-center justify-center h-48 p-4 bg-slate-50 overflow-hidden">
                <img 
                    src={product?.imageUrl || "https://via.placeholder.com/300"} 
                    alt={product?.name} 
                    className="object-contain max-h-full transition-transform duration-500 group-hover:scale-105" 
                />
                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-indigo-700 uppercase bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                    {product?.category || "General"}
                </span>
            </div>
            
            <div className="flex flex-col flex-grow p-5 justify-between">
                <div>
                    <h2 className="mb-2 text-lg font-bold text-slate-800 leading-tight line-clamp-2">{product?.name}</h2>
                    <p className="mb-4 text-2xl font-black text-indigo-600">₹{safePrice.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex flex-col mt-auto gap-3">
                    {currentQuantity === 0 ? (
                        <button onClick={() => addToCart(product)} className="w-full py-2.5 font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition">
                            🛒 Add to Cart
                        </button>
                    ) : (
                        <div className="flex items-center justify-between p-1.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                            <button onClick={() => decreaseQuantity(product.id)} className="flex items-center justify-center w-10 h-10 text-xl font-bold text-indigo-600 bg-white rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white transition">-</button>
                            <span className="font-bold text-indigo-900">{currentQuantity} in cart</span>
                            <button onClick={() => addToCart(product)} className="flex items-center justify-center w-10 h-10 text-xl font-bold text-indigo-600 bg-white rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white transition">+</button>
                        </div>
                    )}

                    <button onClick={handleBuyNow} className="flex items-center justify-center w-full gap-2 py-2.5 font-bold text-white bg-rose-500 rounded-xl shadow-md hover:bg-rose-600 transition">
                        ⚡ Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
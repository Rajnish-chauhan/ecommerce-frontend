import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const { cart, addToCart, decreaseQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    const safePrice = Number(product?.price) || 0;
    const cartItem = cart.find(item => item.product?.id === product?.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    
    // Check if product is out of stock completely
    const isOutOfStock = product?.stock <= 0;

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        if (currentQuantity === 0) {
            addToCart(product);
        }
        navigate('/cart');
    };

    return (
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="relative flex items-center justify-center h-48 p-4 bg-slate-50 overflow-hidden">
                <img 
                    src={product?.imageUrl || "https://via.placeholder.com/300"} 
                    alt={product?.name} 
                    className={`object-contain max-h-full transition-transform duration-500 ${isOutOfStock ? 'opacity-50 grayscale' : 'group-hover:scale-105'}`} 
                />
                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-indigo-700 uppercase bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                    {product?.category || "General"}
                </span>
                
                {/*  Out of Stock Badge on Image  */}
                {isOutOfStock && (
                    <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold text-white uppercase bg-rose-500 rounded-full shadow-sm">
                        Sold Out
                    </span>
                )}
            </div>
            
            <div className="flex flex-col flex-grow p-5 justify-between">
                <div>
                    <h2 className={`mb-2 text-lg font-bold leading-tight line-clamp-2 ${isOutOfStock ? 'text-slate-400' : 'text-slate-800'}`}>
                        {product?.name}
                    </h2>
                    <p className={`mb-4 text-2xl font-black ${isOutOfStock ? 'text-slate-400' : 'text-indigo-600'}`}>
                        ₹{safePrice.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm font-semibold text-emerald-600 mb-2">
                        {isOutOfStock ? '' : `Available Stock: ${product?.stock}`}
                    </p>
                </div>
                
                <div className="flex flex-col mt-auto gap-3">
                    {isOutOfStock ? (
                        //  Out of Stock Button State 
                        <button disabled className="w-full py-2.5 font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed">
                            🚫 Out of Stock
                        </button>
                    ) : (
                        <>
                            {currentQuantity === 0 ? (
                                <button onClick={() => addToCart(product)} className="w-full py-2.5 font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition cursor-pointer">
                                    🛒 Add to Cart
                                </button>
                            ) : (
                                <div className="flex items-center justify-between p-1.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                                    <button onClick={() => decreaseQuantity(product.id)} className="flex items-center justify-center w-10 h-10 text-xl font-bold text-indigo-600 bg-white rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white transition cursor-pointer">-</button>
                                    <span className="font-bold text-indigo-900">{currentQuantity} in cart</span>
                                    <button onClick={() => addToCart(product)} className="flex items-center justify-center w-10 h-10 text-xl font-bold text-indigo-600 bg-white rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white transition cursor-pointer">+</button>
                                </div>
                            )}

                            <button onClick={handleBuyNow} className="flex items-center justify-center w-full gap-2 py-2.5 font-bold text-white bg-rose-500 rounded-xl shadow-md hover:bg-rose-600 transition cursor-pointer">
                                ⚡ Buy Now
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
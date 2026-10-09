import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const { cart, addToCart, decreaseQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    const safePrice = Number(product?.price) || 0;
    const cartItem = cart.find(item => item.product?.id === product?.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    const isOutOfStock = product?.stock <= 0;

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        if (currentQuantity === 0) {
            addToCart(product);
        }
        navigate('/cart');
    };

    return (
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative flex items-center justify-center h-48 p-4 bg-slate-50">
                <img
                    src={product?.imageUrl || "https://via.placeholder.com/300"}
                    alt={product?.name}
                    className={`object-contain max-h-full transition-opacity ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 text-xs font-semibold text-slate-700 uppercase bg-white/90 border border-slate-200 rounded-md">
                    {product?.category || "General"}
                </span>

                {isOutOfStock && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 text-xs font-semibold text-rose-700 uppercase bg-rose-50 border border-rose-200 rounded-md">
                        Sold Out
                    </span>
                )}
            </div>

            <div className="flex flex-col flex-grow p-4 justify-between">
                <div>
                    <h3 className={`font-semibold text-base leading-snug line-clamp-2 ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>
                        {product?.name}
                    </h3>
                    <p className={`mt-2 text-xl font-bold ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>
                        ₹{safePrice.toLocaleString('en-IN')}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                        {isOutOfStock ? 'Currently unavailable' : `Stock: ${product?.stock} units`}
                    </p>
                </div>

                <div className="flex flex-col mt-4 gap-2">
                    {isOutOfStock ? (
                        <button disabled className="w-full py-2 text-sm font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed">
                            Out of Stock
                        </button>
                    ) : (
                        <>
                            {currentQuantity === 0 ? (
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
                                >
                                    Add to Cart
                                </button>
                            ) : (
                                <div className="flex items-center justify-between p-1 bg-indigo-50 border border-indigo-200 rounded-lg">
                                    <button
                                        onClick={() => decreaseQuantity(product.id)}
                                        className="w-8 h-8 flex items-center justify-center font-bold text-indigo-700 bg-white rounded border border-indigo-100 shadow-sm hover:bg-indigo-50"
                                    >
                                        −
                                    </button>
                                    <span className="text-sm font-semibold text-indigo-900">
                                        {currentQuantity} in cart
                                    </span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-8 h-8 flex items-center justify-center font-bold text-indigo-700 bg-white rounded border border-indigo-100 shadow-sm hover:bg-indigo-50"
                                    >
                                        +
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleBuyNow}
                                className="w-full py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition"
                            >
                                Buy Now
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
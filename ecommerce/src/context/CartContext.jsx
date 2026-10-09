import { createContext, useState, useContext } from 'react';
import { ToastContext } from './ToastContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    
    // Safely retrieve toast notification handler
    const toastContext = useContext(ToastContext);
    const showToast = toastContext?.showToast || ((msg) => console.log(msg));

    const addToCart = (product) => {
        const existing = cart.find(item => item.product.id === product.id);

        if (existing) {
            if (existing.quantity >= product.stock) {
                showToast(`Limit reached: Only ${product.stock} units available in stock.`, 'warning');
                return;
            }
            setCart(prev => prev.map(item =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            if (product.stock <= 0) {
                showToast('This item is currently out of stock.', 'error');
                return;
            }
            setCart(prev => [...prev, { product, quantity: 1 }]);
        }

        // Notification called outside of state setter to prevent double trigger in React StrictMode
        showToast(`${product.name} added to cart.`, 'success');
    };

    const decreaseQuantity = (productId) => {
        setCart((prev) => {
            const existing = prev.find(item => item.product.id === productId);
            if (!existing) return prev;
            if (existing.quantity === 1) {
                return prev.filter(item => item.product.id !== productId);
            }
            return prev.map(item =>
                item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            );
        });
    };

    const clearCart = () => setCart([]);

    const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, clearCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};
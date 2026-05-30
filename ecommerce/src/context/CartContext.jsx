import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    // NEW: Decrease quantity or remove if it hits 0
    const decreaseQuantity = (productId) => {
        setCart((prev) => {
            const existing = prev.find(item => item.product.id === productId);
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
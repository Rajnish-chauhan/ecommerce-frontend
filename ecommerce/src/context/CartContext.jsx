import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find(item => item.product.id === product.id);
            
            //Check if adding exceeds available stock
            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert(`⚠️ Limit reached! Is product ka sirf ${product.stock} stock hi bacha hai.`);
                    return prev; // Do not increase quantity
                }
                return prev.map(item => 
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            if (product.stock <= 0) {
                alert("⚠️ Yeh product out of stock hai!");
                return prev;
            }

            return [...prev, { product, quantity: 1 }];
        });
    };

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
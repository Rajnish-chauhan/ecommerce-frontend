import { useEffect, useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { SearchContext } from '../context/SearchContext';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All'); // 🔥 Category State
    const { searchQuery } = useContext(SearchContext);
    const { login } = useContext(AuthContext);

    // Ye categories aapke backend DB se match karti hain
    const categories = ['All', 'Electronics', 'Cloth', 'Grocery'];

    useEffect(() => {
        // Catch Google Redirect Parameter
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        
        if (emailParam) {
            axiosClient.get(`/users/get-by-email?email=${emailParam}`)
                .then(res => {
                    if(res.data) {
                        login(res.data);
                        window.history.replaceState(null, '', '/'); // Clean URL
                    }
                })
                .catch(err => console.error("Google Login Catch Failed:", err));
        }

        // Fetch Default Products
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, [login]);

// 🔥 SAFE FILTER LOGIC 🔥
    const filteredProducts = products.filter(product => {
        const safeName = product?.name || ""; 
        const safeQuery = searchQuery || "";
        const safeCategory = product?.category || "General";

        const matchesSearch = safeName.toLowerCase().includes(safeQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || safeCategory === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

    return (
        <div>
            <motion.h1 className="mb-6 text-3xl font-black text-center text-slate-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Latest Products
            </motion.h1>

            {/* 🔥 CATEGORY FILTER BUTTONS 🔥 */}
            <motion.div 
                className="flex flex-wrap justify-center gap-3 mb-10"
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 text-sm font-bold rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
                            selectedCategory === category 
                            ? 'bg-indigo-600 text-white shadow-indigo-200' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </motion.div>

            <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" variants={containerVariants} initial="hidden" animate="show">
                {filteredProducts.length === 0 ? (
                    <p className="py-10 font-medium text-center text-slate-500 col-span-full">
                        "{searchQuery}" product not found
                    </p>
                ) : (
                    filteredProducts.map((product) => (
                        <motion.div key={product.id} variants={itemVariants} className="h-full">
                            <ProductCard product={product} />
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
}
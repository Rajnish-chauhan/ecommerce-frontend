import { useEffect, useState, useContext } from 'react';
import axiosClient from '../api/axiosClient.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { SearchContext } from '../context/SearchContext.jsx';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All'); 
    const [loading, setLoading] = useState(true);
    const { searchQuery } = useContext(SearchContext);
    
    const categories = ['All', 'Electronics', 'Cloth', 'Grocery'];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get('/products/all');
                // Ensure state only receives a valid array
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    console.warn("Backend response is not an array:", response.data);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Safe filtering that never throws 'filter is not a function'
    const safeProducts = Array.isArray(products) ? products : [];
    const filteredProducts = safeProducts.filter(product => {
        const safeName = product?.name || ""; 
        const safeQuery = searchQuery || "";
        const safeCategory = product?.category || "General";

        const matchesSearch = safeName.toLowerCase().includes(safeQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || safeCategory === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <h1 className="mb-6 text-3xl font-black text-center text-slate-900">
                Latest Products
            </h1>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
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
            </div>

            {loading ? (
                <div className="py-16 text-center text-slate-500 font-semibold">
                    Loading products from store...
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredProducts.length === 0 ? (
                        <p className="py-10 font-medium text-center text-slate-500 col-span-full">
                            {searchQuery ? `"${searchQuery}" product not found` : "No products available currently."}
                        </p>
                    ) : (
                        filteredProducts.map((product) => (
                            <div key={product.id || product._id} className="h-full">
                                <ProductCard product={product} />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
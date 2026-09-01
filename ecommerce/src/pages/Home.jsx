import { useEffect, useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import { SearchContext } from '../context/SearchContext';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All'); 
    const { searchQuery } = useContext(SearchContext);
    const { login } = useContext(AuthContext);

    // backend DB se match 
    const categories = ['All', 'Electronics', 'Cloth', 'Grocery'];

    useEffect(() => {
        // Catch Google Redirect Parameter
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        
        if (emailParam) {
            // FIX 1: URL path ko '/users/by-email' kar diya (backend ke hisaab se)
            axiosClient.get(`/users/by-email?email=${emailParam}`)
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
                // FIX 2: Path ko '/products' se badal kar '/products/all' kar diya
                const response = await axiosClient.get('/products/all');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, [login]);

    // SAFE FILTER LOGIC
    const filteredProducts = products.filter(product => {
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

            {/* CATEGORY FILTER BUTTONS  */}
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

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.length === 0 ? (
                    <p className="py-10 font-medium text-center text-slate-500 col-span-full">
                        "{searchQuery}" product not found
                    </p>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="h-full">
                            <ProductCard product={product} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
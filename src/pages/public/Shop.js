import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Shop() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products')) || [];
    setTimeout(() => {
      setProducts(stored);
      setLoading(false);
    }, 800); // Optional simulated delay
  }, []);

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...existingCart, { ...product, quantity: 1 }];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  };

  const handleProtectedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      alert('You must be logged in to access this.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-white">
      {/* 🌌 Fullscreen Gradient Background */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      />

      {/* 🎨 Optional Decorative Overlays */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-5 z-0" />
      <div className="absolute top-10 left-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000 z-0" />

      {/* 💎 Foreground Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="glass-card-gradient text-center max-w-3xl w-full p-10 rounded-xl shadow-lg backdrop-blur-md bg-white/5 border border-white/10 animate-fadeIn">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 gradient-text fade-in">
            Mobile Shop
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">
                No products available.
              </p>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="card-neon text-center hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 w-full object-contain mb-4 rounded"
                  />
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-lg text-green-700 mt-1">{product.price}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary mt-4 w-full"
                  >
                    ➕ Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleProtectedNavigation('/checkout')}
              className="btn-primary flex items-center gap-2 mt-6"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;

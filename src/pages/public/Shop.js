// src/pages/public/Shop.js
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function Shop() {
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

    // Replace with toast if available
    alert(`${product.name} added to cart!`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-100 to-pink-100 text-black p-6 fade-in">
      <h2 className="text-3xl font-extrabold text-center mb-6 gradient-text">
        🛒 Mobile Shop
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
    </div>
  );
}

export default Shop;

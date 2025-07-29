import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion } from 'framer-motion';

function Wishlist() {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    const userWishlistKey = `wishlist_${currentUser.email}`;
    const stored = JSON.parse(localStorage.getItem(userWishlistKey)) || [];
    setWishlistItems(stored);
  }, [currentUser]);

  const handleRemove = (id) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(updated));
  };

  const handleMoveToCart = (item) => {
    const userCartKey = `cart_${currentUser.email}`;
    const existingCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    const existingItem = existingCart.find((p) => p.id === item.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = existingCart.map((p) =>
        p.id === item.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
      );
    } else {
      updatedCart = [...existingCart, { ...item, quantity: 1 }];
    }

    localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
    handleRemove(item.id);
    alert(`${item.name} moved to cart!`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
        <h2 className="text-3xl font-bold text-red-400">Please log in to view your wishlist</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-4 text-pink-400"
        >
          My Wishlist
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Keep track of all your favorite products. Move them to your cart anytime or manage your saved items below.
        </p>
      </section>

      {/* Wishlist Items */}
      <div className="flex-1 p-8">
        {wishlistItems.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            Your wishlist is empty.{' '}
            <span
              className="text-cyan-400 cursor-pointer hover:underline"
              onClick={() => navigate('/shop')}
            >
              Go shopping
            </span>.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-pink-500 hover:shadow-pink-400/50 transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 object-contain mx-auto mb-4 rounded bg-gray-700 p-2"
                  />
                  <h3 className="text-xl font-semibold text-center">{item.name}</h3>
                  <p className="text-pink-300 text-center text-lg font-bold">{item.price}</p>

                  <div className="flex flex-col mt-4 space-y-3">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="py-2 btn-wishlist w-full"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="btn-wishlist w-full bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-400 hover:via-pink-400 hover:to-rose-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Navigation Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:from-blue-500 hover:to-cyan-500"
              >
                Back to Shop
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 font-bold shadow-md transition"
              >
                Go to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Wishlist;

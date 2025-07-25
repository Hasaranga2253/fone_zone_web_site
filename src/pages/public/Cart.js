// src/pages/user/Cart.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    const userCartKey = `cart_${currentUser.email}`;
    const storedCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    setCartItems(storedCart);
  }, [currentUser]);

  const updateLocalStorage = (updated) => {
    const userCartKey = `cart_${currentUser.email}`;
    localStorage.setItem(userCartKey, JSON.stringify(updated));
  };

  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    updateLocalStorage(updated);
    toast.info('🗑️ Item removed from cart', { theme: 'dark' });
  };

  const handleQuantityChange = (id, delta) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    setCartItems(updated);
    updateLocalStorage(updated);
  };

  const handleClearCart = () => {
    setCartItems([]);
    const userCartKey = `cart_${currentUser.email}`;
    localStorage.removeItem(userCartKey);
    toast.warn('🛒 Cart cleared!', { theme: 'dark' });
  };

  // FIX: Properly handle price as number or string
  const subtotal = cartItems.reduce((sum, item) => {
    const cleanPrice =
      typeof item.price === 'number'
        ? item.price
        : parseFloat(item.price.toString().replace(/[^\d.-]/g, '')) || 0;
    const qty = item.quantity || 1;
    return sum + cleanPrice * qty;
  }, 0);

  const tax = subtotal * 0.1;
  const discount = 0;
  const total = subtotal + tax - discount;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
        <h2 className="text-3xl font-bold text-red-400 drop-shadow-lg">
          🔒 Please log in to view your cart
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-8">
      <h2 className="text-center text-cyan-400 drop-shadow-lg mb-10 text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text fade-in">
        🛒 Your Cart
      </h2>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      />
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          Your cart is empty. Start shopping now!
        </p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-lg border border-cyan-500 hover:shadow-cyan-500/50 transition duration-300 sticky top-8"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-32 object-contain rounded-md bg-gray-700 p-2"
                />
                <div className="flex-1 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-cyan-300 text-lg font-bold">
                    {typeof item.price === 'number'
                      ? `Rs. ${item.price.toLocaleString()}`
                      : item.price}
                  </p>
                  <div className="flex justify-center md:justify-start items-center space-x-4 mt-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="text-lg">{item.quantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-green-500 hover:shadow-green-400/50 transition duration-300 h-fit sticky top-8">
            <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">
              Order Summary
            </h3>
            <div className="space-y-4 text-lg">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span>Tax (10%):</span>
                <span>Rs. {tax.toLocaleString()}</span>
              </p>
              <p className="flex justify-between text-red-400">
                <span>Discount:</span>
                <span>- Rs. {discount.toLocaleString()}</span>
              </p>
              <hr className="border-gray-600" />
              <p className="flex justify-between text-xl font-bold text-cyan-400">
                <span>Total:</span>
                <span>Rs. {total.toLocaleString()}</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4 mt-8">
              <button
                onClick={() => navigate('/checkout')}
                className="py-3 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700 hover:shadow-green-500/50 transition shadow-md"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="py-3 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 hover:shadow-blue-500/50 transition shadow-md"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleClearCart}
                className="py-3 bg-red-600 text-white rounded-xl text-lg font-bold hover:bg-red-700 hover:shadow-red-500/50 transition shadow-md"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

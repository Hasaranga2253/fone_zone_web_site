// src/pages/public/Cart.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaLock } from 'react-icons/fa';

function Cart() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from PHP backend
  const loadCart = () => {
    if (!currentUser) {
      setCartItems([]);
      return;
    }
    fetch(`http://localhost/Fonezone/managecart.php?action=get&user=${currentUser.email}`)
      .then(res => res.json())
      .then(data => setCartItems(data.cart || []));
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('focus', loadCart);
    return () => window.removeEventListener('focus', loadCart);
    // eslint-disable-next-line
  }, [currentUser]);

  const handleRemove = (product_id) => {
    fetch('http://localhost/Fonezone/managecart.php?action=remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: currentUser.email, product_id })
    })
      .then(res => res.json())
      .then(() => {
        toast.info('Item removed from cart', { theme: 'dark' });
        loadCart();
      });
  };

  const handleQuantityChange = (product_id, delta) => {
    const current = cartItems.find((item) => item.product_id === product_id);
    const newQty = Math.max(1, (current?.quantity || 1) + delta);
    fetch('http://localhost/Fonezone/managecart.php?action=update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: currentUser.email, product_id, quantity: newQty })
    })
      .then(res => res.json())
      .then(() => loadCart());
  };

  const handleClearCart = () => {
    fetch('http://localhost/Fonezone/managecart.php?action=clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: currentUser.email })
    })
      .then(res => res.json())
      .then(() => {
        toast.warn('Cart cleared!', { theme: 'dark' });
        loadCart();
      });
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      typeof item.price === 'number'
        ? item.price
        : parseFloat(item.price && item.price.toString().replace(/[^\d.-]/g, '')) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);
  const tax = Math.round(subtotal * 0.10);
  const total = subtotal + tax;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  if (!currentUser) {
    return (
      <motion.div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <FaLock className="text-6xl text-cyan-400 mb-6" />
        <h2 className="text-3xl font-bold mb-2">Sign In Required</h2>
        <p className="text-gray-400 mb-6 text-center">
          You must be logged in to view your shopping cart.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:from-blue-500 hover:to-cyan-500"
        >
          Login
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 w-full"
        variants={fadeIn}
      >
        <motion.h1 variants={fadeIn} className="text-5xl font-bold mb-4">
          Your Shopping Cart
        </motion.h1>
        <motion.p
          variants={fadeIn}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Review your selected items before proceeding to checkout.
        </motion.p>
      </motion.section>

      {/* Main Cart Section (WIDER CONTAINER) */}
      <motion.div
        className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
        variants={stagger}
      >
        {cartItems.length === 0 ? (
          <motion.div
            variants={fadeIn}
            className="w-full flex flex-col items-center justify-center py-16 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl"
          >
            <div className="bg-gray-700 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-6">
              <FaShoppingCart className="text-4xl text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Your cart is empty</h3>
            <p className="text-gray-400 mb-8 max-w-md text-center">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:from-blue-500 hover:to-cyan-500"
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id || item.product_id}
                  variants={fadeIn}
                  className="flex flex-col md:flex-row items-center bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-all"
                >
                  <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-gray-700 rounded-lg p-2">
                    <img
                      src={item.image || '/images/fallback.jpg'}
                      alt={item.product_name || item.name}
                      className="max-h-24 max-w-24 object-contain"
                      onError={(e) => { e.currentTarget.src = '/images/fallback.jpg'; }}
                    />
                  </div>
                  <div className="flex-1 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{item.product_name || item.name}</h3>
                      <button
                        onClick={() => handleRemove(item.product_id)}
                        className="text-red-400 hover:text-red-300"
                        title="Remove"
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <p className="text-blue-400 font-bold mt-1">
                      {typeof item.price === 'number'
                        ? `Rs. ${item.price.toLocaleString()}`
                        : item.price}
                    </p>
                    <div className="flex items-center justify-center md:justify-start mt-4 gap-4">
                      <button
                        onClick={() => handleQuantityChange(item.product_id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="text-lg font-medium w-8 text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product_id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"
                        aria-label="Increase quantity"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div variants={fadeIn} className="flex justify-end mt-6">
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 bg-red-600/30 hover:bg-red-600/40 text-red-400 rounded-lg border border-red-500"
                  aria-label="Clear entire cart"
                >
                  Clear Entire Cart
                </button>
              </motion.div>
            </div>

            {/* Order Summary Section */}
            <motion.div
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 h-fit sticky top-6"
            >
              <h3 className="text-xl font-bold text-center mb-6 pb-3 border-b border-gray-700">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span className="text-gray-400">Tax (10%):</span>
                  <span className="font-medium">Rs. {tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-400">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => navigate('/Checkout')}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-medium hover:from-green-500 hover:to-emerald-500 flex items-center justify-center gap-2"
                >
                  <FaLock />
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate('/Shop')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:from-blue-500 hover:to-cyan-500"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg text-sm text-gray-400">
                <p className="flex items-center gap-2 mb-2">
                  <span className="text-green-400">✓</span>
                  <span>Secure checkout with SSL encryption</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Free returns within 30 days</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Cart;

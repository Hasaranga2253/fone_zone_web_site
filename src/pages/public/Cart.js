import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaLock } from 'react-icons/fa';

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
    toast.info('Item removed from cart', { theme: 'dark' });
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
    toast.warn('Cart cleared!', { theme: 'dark' });
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const cleanPrice =
      typeof item.price === 'number'
        ? item.price
        : parseFloat(item.price.toString().replace(/[^\d.-]/g, '')) || 0;
    const qty = item.quantity || 1;
    return sum + cleanPrice * qty;
  }, 0);

  const tax = subtotal * 0.05;
  const discount = 0;
  const total = subtotal + tax - discount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col">
      {/* Hero Section (Full Width, Fixed) */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 w-full">
        <h1 className="text-4xl font-extrabold gradient-text mb-4 flex items-center justify-center">
          Your Shopping Cart
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Review your selected items before proceeding to checkout.
        </p>
      </section>

      {/* Main Cart Section */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
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
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-all"
                >
                  <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-gray-700 rounded-lg p-2">
                    <img
                      src={item.image || '/images/fallback.jpg'}
                      alt={item.name}
                      className="max-h-24 max-w-24 object-contain"
                    />
                  </div>

                  <div className="flex-1 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-400 hover:text-red-300"
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
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="text-lg font-medium w-8 text-center">{item.quantity || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 bg-red-600/30 hover:bg-red-600/40 text-red-400 rounded-lg border border-red-500"
                >
                  Clear Entire Cart
                </button>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 h-fit sticky top-6">
              <h3 className="text-xl font-bold text-center mb-6 pb-3 border-b border-gray-700">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (5%):</span>
                  <span className="font-medium">Rs. {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Discount:</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

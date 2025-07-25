import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    const userCartKey = `cart_${currentUser.email}`;
    const stored = JSON.parse(localStorage.getItem(userCartKey)) || [];
    setCartItems(stored);
  }, [currentUser]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.-]/g, '')) || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);
  const tax = subtotal * 0.1;
  const discount = 0;
  const total = subtotal + tax - discount;

  const handleConfirmOrder = () => {
    if (!currentUser) {
      toast.info('ℹ️ Please log in to place an order.');
      navigate('/');
      return;
    }
    if (cartItems.length === 0) {
      toast.warn('🛒 Your cart is empty.');
      return;
    }

    const allOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
    const newOrder = {
      id: Date.now(),
      user: currentUser.email,
      items: cartItems,
      total: `Rs. ${total.toLocaleString()}`,
      status: 'Pending',
      date: new Date().toLocaleString(),
    };

    localStorage.setItem('userOrders', JSON.stringify([...allOrders, newOrder]));
    localStorage.removeItem(`cart_${currentUser.email}`);

    toast.success('✅ Order placed successfully!');
    navigate('/user/order-summary', { state: { order: newOrder } });
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background fallback image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center opacity-25 blur-sm -z-10"
        style={{
          backgroundImage: "url('/images/fallback.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900 opacity-80 -z-10"></div>

      {/* Decorative glowing circles */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse -z-10"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000 -z-10"></div>

      {/* Main Content */}
      <div className="relative z-10 p-8">
        <h2 className="text-4xl font-extrabold text-center text-cyan-400 drop-shadow-lg mb-10 animate-pulse">
          🧾 Checkout
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            Your cart is empty.{' '}
            <span
              className="text-cyan-400 cursor-pointer hover:underline"
              onClick={() => navigate('/shop')}
            >
              Go shopping
            </span>.
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl shadow-lg border border-cyan-500 hover:shadow-cyan-500/50 transition duration-300"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 object-contain rounded bg-gray-700 p-2"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-cyan-300 text-md font-bold">{item.price}</p>
                      <p className="text-gray-400">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="text-green-400 font-bold mt-3 md:mt-0">
                    Rs. {(
                      (parseFloat(item.price.replace(/[^\d.-]/g, '')) || 0) *
                      (item.quantity || 1)
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
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

              <div className="flex flex-col space-y-4 mt-8">
                <button
                  onClick={() => setShowConfirm(true)}
                  className="py-3 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700 hover:shadow-green-500/50 transition shadow-md"
                >
                  Place Order
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="py-3 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 hover:shadow-blue-500/50 transition shadow-md"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-lg border border-cyan-500 w-96 text-white">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                Confirm Your Order
              </h3>
              <p className="text-gray-300 mb-4">Total: Rs. {total.toLocaleString()}</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;

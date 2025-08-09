import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaShoppingBag, FaCheckCircle, FaTag } from 'react-icons/fa';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // --------- Load Cart Items from Backend ---------
  const loadCart = useCallback(() => {
    if (!currentUser) return setCartItems([]);
    fetch(`http://localhost/Fonezone/managecart.php?action=get&user=${currentUser.email}`)
      .then(res => res.json())
      .then(data => setCartItems(data.cart || []))
      .catch(() => setCartItems([]));
  }, [currentUser]);

  useEffect(() => {
    loadCart();
    window.addEventListener('focus', loadCart);
    return () => window.removeEventListener('focus', loadCart);
  }, [loadCart]);

  // --------- Price Helpers ---------
  const parsePrice = (price) =>
    typeof price === 'number' ? price : parseFloat((price || '').toString().replace(/[^\d.-]/g, '')) || 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * (parseInt(item.quantity) || 1),
    0
  );
  const tax = Math.round(subtotal * 0.1);
  const discount = subtotal > 5000 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + tax - discount;

  // --------- Helper: open invoice directly (no CORS) ---------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const downloadInvoice = async (absoluteUrl, orderId) => {
    const url = absoluteUrl.includes('?') ? `${absoluteUrl}&t=${Date.now()}` : `${absoluteUrl}?t=${Date.now()}`;
    await sleep(300); // tiny delay so Apache can serve the new file
    const a = document.createElement('a');
    a.href = url;
    a.download = `FoneZone_Invoice_FNZ-${orderId}.pdf`;
    a.target = '_blank'; // fallback if download attribute ignored
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // --------- Confirm Order Logic (Backend) ---------
  const handleConfirmOrder = async () => {
    if (!currentUser) {
      toast.info('Please log in to place an order.');
      navigate('/');
      return;
    }
    if (cartItems.length === 0) {
      toast.warn('Your cart is empty.');
      setShowConfirm(false);
      return;
    }

    try {
      setIsPlacing(true);

      const res = await fetch('http://localhost/Fonezone/placeorder.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
          items: cartItems,
          subtotal,
          tax,
          discount,
          total
        })
      });

      // Read as text first so we can show useful errors if JSON is bad
      const raw = await res.text();
      let result;
      try { result = JSON.parse(raw); }
      catch { throw new Error('Server returned invalid JSON: ' + raw.slice(0, 200)); }

      if (res.ok && result.success) {
        toast.success('Order placed successfully! Generating your invoice…');

        // Open invoice (no fetch -> no CORS)
        if (result.invoice_url && result.order?.id) {
          try {
            await downloadInvoice(result.invoice_url, result.order.id);
          } catch {
            toast.warn("Invoice will be available in your dashboard if the download didn’t start.");
          }
        }

        // Clear cart in backend (ignore errors)
        await fetch('http://localhost/Fonezone/managecart.php?action=clear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: currentUser.email })
        }).catch(() => {});

        await loadCart();
        setShowConfirm(false);

        setTimeout(() => {
          navigate('/user/dashboard', { state: { order: result.order } });
        }, 500);
      } else {
        toast.error(result?.error || 'Order failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong placing the order.');
    } finally {
      setIsPlacing(false);
    }
  };

  // --------- Redirect If Not Logged In ---------
  if (!currentUser) {
    return (
      <motion.div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <FaLock className="text-6xl text-cyan-400 mb-6" />
        <h2 className="text-3xl font-bold mb-2">Sign In Required</h2>
        <p className="text-gray-400 mb-6 text-center">You must be logged in to checkout.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:from-blue-500 hover:to-cyan-500"
        >
          Login
        </button>
      </motion.div>
    );
  }

  // --------- Render ---------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white relative fade-in">
      {/* Header */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 w-full">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
          Checkout
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Review your order details and complete your purchase below.</p>
      </section>

      {/* Cart Empty State */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 mt-8">
          <div className="bg-gray-700 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-6">
            <FaShoppingBag className="text-4xl text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Your cart is empty</h3>
          <p className="text-gray-400 mb-8 max-w-md text-center">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:from-blue-500 hover:to-cyan-500"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center gap-2">
                <FaShoppingBag className="text-blue-400" />
                Order Items ({cartItems.length})
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product_id || item.id}
                    className="flex items-center justify-between bg-gray-700/30 p-4 rounded-xl border border-gray-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-lg">
                        <img
                          src={item.image || '/images/fallback.jpg'}
                          alt={item.product_name || item.name}
                          className="max-h-16 max-w-16 object-contain"
                          onError={(e) => { e.currentTarget.src = '/images/fallback.jpg'; }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.product_name || item.name}</h3>
                        <p className="text-blue-400 font-bold text-sm">Rs. {parsePrice(item.price).toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="text-green-400 font-bold">
                      Rs. {(parsePrice(item.price) * (parseInt(item.quantity) || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Options (dummy UI) */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-6 pb-3 border-b border-gray-700">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-600 rounded-xl p-4 flex items-center gap-3 bg-gray-700/30 cursor-pointer hover:border-blue-500">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <FaLock className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Credit Card</h3>
                    <p className="text-gray-400 text-sm">Pay with card</p>
                  </div>
                </div>
                <div className="border border-gray-600 rounded-xl p-4 flex items-center gap-3 bg-gray-700/30 cursor-pointer hover:border-green-500">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <FaTag className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Cash on Delivery</h3>
                    <p className="text-gray-400 text-sm">Pay when delivered</p>
                  </div>
                </div>
                <div className="border border-gray-600 rounded-xl p-4 flex items-center gap-3 bg-gray-700/30 cursor-pointer hover:border-yellow-500">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <FaCheckCircle className="text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Binance Wallet</h3>
                    <p className="text-gray-400 text-sm">Use crypto balance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 h-fit sticky top-6">
            <h2 className="text-xl font-bold mb-6 pb-3 border border-gray-700 border-opacity-0">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal:</span>
                <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax (10%):</span>
                <span className="font-medium">Rs. {tax.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount (10%):</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-400">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isPlacing}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                  isPlacing ? 'bg-gray-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                }`}
              >
                <FaLock />
                {isPlacing ? 'Placing…' : 'Place Order'}
              </button>
              <button
                onClick={() => navigate('/shop')}
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
                <span>30-day money-back guarantee</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-cyan-500 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-3xl text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-400">Confirm Your Order</h3>
              <p className="text-gray-400 mt-2">Please review your order details before confirming</p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2"><span className="text-gray-400">Items:</span><span>{cartItems.length}</span></div>
              <div className="flex justify-between mb-2"><span className="text-gray-400">Subtotal:</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between mb-2"><span className="text-gray-400">Tax:</span><span>Rs. {tax.toLocaleString()}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400 mb-2">
                  <span>Discount:</span><span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-600">
                <span>Total:</span><span className="text-cyan-400">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowConfirm(false)} className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium w-1/2">Cancel</button>
              <button
                onClick={handleConfirmOrder}
                disabled={isPlacing}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-medium hover:from-green-500 hover:to-emerald-500 w-1/2 disabled:opacity-70"
              >
                {isPlacing ? 'Confirming…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;

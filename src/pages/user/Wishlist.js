import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion } from 'framer-motion';

function Wishlist() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // CRA env (set REACT_APP_API_BASE in .env.local if needed)
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost';

  // ⚠️ Keep folder case exactly as on disk: wishlist in /fonezone, cart in /Fonezone
  const WISHLIST_URL = `${API_BASE}/Fonezone/wishlist.php`;
  const CART_ADD_URL  = `${API_BASE}/Fonezone/managecart.php?action=add`;

  const FALLBACK_IMG = '/images/fallback.jpg';

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [busyId, setBusyId] = useState(null);

  // avoid setState after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ---------- helpers ----------
  const formatPrice = (v) => {
    const num = typeof v === 'number' ? v : parseFloat(String(v)) || 0;
    return `Rs. ${num.toLocaleString('en-US')}`;
  };
  const priceToNumber = (v) => {
    if (typeof v === 'number') return v;
    const clean = String(v ?? '').replace(/[^\d.]/g, '');
    const n = parseFloat(clean);
    return Number.isFinite(n) ? n : 0;
  };

  // ---------- data load ----------
  const loadWishlist = useCallback(() => {
    if (!currentUser?.email) return;

    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setFetchError('');
      try {
        const res = await fetch(
          `${WISHLIST_URL}?email=${encodeURIComponent(currentUser.email)}`,
          { signal: controller.signal, cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mountedRef.current) return;

        // Expect: { success: true, items: [...] }
        const items = Array.isArray(data.items) ? data.items : [];
        setWishlistItems(items);
      } catch (err) {
        if (!mountedRef.current) return;
        if (err && err.name === 'AbortError') return; // ignore abort on unmount/refresh
        setFetchError('Failed to load wishlist. Please try again.');
        setWishlistItems([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [WISHLIST_URL, currentUser?.email]);

  useEffect(() => {
    const abort = loadWishlist();
    return () => { if (typeof abort === 'function') abort(); };
  }, [loadWishlist]);

  // ---------- actions ----------
  // Add to cart (server) → remove from wishlist (server) → update UI
  const handleAddToCart = async (item) => {
    if (!currentUser || busyId) return;
    setBusyId(item.id);

    try {
      // 1) add to cart
      const res = await fetch(CART_ADD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
          product_id: item.id,
          product_name: item.name,
          price: priceToNumber(item.price),
          image: item.image || '',
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (!data?.success) {
        alert(data?.error || 'Failed to add to cart');
        setBusyId(null);
        return;
      }

      // 2) remove from wishlist (best-effort)
      await fetch(WISHLIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          email: currentUser.email,
          item_id: item.id,
        }),
      }).catch(() => { /* cart already added */ });

      // 3) update UI
      setWishlistItems((items) => items.filter((i) => i.id !== item.id));
      alert(`${item.name} added to cart!`);
    } catch {
      alert('Failed to add to cart');
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (id) => {
    if (!currentUser || busyId) return;
    setBusyId(id);
    try {
      const res = await fetch(WISHLIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          email: currentUser.email,
          item_id: id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWishlistItems((items) => items.filter((it) => it.id !== id));
      } else {
        alert(data.error || 'Failed to remove item');
      }
    } catch {
      alert('Failed to remove item');
    } finally {
      setBusyId(null);
    }
  };

  // ---------- UI ----------
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
        <h2 className="text-3xl font-bold text-red-400">Please log in to view your wishlist</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <Navbar />

      {/* Hero */}
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
        {fetchError && <p className="text-red-400 mt-3 text-sm">{fetchError}</p>}
      </section>

      {/* List */}
      <div className="flex-1 p-8">
        {loading ? (
          <p className="text-center text-gray-400 text-lg">Loading...</p>
        ) : wishlistItems.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            Your wishlist is empty.{` `}
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
                    src={item.image || FALLBACK_IMG}
                    alt={item.name}
                    className="h-40 object-contain mx-auto mb-4 rounded bg-gray-700 p-2"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                  />
                  <h3 className="text-xl font-semibold text-center">{item.name}</h3>
                  <p className="text-pink-300 text-center text-lg font-bold">
                    {formatPrice(item.price)}
                  </p>
                  {item.added_at && (
                    <p className="text-xs text-gray-400 text-center mt-1">
                      Added: {new Date(item.added_at).toLocaleString()}
                    </p>
                  )}

                  <div className="flex flex-col mt-4 space-y-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={busyId === item.id}
                      className="py-2 btn-wishlist w-full disabled:opacity-60"
                    >
                      {busyId === item.id ? 'Adding…' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={busyId === item.id}
                      className="btn-wishlist w-full bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-400 hover:via-pink-400 hover:to-rose-400 disabled:opacity-60"
                    >
                      {busyId === item.id ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer actions */}
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

      <Footer />
    </div>
  );
}

export default Wishlist;

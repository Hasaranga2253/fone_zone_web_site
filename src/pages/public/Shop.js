import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaCartPlus,
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaStar,
  FaFilter,
  FaTimes,
  FaCheckCircle,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Shop() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ---- API endpoints (CRA: set REACT_APP_API_BASE in .env.local if needed) ----
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost';
  const PRODUCTS_API = `${API_BASE}/Fonezone/manageproducts.php?action=get`;
  const CART_ADD_API = `${API_BASE}/Fonezone/managecart.php?action=add`;
  const WISHLIST_API = `${API_BASE}/Fonezone/wishlist.php`;

  // State
  const [products, setProducts] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [flyingHearts, setFlyingHearts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [wishIds, setWishIds] = useState(new Set());
  const productsPerPage = 12;

  const categories = ['All', 'Phones', 'Accessories', 'Tablets', 'Repair Items'];
  const fallbackImage = '/images/fallback.jpg';

  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  // Helpers
  const formatPrice = (price) => `Rs. ${Number(price ?? 0).toLocaleString('en-US')}`;
  const showNotification = (message) => {
    setNotifyMessage(message);
    setTimeout(() => setNotifyMessage(''), 3000);
  };
  const inWishlist = (id) => wishIds.has(id);

  // Mounted guard
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ---------- Data loaders ----------
  const loadProducts = useCallback(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(PRODUCTS_API, { signal: controller.signal, cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mountedRef.current) return;
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        if (err?.name !== 'AbortError') setProducts([]);
      }
    })();
    return () => controller.abort();
  }, [PRODUCTS_API]);

  const loadWishlist = useCallback(() => {
    if (!currentUser?.email) {
      setWishIds(new Set());
      return () => {};
    }
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `${WISHLIST_API}?email=${encodeURIComponent(currentUser.email)}`,
          { signal: controller.signal, cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mountedRef.current) return;
        const ids = new Set((data.items || []).map((i) => i.id));
        setWishIds(ids);
      } catch (err) {
        if (err?.name !== 'AbortError') setWishIds(new Set());
      }
    })();
    return () => controller.abort();
  }, [WISHLIST_API, currentUser?.email]);

  // Effects
  useEffect(loadProducts, [loadProducts]);
  useEffect(loadWishlist, [loadWishlist]);

  // ---------- Filtering + pagination ----------
  const filteredProducts = products.filter(
    (p) =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      Number(p.price ?? 0) >= priceRange[0] &&
      Number(p.price ?? 0) <= priceRange[1]
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Reset page to 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, priceRange, productsPerPage]);

  // ---------- Deep-link: /shop#<productId> ----------
  useEffect(() => {
    const raw = (location.hash || '').slice(1);
    const targetId = Number.parseInt(raw, 10);
    if (!Number.isFinite(targetId)) return;
    if (!products || products.length === 0) return;

    const idx = products.findIndex((p) => Number(p.id) === targetId);
    if (idx === -1) return;

    // Ensure filters won't hide the target
    if (activeCategory !== 'All') setActiveCategory('All');
    const fullRange = [0, Number.MAX_SAFE_INTEGER];
    if (priceRange[0] !== fullRange[0] || priceRange[1] !== fullRange[1]) {
      setPriceRange(fullRange);
    }

    // Go to the page that contains the target product
    const page = Math.max(1, Math.floor(idx / productsPerPage) + 1);
    const scrollToCard = () => {
      const el = document.getElementById(`product-${targetId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (currentPage !== page) {
      setCurrentPage(page);
      // Wait for page render, then scroll
      requestAnimationFrame(() => requestAnimationFrame(scrollToCard));
    } else {
      // Already on correct page
      requestAnimationFrame(scrollToCard);
    }
  }, [location.hash, products, productsPerPage, activeCategory, priceRange, currentPage]);

  // ---------- Actions ----------
  const handleAddToCart = async (product) => {
    if (!currentUser) return showNotification('Please log in to add to your cart.');
    if (busyId) return;
    setBusyId(product.id);

    try {
      const res = await fetch(CART_ADD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: currentUser.email,
          product_id: product.id,
          product_name: product.name,
          price: Number(product.price ?? 0),
          image: product.image,
          quantity: 1,
        }),
      });
      const data = await res.json();
      if (data?.success) showNotification(`${product.name} added to cart!`);
      else showNotification(data?.error || 'Failed to add to cart.');
    } catch {
      showNotification('Failed to add to cart.');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleWishlist = async (product, e) => {
    if (!currentUser) return showNotification('Please log in to manage your wishlist.');
    if (busyId) return;

    // Heart animation
    if (e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const hearts = Array.from({ length: 5 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        size: Math.random() * 20 + 10,
      }));
      setFlyingHearts(hearts);
      setTimeout(() => setFlyingHearts([]), 1000);
    }

    const wasIn = inWishlist(product.id);

    // Optimistic UI
    const next = new Set(wishIds);
    wasIn ? next.delete(product.id) : next.add(product.id);
    setWishIds(next);
    setBusyId(product.id);

    const payload = wasIn
      ? { action: 'remove', email: currentUser.email, item_id: product.id }
      : {
          action: 'add',
          email: currentUser.email,
          item: {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1,
          },
        };

    try {
      const res = await fetch(WISHLIST_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data?.success && data?.error !== 'Item already in wishlist') {
        // rollback by reloading
        loadWishlist();
        showNotification(data?.error || 'Wishlist update failed.');
      } else {
        showNotification(wasIn ? 'Removed from wishlist.' : 'Added to wishlist!');
      }
    } catch {
      loadWishlist(); // rollback
      showNotification('Wishlist update failed.');
    } finally {
      setBusyId(null);
    }
  };

  const handleRateProduct = () => {
    showNotification('Rating feature will be available soon via backend!');
  };

  const getAverageRating = (_id, defaultRating) => defaultRating || 0;

  // ---------- UI ----------
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white relative p-0"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Flying Hearts */}
      <AnimatePresence>
        {flyingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-pink-500 z-50 pointer-events-none"
            style={{ top: heart.y, left: heart.x, fontSize: `${heart.size}px` }}
            initial={{ opacity: 1, scale: 0.5, x: '-50%', y: '-50%' }}
            animate={{ opacity: 0, scale: 1.5, y: '-200%', x: `${Math.random() * 100 - 50}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <FaHeart />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notifyMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          >
            <FaCheckCircle /> <span>{notifyMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setQuickView(null)}
                className="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close quick view"
              >
                <FaTimes className="text-gray-300" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 p-8 flex items-center justify-center">
                  <img
                    src={quickView.image || fallbackImage}
                    alt={quickView.name}
                    className="h-56 object-contain transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      // eslint-disable-next-line no-param-reassign
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {quickView.category || 'Product'}
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{quickView.name}</h2>
                  <div className="flex items-center mb-4 gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => handleRateProduct(quickView.id, star)}
                        className={`cursor-pointer ${star <= (quickView.rating || 0) ? 'text-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                    <span className="text-gray-400 text-sm">Average: {quickView.rating || 'N/A'}</span>
                  </div>
                  <p className="text-cyan-400 text-2xl font-bold mb-4">{formatPrice(quickView.price)}</p>
                  <div className="mb-6">
                    <h3 className="text-gray-300 font-medium mb-2">Description</h3>
                    <p className="text-gray-400">{quickView.description || 'No description available.'}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        handleAddToCart(quickView);
                        setQuickView(null);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaCartPlus /> Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        handleToggleWishlist(quickView, e);
                        setQuickView(null);
                      }}
                      disabled={busyId === quickView?.id}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 ${
                        inWishlist(quickView?.id) ? 'bg-pink-600' : 'bg-gradient-to-r from-pink-600 to-rose-700'
                      }`}
                    >
                      {inWishlist(quickView?.id) ? <FaHeart /> : <FaRegHeart />}
                      {inWishlist(quickView?.id) ? 'In Wishlist' : 'Add to Wishlist'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <motion.section
        className="bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 w-full"
        variants={fadeIn}
      >
        <motion.h1 variants={fadeIn} className="text-5xl font-bold mb-4">
          FoneZone Shop
        </motion.h1>
        <motion.p variants={fadeIn} className="text-gray-200 max-w-2xl mx-auto text-lg">
          Explore our premium smartphones, tablets, accessories, and repair services.
        </motion.p>
      </motion.section>

      {/* Main */}
      <motion.div className="w-full mx-auto flex gap-6 px-6 mt-8 min-h-screen" variants={stagger}>
        {/* Sidebar */}
        <motion.aside
          className="w-64 sticky top-24 h-fit flex-col bg-gray-900/80 border border-gray-800 rounded-xl p-4 hidden lg:flex"
          variants={fadeIn}
        >
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 w-full px-4 py-2 mb-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg"
            >
              <FaFilter /> Price Filter
            </button>

            <button
              onClick={() => (currentUser ? navigate('/wishlist') : showNotification('Log in to view wishlist'))}
              className="flex items-center gap-2 w-full px-4 py-2 mb-4 bg-gradient-to-r  from-pink-600 to-rose-700 rounded-lg"
            >
              <FaHeart /> <span className="hidden md:inline">Wishlist</span>
            </button>

            <div className="flex flex-col gap-3 mb-6">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            {showFilters && (
              <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="1500000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value, 10)])}
                  className="w-full accent-blue-500"
                />
                <div className="text-gray-400 text-sm mt-1">
                  Showing products up to {formatPrice(priceRange[1])}
                </div>
              </div>
            )}
          </div>
        </motion.aside>

        {/* Products Grid */}
        <motion.div className="flex-1" variants={stagger}>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
            variants={stagger}
          >
            {displayedProducts.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400">No products found.</div>
            ) : (
              displayedProducts.map((product) => {
                const avgRating = getAverageRating(product.id, product.rating);
                const isBusy = busyId === product.id;
                return (
                  <motion.div
                    key={product.id}
                    id={`product-${product.id}`} // <-- scroll target for deep-link
                    variants={fadeIn}
                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg group hover:shadow-xl transition"
                  >
                    <div className="relative h-56 flex items-center justify-center p-4 bg-gray-900">
                      <img
                        src={product.image || fallbackImage}
                        alt={product.name}
                        className="h-44 object-contain transition-transform group-hover:scale-110"
                        onError={(e) => {
                          // eslint-disable-next-line no-param-reassign
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                          onClick={(e) => handleToggleWishlist(product, e)}
                          disabled={isBusy}
                          className={`w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-60 ${
                            inWishlist(product.id) ? 'bg-pink-600' : 'bg-gray-800/70 hover:bg-pink-600'
                          }`}
                          aria-label="Toggle wishlist"
                        >
                          {inWishlist(product.id) ? (
                            <FaHeart className="text-white" />
                          ) : (
                            <FaRegHeart className="text-pink-400" />
                          )}
                        </button>
                        <button
                          onClick={() => setQuickView(product)}
                          className="bg-gray-800/70 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center"
                          aria-label="Quick view"
                        >
                          <FaSearch className="text-blue-400" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < Math.floor(avgRating) ? 'text-yellow-400' : 'text-gray-600'}
                          />
                        ))}
                        <span className="ml-2 text-gray-400 text-sm">{avgRating}</span>
                      </div>

                      <h3 className="font-bold text-lg truncate">{product.name}</h3>
                      <p className="text-cyan-400 font-bold text-xl mb-3">{formatPrice(product.price)}</p>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isBusy}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <FaCartPlus /> Add to Cart
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          {totalPages > 1 && (
            <motion.div className="mt-10 flex justify-center gap-4 items-center pb-12" variants={fadeIn}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-5 py-2 rounded-lg text-white ${
                  currentPage === 1
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600'
                }`}
              >
                Previous
              </button>
              <span className="text-gray-300 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-5 py-2 rounded-lg text-white ${
                  currentPage === totalPages
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600'
                }`}
              >
                Next
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Shop;

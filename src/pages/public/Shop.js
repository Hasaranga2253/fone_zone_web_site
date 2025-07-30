import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FaCartPlus,
  FaHeart,
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

  // State Management
  const [products, setProducts] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [flyingHearts, setFlyingHearts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const productsPerPage = 12;

  const categories = ['All', 'Phones', 'Accessories', 'Tablets', 'Repair Items'];
  const fallbackImage = '/images/fallback.jpg';

  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  // Load products and ratings
  const loadProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);

    if (currentUser) {
      const storedRatings = JSON.parse(localStorage.getItem(`ratings_${currentUser.email}`)) || {};
      setUserRatings(storedRatings);
    }
  };

  useEffect(() => {
    loadProducts();
    const onStorageChange = () => loadProducts();
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, [currentUser]);

  // Filtering and pagination
  const filteredProducts = products.filter(
    (p) =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      p.price >= priceRange[0] &&
      p.price <= priceRange[1]
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, priceRange]);

  // Helpers
  const formatPrice = (price) => `Rs. ${price.toLocaleString('en-US')}`;
  const showNotification = (message) => {
    setNotifyMessage(message);
    setTimeout(() => setNotifyMessage(''), 3000);
  };

  // Cart handler
  const handleAddToCart = (product) => {
    if (!currentUser) return alert('Please log in to add to your cart.');
    const key = `cart_${currentUser.email}`;
    const cart = JSON.parse(localStorage.getItem(key)) || [];
    const exists = cart.find((i) => i.id === product.id);
    const updated = exists
      ? cart.map((i) =>
          i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        )
      : [...cart, { ...product, quantity: 1 }];
    localStorage.setItem(key, JSON.stringify(updated));
    showNotification(`${product.name} has been added to your cart!`);
  };

  // Wishlist handler (with flying hearts)
  const handleAddToWishlist = (product, e) => {
    if (!currentUser) return alert('Please log in to save to wishlist.');
    const key = `wishlist_${currentUser.email}`;
    const wishlist = JSON.parse(localStorage.getItem(key)) || [];
    if (!wishlist.find((i) => i.id === product.id)) {
      localStorage.setItem(key, JSON.stringify([...wishlist, product]));

      // Heart animation
      const rect = e.currentTarget.getBoundingClientRect();
      const hearts = Array.from({ length: 5 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        size: Math.random() * 20 + 10,
      }));
      setFlyingHearts(hearts);
      setTimeout(() => setFlyingHearts([]), 1000);

      showNotification(`${product.name} has been added to your wishlist!`);
    }
  };

  // Ratings handler
  const handleRateProduct = (productId, rating) => {
    if (!currentUser) return alert('Please log in to rate products.');
    const updatedRatings = { ...userRatings, [productId]: rating };
    setUserRatings(updatedRatings);
    localStorage.setItem(`ratings_${currentUser.email}`, JSON.stringify(updatedRatings));
    showNotification(`You rated this product ${rating} star${rating > 1 ? 's' : ''}!`);
  };

  const getAverageRating = (productId, defaultRating) => {
    let sum = 0;
    let count = 0;
    if (userRatings[productId]) {
      sum += userRatings[productId];
      count++;
    }
    return count > 0 ? (sum / count).toFixed(1) : defaultRating || 0;
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white relative p-0"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Flying Hearts Animation */}
      <AnimatePresence>
        {flyingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-pink-500 z-50 pointer-events-none"
            style={{ top: heart.y, left: heart.x, fontSize: `${heart.size}px` }}
            initial={{ opacity: 1, scale: 0.5, x: '-50%', y: '-50%' }}
            animate={{
              opacity: 0,
              scale: 1.5,
              y: '-200%',
              x: `${Math.random() * 100 - 50}%`,
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <FaHeart />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Notification Popup */}
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
              {/* Close Button */}
              <button
                onClick={() => setQuickView(null)}
                className="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-gray-300" />
              </button>

              {/* Modal Content */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 p-8 flex items-center justify-center">
                  <img
                    src={quickView.image || fallbackImage}
                    alt={quickView.name}
                    className="h-56 object-contain transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {quickView.category}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{quickView.name}</h2>

                  {/* Ratings */}
                  <div className="flex items-center mb-4 gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => handleRateProduct(quickView.id, star)}
                        className={`cursor-pointer ${
                          star <= (userRatings[quickView.id] || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 text-sm">
                      Your Rating: {userRatings[quickView.id] || 'N/A'}
                    </span>
                  </div>

                  {/* Price & Description */}
                  <p className="text-cyan-400 text-2xl font-bold mb-4">
                    {formatPrice(quickView.price)}
                  </p>
                  <div className="mb-6">
                    <h3 className="text-gray-300 font-medium mb-2">Description</h3>
                    <p className="text-gray-400">{quickView.description || 'No description available.'}</p>
                  </div>

                  {/* Actions */}
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
                        handleAddToWishlist(quickView, e);
                        setQuickView(null);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-700 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaHeart /> Add to Wishlist
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
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

      {/* Main Content */}
      <motion.div className="w-full mx-auto flex gap-6 px-6 mt-8 min-h-screen" variants={stagger}>
        {/* Sidebar */}
        <motion.aside
          className="w-64 sticky top-24 h-fit flex-col bg-gray-900/80 border border-gray-800 rounded-xl p-4 hidden lg:flex"
          variants={fadeIn}
        >
          {/* Filters & Category */}
          <div>
            {/* Price Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 w-full px-4 py-2 mb-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg"
            >
              <FaFilter /> Price Filter
            </button>

            {/* Wishlist Shortcut */}
            <button
              onClick={() => (currentUser ? navigate('/wishlist') : alert('Log in to view wishlist'))}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-6 bg-gradient-to-r from-pink-600 to-rose-700 rounded-lg shadow-md"
            >
              <FaHeart /> <span className="hidden md:inline">Wishlist</span>
            </button>

            {/* Categories */}
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

            {/* Price Filter Slider */}
            {showFilters && (
              <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
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
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full" variants={stagger}>
            {displayedProducts.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400">No products found.</div>
            ) : (
              displayedProducts.map((product) => {
                const avgRating = getAverageRating(product.id, product.rating);
                return (
                  <motion.div
                    key={product.id}
                    variants={fadeIn}
                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg group hover:shadow-xl transition"
                  >
                    {/* Product Image & Quick Actions */}
                    <div className="relative h-56 flex items-center justify-center p-4 bg-gray-900">
                      <img
                        src={product.image || fallbackImage}
                        alt={product.name}
                        className="h-44 object-contain transition-transform group-hover:scale-110"
                        onError={(e) => (e.target.src = fallbackImage)}
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleAddToWishlist(product, e)}
                          className="bg-gray-800/70 hover:bg-pink-600 w-10 h-10 rounded-full flex items-center justify-center"
                        >
                          <FaHeart className="text-pink-400" />
                        </button>
                        {/* Quick View Button */}
                        <button
                          onClick={() => setQuickView(product)}
                          className="bg-gray-800/70 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center"
                        >
                          <FaSearch className="text-blue-400" />
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      {/* Rating */}
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < Math.floor(avgRating) ? 'text-yellow-400' : 'text-gray-600'}
                          />
                        ))}
                        <span className="ml-2 text-gray-400 text-sm">{avgRating}</span>
                      </div>

                      {/* Name & Price */}
                      <h3 className="font-bold text-lg truncate">{product.name}</h3>
                      <p className="text-cyan-400 font-bold text-xl mb-3">{formatPrice(product.price)}</p>

                      {/* Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <FaCartPlus /> Add to Cart
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          {/* Pagination */}
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

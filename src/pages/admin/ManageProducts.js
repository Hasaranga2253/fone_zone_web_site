// src/pages/admin/ManageProducts.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaMobile,
  FaTablet,
  FaTools,
  FaHeadphones,
  FaStar,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost/Fonezone';

const ManageProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Phones',
    description: '',
    rating: 4.5,
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['Phones', 'Tablets', 'Accessories', 'Repair Items'];
  const categoryIcons = {
    Phones: <FaMobile className="text-blue-400" />,
    Tablets: <FaTablet className="text-purple-400" />,
    Accessories: <FaHeadphones className="text-green-400" />,
    'Repair Items': <FaTools className="text-amber-400" />,
  };

  // Always include cookies; parse JSON safely; bubble up 401/403
  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { credentials: 'include', ...options });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* ignore non-JSON */
    }
    if (res.status === 401 || res.status === 403) {
      const err = new Error('unauthorized');
      err.code = res.status;
      err.data = data;
      throw err;
    }
    return { res, data };
  };

  // --------- Load products (admin-only) ----------
  const fetchProducts = async () => {
    try {
      const { data } = await apiFetch(`${API_BASE}/manageproducts.php?action=get`);
      const list =
        data?.data?.products ||
        data?.products ||
        (Array.isArray(data) ? data : []);
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      if (err?.code === 401 || err?.code === 403) {
        navigate('/unauthorized', { replace: true });
      } else {
        setProducts([]);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((p) => ({ ...p, [name]: value }));
  };

  // Small validator/sanitizer
  const buildBody = () => {
    const priceInt = parseInt(String(newProduct.price).replace(/[^0-9]/g, ''), 10);
    const ratingNum = Math.max(1, Math.min(5, parseFloat(newProduct.rating) || 4.5));
    const body = {
      name: (newProduct.name || '').trim(),
      price: Number.isFinite(priceInt) ? priceInt : 0,
      image: (newProduct.image || '').trim(),
      category: newProduct.category,
      description: (newProduct.description || '').trim(),
      rating: ratingNum,
      id: editingId,
    };
    return body;
  };

  // --------- Add / Edit ----------
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (loading) return;

    const body = buildBody();
    if (!body.name || !body.price || !body.image || !body.category) {
      alert('Please fill in all required product fields.');
      return;
    }

    const action = editingId ? 'edit' : 'add';

    try {
      setLoading(true);
      await apiFetch(`${API_BASE}/manageproducts.php?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await fetchProducts();
      resetForm();
      setIsFormExpanded(false);
    } catch (err) {
      if (err?.code === 401 || err?.code === 403) {
        navigate('/unauthorized', { replace: true });
      } else {
        alert('Failed to save product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --------- Reset form ----------
  const resetForm = () => {
    setNewProduct({
      name: '',
      price: '',
      image: '',
      category: 'Phones',
      description: '',
      rating: 4.5,
    });
    setEditingId(null);
  };

  // --------- Edit prefill ----------
  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      price: String(product.price ?? ''),
      image: product.image,
      category: product.category,
      description: product.description || '',
      rating: product.rating || 4.5,
    });
    setEditingId(product.id);
    setIsFormExpanded(true);
  };

  // --------- Delete ----------
  const handleDelete = async (id) => {
    if (loading) return;
    try {
      setLoading(true);
      await apiFetch(`${API_BASE}/manageproducts.php?action=delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setDeleteConfirmId(null);
      await fetchProducts();
    } catch (err) {
      if (err?.code === 401 || err?.code === 403) {
        navigate('/unauthorized', { replace: true });
      } else {
        alert('Failed to delete product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `Rs. ${Number(price || 0).toLocaleString('en-US')}`;
  const getCategoryCount = (category) =>
    products.filter((p) => p.category === category).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white p-4 md:p-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg hover:opacity-90 transition"
        >
          <FaArrowLeft /> Admin Dashboard
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-center tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Product Management
          </span>
        </h1>

        <div className="w-32" /> {/* Spacer */}
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-900/70 to-indigo-900/70 rounded-xl p-4 border border-indigo-700/50">
          <h3 className="text-gray-400 text-sm mb-1">Total Products</h3>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="bg-gradient-to-r from-cyan-900/70 to-blue-900/70 rounded-xl p-4 border border-cyan-700/50">
          <h3 className="text-gray-400 text-sm mb-1">Phones</h3>
          <p className="text-3xl font-bold">{getCategoryCount('Phones')}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-900/70 to-fuchsia-900/70 rounded-xl p-4 border border-fuchsia-700/50">
          <h3 className="text-gray-400 text-sm mb-1">Tablets</h3>
          <p className="text-3xl font-bold">{getCategoryCount('Tablets')}</p>
        </div>
        <div className="bg-gradient-to-r from-green-900/70 to-emerald-900/70 rounded-xl p-4 border border-emerald-700/50">
          <h3 className="text-gray-400 text-sm mb-1">Accessories</h3>
          <p className="text-3xl font-bold">{getCategoryCount('Accessories')}</p>
        </div>
        <div className="bg-gradient-to-r from-amber-900/70 to-orange-900/70 rounded-xl p-4 border border-orange-700/50">
          <h3 className="text-gray-400 text-sm mb-1">Repair Items</h3>
          <p className="text-3xl font-bold">{getCategoryCount('Repair Items')}</p>
        </div>
      </div>

      {/* Add Product Toggle Button */}
      <div className="flex justify-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setIsFormExpanded((v) => !v);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg"
          disabled={loading}
        >
          {isFormExpanded ? <FaTimes /> : <FaPlus />}
          {isFormExpanded ? 'Close Form' : 'Add New Product'}
        </motion.button>
      </div>

      {/* Product Form */}
      <AnimatePresence>
        {isFormExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card max-w-4xl mx-auto p-6 mb-10 rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur-lg"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? (
                <>
                  <FaEdit /> Editing Product
                </>
              ) : (
                <>
                  <FaPlus /> Add New Product
                </>
              )}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-gray-400 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="iPhone 15 Pro Max"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
                    disabled={loading}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-gray-400 mb-2">Price (Rs.)</label>
                  <input
                    type="text"
                    name="price"
                    placeholder="275000"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
                    disabled={loading}
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
                    disabled={loading}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-400 mb-2">Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-500"
                    disabled={loading}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-gray-400 mb-2">Rating</label>
                  <select
                    name="rating"
                    value={newProduct.rating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-500"
                    disabled={loading}
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} {rating === 1 ? 'Star' : 'Stars'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Preview</label>
                  <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-center h-32">
                    {newProduct.image ? (
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        className="h-24 object-contain"
                      />
                    ) : (
                      <span className="text-gray-500">No image selected</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter detailed product description..."
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsFormExpanded(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg hover:opacity-90 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <FaSave /> {editingId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="glass-card max-w-2xl mx-auto p-10 text-center rounded-2xl">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold mb-2">No Products Found</h2>
          <p className="text-gray-400 mb-6">Add your first product to get started</p>
          <button
            onClick={() => setIsFormExpanded(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:opacity-90 transition"
            disabled={loading}
          >
            Create Product
          </button>
        </div>
      ) : (
        <div className="glass-card p-4 md:p-6 rounded-2xl border border-gray-700 bg-gray-800/30 backdrop-blur-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Rating</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-800 hover:bg-gray-700/20 transition"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-900 rounded-lg p-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-400 line-clamp-1 max-w-xs">
                            {product.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {categoryIcons[product.category]}
                        <span>{product.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span>{product.rating || 4.5}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-full"
                          disabled={loading}
                        >
                          <FaEdit className="text-blue-300" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-2 bg-red-600/30 hover:bg-red-600/50 rounded-full"
                          disabled={loading}
                        >
                          <FaTrash className="text-red-300" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700"
            >
              <h3 className="text-xl font-bold mb-4 text-red-400">Confirm Delete</h3>
              <p className="mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold">
                  {products.find((p) => p.id === deleteConfirmId)?.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;

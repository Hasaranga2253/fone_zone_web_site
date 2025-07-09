import React, { useEffect, useState } from 'react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(stored);
  }, []);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('Please fill in all product fields.');
      return;
    }

    const updated = [...products, { ...newProduct, id: Date.now() }];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));

    setNewProduct({ name: '', price: '', image: '' });
  };

  const handleDelete = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  return (
    <div className="p-6 bg-white text-black rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">📦 Manage Products</h2>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="space-y-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Phone Name"
          value={newProduct.name}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="price"
          placeholder="Price (e.g. Rs. 120,000)"
          value={newProduct.price}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>

      {/* Product Table */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="text-center hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <img src={product.image} alt={product.name} className="h-12 w-12 mx-auto" />
                  </td>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.price}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

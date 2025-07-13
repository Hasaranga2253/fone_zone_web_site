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

  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);

    const userCartKey = `cart_${currentUser.email}`;
    localStorage.setItem(userCartKey, JSON.stringify(updated));

    toast.success('🗑️ Item removed from cart');
  };

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.-]/g, '')) || 0;
    return sum + price;
  }, 0);

  if (!currentUser) {
    return (
      <div className="min-h-screen p-6 bg-white text-center text-black">
        <h2 className="text-2xl font-semibold text-red-600">🔒 Please log in to view your cart.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">🛍️ Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-yellow-100 to-pink-100 p-4 rounded shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 object-contain mx-auto mb-2"
                />
                <h3 className="text-lg font-semibold text-center">{item.name}</h3>
                <p className="text-green-700 text-center font-bold">{item.price}</p>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="mt-3 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xl font-semibold text-indigo-700">
              Total: Rs. {total.toLocaleString()}
            </p>
            <button
              onClick={() => navigate('/checkout')}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

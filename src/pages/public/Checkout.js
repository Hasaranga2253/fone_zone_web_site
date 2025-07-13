import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(stored);
  }, []);

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.-]/g, '')) || 0;
    return sum + price;
  }, 0);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      toast.info("ℹ️ Please login to place an order.");
      navigate('/');
      return;
    }

    const allOrders = JSON.parse(localStorage.getItem('userOrders')) || [];

    const newOrder = {
      id: Date.now(),
      user: currentUser.email,
      items: cartItems,
      total: `Rs. ${total.toLocaleString()}`,
      status: 'Pending',
    };

    localStorage.setItem('userOrders', JSON.stringify([...allOrders, newOrder]));
    localStorage.removeItem('cart');

    toast.success("✅ Order placed successfully!");
    navigate('/user/dashboard');
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">🧾 Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">No items in cart.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <li key={item.id} className="border p-4 rounded shadow">
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-green-700 font-semibold">{item.price}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-xl font-semibold text-center text-indigo-700 mb-4">
            Total: Rs. {total.toLocaleString()}
          </div>

          <button
            onClick={handlePlaceOrder}
            className="block w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;

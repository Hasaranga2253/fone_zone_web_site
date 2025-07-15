import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiSearch } from 'react-icons/fi';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [products, setProducts] = useState([]);

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Hooks ALWAYS on top
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(stored);
  }, []);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setFilteredResults([]);
      return;
    }

    const results = products.filter(product =>
      product.name.toLowerCase().includes(trimmed)
    );
    setFilteredResults(results);
  }, [query, products]);

  const handleSearch = () => {
    if (filteredResults.length > 0 && currentUser) {
      navigate(`/shop#${filteredResults[0].id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClickResult = (item) => {
    if (currentUser) {
      setQuery(item.name);
      navigate(`/shop#${item.id}`);
    }
  };

  // ✅ Conditional rendering happens AFTER hooks
  const shouldRender = currentUser && location.pathname === '/shop';
  if (!shouldRender) return null;

  return (
    <div className="relative z-50 w-full flex flex-col items-center my-4">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search for phones..."
          className="w-full px-4 py-2 rounded-lg shadow border border-gray-300 text-black pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-2 text-gray-600 hover:text-blue-600"
        >
          <FiSearch size={20} />
        </button>
      </div>

      {query && (
        <div className="absolute top-[58px] w-full max-w-md bg-white border border-gray-300 rounded shadow-md text-black max-h-60 overflow-y-auto">
          {filteredResults.length > 0 ? (
            filteredResults.map((item, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleClickResult(item)}
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              No matching phones found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;

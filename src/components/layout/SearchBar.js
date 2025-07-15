import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiSearch } from 'react-icons/fi';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [products, setProducts] = useState([]);
  const wrapperRef = useRef(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(stored);
  }, []);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setFilteredResults([]);
      setHighlightedIndex(-1);
      return;
    }

    const results = products.filter(p =>
      p.name.toLowerCase().includes(trimmed)
    );
    setFilteredResults(results);
    setHighlightedIndex(0);
  }, [query, products]);

  const handleSearch = () => {
    if (filteredResults.length > 0 && currentUser) {
      const target = filteredResults[highlightedIndex] || filteredResults[0];
      setQuery(target.name);               // ✅ Set selected name
      setFilteredResults([]);              // ✅ Hide dropdown
      navigate(`/shop#${target.id}`);      // ✅ Navigate
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev > 0 ? prev - 1 : filteredResults.length - 1
      );
    } else if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClickResult = (item) => {
    setQuery(item.name);
    setFilteredResults([]);                // ✅ Hide dropdown on click
    navigate(`/shop#${item.id}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFilteredResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative w-fit z-50" ref={wrapperRef}>
      <div className="relative w-44 sm:w-60">
        <input
          type="text"
          placeholder="Search phones..."
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md text-black pr-9 shadow focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1.5 text-gray-600 hover:text-cyan-600"
        >
          <FiSearch size={18} />
        </button>
      </div>

      {query && filteredResults.length > 0 && (
        <div className="absolute top-11 w-full bg-white border border-gray-300 rounded shadow-lg text-black max-h-60 overflow-y-auto">
          {filteredResults.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer ${
                index === highlightedIndex
                  ? 'bg-cyan-100 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleClickResult(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;

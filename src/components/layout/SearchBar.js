import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiSearch } from 'react-icons/fi';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const abortRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost';
  const SEARCH_API = `${API_BASE}/Fonezone/search_products.php`;

  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const loadResults = useCallback(() => {
    if (!currentUser || !debouncedQuery) {
      setResults([]);
      setOpen(false);
      setErr(null);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const url = new URL(SEARCH_API);
        url.searchParams.set('q', debouncedQuery);
        url.searchParams.set('limit', '10');

        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: { Accept: 'application/json' },
          credentials: 'include',
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const items = Array.isArray(data.items) ? data.items : [];
        setResults(items);
        setHighlightedIndex(items.length ? 0 : -1);
        setOpen(true);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setErr(e.message || 'Search failed');
          setResults([]);
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [SEARCH_API, debouncedQuery, currentUser]);

  useEffect(loadResults, [loadResults]);

  const closeList = () => {
    setOpen(false);
    setHighlightedIndex(-1);
  };

  const goToShopWithName = (name) => {
    const q = encodeURIComponent(name || '');
    navigate(`/shop?q=${q}`);
  };

  const handleSearch = () => {
    if (!results.length) return;
    const target = results[highlightedIndex] || results[0];
    setQuery(target.name);
    goToShopWithName(target.name);
    closeList();
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (results.length ? (prev + 1) % results.length : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (results.length ? (prev - 1 + results.length) % results.length : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      closeList();
    }
  };

  const handleClickResult = (item, index) => {
    setHighlightedIndex(index);
    setQuery(item.name);
    goToShopWithName(item.name);
    closeList();
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        closeList();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  if (!currentUser) return null;

  const listboxId = 'search-results';
  const expanded = open && (loading || err || results.length > 0);

  return (
    <div className="relative w-fit z-50" ref={wrapperRef}>
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={!!expanded}
        className="relative w-44 sm:w-60"
      >
        <input
          type="text"
          role="searchbox"
          placeholder="Search phones..."
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md text-black pr-9 shadow focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-activedescendant={highlightedIndex >= 0 ? `search-opt-${highlightedIndex}` : undefined}
          autoComplete="off"
        />

        <button
          onClick={handleSearch}
          className="absolute right-2 top-1.5 text-gray-600 hover:text-cyan-600"
          aria-label="Search"
          type="button"
        >
          <FiSearch size={18} />
        </button>
      </div>

      {expanded && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-11 w-full bg-white border border-gray-300 rounded shadow-lg text-black max-h-60 overflow-y-auto"
        >
          {loading && <div className="px-4 py-2 text-gray-500 text-sm">Searching…</div>}
          {err && !loading && <div className="px-4 py-2 text-red-600 text-sm">{err}</div>}

          {!loading && !err && results.map((item, index) => (
            <div
              id={`search-opt-${index}`}
              key={item.id}
              role="option"
              aria-selected={index === highlightedIndex}
              className={`px-4 py-2 cursor-pointer ${
                index === highlightedIndex ? 'bg-cyan-100 font-semibold' : 'hover:bg-gray-100'
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleClickResult(item, index)}
            >
              {item.name}
            </div>
          ))}

          {!loading && !err && results.length === 0 && (
            <div className="px-4 py-2 text-gray-500 text-sm">No matches</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;

// src/components/layout/SearchBar.js
import React from 'react';

function SearchBar() {
  return (
    <div className="w-full flex justify-center my-4">
      <input
        type="text"
        placeholder="Search for phones..."
        className="w-full max-w-md px-4 py-2 rounded-lg shadow border border-gray-300 text-black"
      />
    </div>
  );
}

export default SearchBar;

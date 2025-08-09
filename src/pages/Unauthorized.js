// src/pages/Unauthorized.js

import React from 'react';

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-red-50 p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">401 Unauthorized</h1>
        <p className="text-lg text-gray-700 mb-6">
          Sorry, you are not authorized to view this page.
        </p>
        <a href="/" className="text-blue-600 underline hover:text-blue-800">
          Go back Home
        </a>
      </div>
    </div>
  );
}

export default Unauthorized;

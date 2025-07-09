import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function LoadingSpinner({ loading = true, size = 50, color = '#36d7b7' }) {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <ClipLoader loading={loading} size={size} color={color} />
    </div>
  );
}

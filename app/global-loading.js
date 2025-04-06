"use client";

import { useEffect, useState } from "react";

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app loading for demonstration purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/80 backdrop-blur-md">
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mb-4"></div>
        <p className="text-white text-xl">Loading...</p>
      </div>
    </div>
  );
} 
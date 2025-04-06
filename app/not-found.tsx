"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white">
      <div className="text-center p-8 rounded-lg bg-indigo-900/30 backdrop-blur-md border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl mb-8">The page you are looking for does not exist.</p>
        <Link href="/">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 rounded-lg text-lg shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
} 
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AuthButton } from '@/components/auth-button';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="border-b border-gray-800 bg-black px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
          BezaSpace
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            href="/browse-projects"
            className="text-gray-300 hover:text-white transition-colors font-medium"
          >
            Browse Projects
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-400 hidden sm:block">
              Welcome, {user.displayName}
            </span>
          )}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { LoadingSpinner } from './loading-spinner';

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

  const handleSignIn = async () => {
    setActionLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    setActionLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white">Welcome, {user.displayName}</span>
        <button
          onClick={handleSignOut}
          disabled={actionLoading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          {actionLoading && <LoadingSpinner />}
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={actionLoading}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-2"
    >
      {actionLoading && <LoadingSpinner />}
      Sign In with Google
    </button>
  );
}
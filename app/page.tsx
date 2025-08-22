'use client';

import { useAuth } from '@/lib/auth-context';
import { AuthButton } from '@/components/auth-button';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <header className="mb-8 w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-4xl font-bold">Welcome to BezaSpace</h1>
        <AuthButton />
      </header>
      <main className="text-center flex-1 flex flex-col justify-center">
        {user ? (
          <>
            <p className="text-lg mb-4">Hello, {user.displayName}! You&apos;re successfully signed in.</p>
            <p className="text-sm text-gray-400">Your dashboard is ready. Start building!</p>
          </>
        ) : (
          <>
            <p className="text-lg mb-4">Create projects and connect with like-minded people.</p>
            <p className="text-sm text-gray-400">Please sign in to access your dashboard.</p>
          </>
        )}
      </main>
    </div>
  );
}

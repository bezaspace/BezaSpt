'use client';

import Link from 'next/link';
import { UserSearchResult } from '@/lib/types';

interface UserCardProps {
  user: UserSearchResult;
  onClick?: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Link
      href={`/users/${user.uid}`}
      onClick={onClick}
      className="block px-4 py-3 hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{user.displayName}</p>
          {user.username && (
            <p className="text-gray-400 text-sm truncate">@{user.username}</p>
          )}
          {user.bio && (
            <p className="text-gray-500 text-xs truncate">{user.bio}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
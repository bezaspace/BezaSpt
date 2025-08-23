'use client';

import { UserProfile as UserProfileType } from '@/lib/types';
import { UserProjectsList } from '@/components/user-projects-list';

interface UserProfileProps {
  userProfile: UserProfileType;
}

export function UserProfile({ userProfile }: UserProfileProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {userProfile.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {userProfile.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{userProfile.displayName}</h1>
              {userProfile.username && (
                <p className="text-gray-400 text-lg mb-2">@{userProfile.username}</p>
              )}
              <p className="text-gray-400">{userProfile.email}</p>
              {userProfile.bio && (
                <p className="text-gray-300 mt-4 max-w-2xl">{userProfile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Projects by {userProfile.displayName}</h2>
          <UserProjectsList userId={userProfile.uid} />
        </div>
      </div>
    </div>
  );
}
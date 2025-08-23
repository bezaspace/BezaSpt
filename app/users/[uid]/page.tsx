'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/user-firestore';
import { UserProfile } from '@/lib/types';
import { UserProfile as UserProfileComponent } from '@/components/user-profile';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function UserProfilePage() {
  const params = useParams();
  const uid = params.uid as string;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await getUserProfile(uid);
        if (profile) {
          setUserProfile(profile);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      loadUserProfile();
    }
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-gray-400">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <UserProfileComponent userProfile={userProfile} />;
}
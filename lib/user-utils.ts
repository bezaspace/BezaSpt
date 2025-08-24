import { getUserProfile } from './user-firestore';
import { UserSearchResult } from './types';

// Simple in-memory cache for user data
const userCache = new Map<string, UserSearchResult>();
const pendingRequests = new Map<string, Promise<UserSearchResult | null>>();

/**
 * Fetch user data by ID with caching to avoid multiple requests for the same user
 * @param uid User ID
 * @returns User data or null if not found
 */
export async function fetchUserById(uid: string): Promise<UserSearchResult | null> {
  // Check if we already have the user in cache
  if (userCache.has(uid)) {
    return userCache.get(uid)!;
  }

  // Check if we already have a pending request for this user
  if (pendingRequests.has(uid)) {
    return pendingRequests.get(uid)!;
  }

  // Create a new request
  const request = getUserProfile(uid).then(profile => {
    if (profile) {
      const userSearchResult: UserSearchResult = {
        uid: profile.uid,
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        username: profile.username,
        bio: profile.bio
      };
      
      // Cache the result
      userCache.set(uid, userSearchResult);
      return userSearchResult;
    }
    return null;
  }).finally(() => {
    // Remove the pending request when it's done
    pendingRequests.delete(uid);
  });

  // Store the pending request
  pendingRequests.set(uid, request);
  
  return request;
}

/**
 * Clear the user cache (useful for testing or when user data might have changed)
 */
export function clearUserCache() {
  userCache.clear();
  pendingRequests.clear();
}
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  limit,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, UserSearchResult } from './types';

const USERS_COLLECTION = 'users';

// Create or update user profile
export async function createOrUpdateUserProfile(
  uid: string,
  userData: {
    displayName: string;
    email: string;
    photoURL: string | null;
  }
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userRef);

    const now = Timestamp.now();

    if (userDoc.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL || null,
        updatedAt: now,
      });
    } else {
      // Create new profile
      const userProfile: UserProfile = {
        uid,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL || null,
        bio: null,
        username: null,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(userRef, userProfile);
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw new Error('Failed to create or update user profile');
  }
}

// Get user profile by ID
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: userDoc.id,
        displayName: data.displayName,
        email: data.email,
        photoURL: data.photoURL || null,
        bio: data.bio || null,
        username: data.username || null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to load user profile');
  }
}

// Update user profile
export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'username' | 'photoURL'>>
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);

    // Filter out undefined values and convert them to null for Firestore
    const cleanUpdates: Record<string, any> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    });

    await updateDoc(userRef, {
      ...cleanUpdates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

// Search users by display name or username
export async function searchUsers(searchTerm: string, maxResults: number = 10): Promise<UserSearchResult[]> {
  try {
    if (!searchTerm.trim()) {
      return [];
    }

    const searchTermLower = searchTerm.toLowerCase();

    // Search by display name (case-insensitive prefix match)
    const displayNameQuery = query(
      collection(db, USERS_COLLECTION),
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff'),
      limit(maxResults)
    );

    // Search by username if provided
    const usernameQuery = query(
      collection(db, USERS_COLLECTION),
      where('username', '>=', searchTermLower),
      where('username', '<=', searchTermLower + '\uf8ff'),
      limit(maxResults)
    );

    const [displayNameResults, usernameResults] = await Promise.all([
      getDocs(displayNameQuery),
      getDocs(usernameQuery)
    ]);

    // Combine and deduplicate results
    const resultsMap = new Map<string, UserSearchResult>();

    // Process display name results
    displayNameResults.docs.forEach(doc => {
      const data = doc.data();
      resultsMap.set(data.uid, {
        uid: data.uid,
        displayName: data.displayName,
        photoURL: data.photoURL || null,
        username: data.username || null,
        bio: data.bio || null,
      });
    });

    // Process username results
    usernameResults.docs.forEach(doc => {
      const data = doc.data();
      if (!resultsMap.has(data.uid)) {
        resultsMap.set(data.uid, {
          uid: data.uid,
          displayName: data.displayName,
          photoURL: data.photoURL || null,
          username: data.username || null,
          bio: data.bio || null,
        });
      }
    });

    return Array.from(resultsMap.values()).slice(0, maxResults);
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
}

// Get all users (for admin purposes)
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const q = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        displayName: data.displayName,
        email: data.email,
        photoURL: data.photoURL || null,
        bio: data.bio || null,
        username: data.username || null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as UserProfile;
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    throw new Error('Failed to load users');
  }
}
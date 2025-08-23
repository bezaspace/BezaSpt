import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  createdBy: string; // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'active' | 'completed' | 'archived';
  imageUrls?: string[]; // Array of Firebase Storage download URLs
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  bio: string | null;
  username: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserSearchResult {
  uid: string;
  displayName: string;
  photoURL: string | null;
  username: string | null;
  bio: string | null;
}

export interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  createProject: (data: ProjectFormData) => Promise<void>;
  updateProject: (id: string, data: Partial<ProjectFormData>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

export interface SearchContextType {
  searchQuery: string;
  searchResults: UserSearchResult[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}
import { Timestamp } from 'firebase/firestore';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number; // 0-100
}

export interface Resource {
  id: string;
  type: 'funding' | 'tools' | 'equipment' | 'other';
  name: string;
  description: string;
  amount?: number; // for funding
  status: 'available' | 'needed' | 'secured';
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Timestamp;
}

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

  // New detailed fields
  goals?: string[];
  outcomes?: string[];
  milestones?: Milestone[];
  roadmap?: Milestone[]; // Chronological order of things to be done
  peopleNeeded?: {
    roles: string[];
    count: number;
    skills: string[];
  };
  resources?: Resource[];
  location?: {
    type: 'remote' | 'onsite' | 'hybrid';
    address?: string;
    city?: string;
    country?: string;
  };
  progress?: {
    overall: number; // 0-100
    tasksCompleted: number;
    totalTasks: number;
    lastUpdated: Timestamp;
  };
  tasks?: ProjectTask[];
  technologies?: string[];
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  goals?: string[];
  outcomes?: string[];
  milestones?: Milestone[];
  roadmap?: Milestone[];
  peopleNeeded?: {
    roles: string[];
    count: number;
    skills: string[];
  };
  resources?: Resource[];
  location?: {
    type: 'remote' | 'onsite' | 'hybrid';
    address?: string;
    city?: string;
    country?: string;
  };
  tasks?: ProjectTask[];
  technologies?: string[];
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
  updateProjectProgress: (id: string, progress: Partial<Project['progress']>) => Promise<void>;
  addMilestone: (projectId: string, milestone: Omit<Milestone, 'id'>) => Promise<void>;
  updateMilestone: (projectId: string, milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  addTask: (projectId: string, task: Omit<ProjectTask, 'id'>) => Promise<void>;
  updateTask: (projectId: string, taskId: string, updates: Partial<ProjectTask>) => Promise<void>;
}

export interface SearchContextType {
  searchQuery: string;
  searchResults: UserSearchResult[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export interface ProjectSearchFilters {
  category?: string;
  technologies?: string[];
  location?: string;
  status?: string;
  skills?: string[];
  hasFunding?: boolean;
  remoteOnly?: boolean;
}
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

export interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  createProject: (data: ProjectFormData) => Promise<void>;
  updateProject: (id: string, data: Partial<ProjectFormData>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}
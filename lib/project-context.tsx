'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { Project, ProjectFormData, ProjectContextType } from './types';
import {
  subscribeToUserProjects,
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
  updateProjectProgress,
  addMilestone,
  updateMilestone,
  addTask,
  updateTask
} from './firestore';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserProjects(
      user.uid,
      (updatedProjects) => {
        setProjects(updatedProjects);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const createProject = async (data: ProjectFormData): Promise<void> => {
    if (!user) {
      throw new Error('You must be signed in to create a project');
    }

    try {
      setError(null);
      await createProjectService(user.uid, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProject = async (id: string, data: Partial<ProjectFormData>): Promise<void> => {
    try {
      setError(null);
      await updateProjectService(id, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      setError(null);
      await deleteProjectService(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProjectProgress = async (id: string, progress: Partial<Project['progress']>): Promise<void> => {
    try {
      setError(null);
      await updateProjectProgress(id, progress);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project progress';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addMilestone = async (projectId: string, milestone: any): Promise<void> => {
    try {
      setError(null);
      await addMilestone(projectId, milestone);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add milestone';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateMilestone = async (projectId: string, milestoneId: string, updates: any): Promise<void> => {
    try {
      setError(null);
      await updateMilestone(projectId, milestoneId, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update milestone';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addTask = async (projectId: string, task: any): Promise<void> => {
    try {
      setError(null);
      await addTask(projectId, task);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTask = async (projectId: string, taskId: string, updates: any): Promise<void> => {
    try {
      setError(null);
      await updateTask(projectId, taskId, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refreshProjects = async (): Promise<void> => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // The subscription will handle the refresh automatically
      // This is just to trigger a manual refresh if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh projects');
    } finally {
      setLoading(false);
    }
  };

  const value: ProjectContextType = {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
    updateProjectProgress,
    addMilestone,
    updateMilestone,
    addTask,
    updateTask,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
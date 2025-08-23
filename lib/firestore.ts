import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Project, ProjectFormData, Milestone, ProjectTask } from './types';

/**
 * Note: We're using in-memory sorting instead of Firestore's orderBy to avoid
 * composite index requirements. If you need more complex queries in the future,
 * consider creating composite indexes in the Firebase console or restructuring
 * your data model.
 */

const PROJECTS_COLLECTION = 'projects';

// Create a new project
export async function createProject(userId: string, data: ProjectFormData, imageUrls?: string[]): Promise<string> {
  try {
    const now = Timestamp.now();
    const projectData = {
      ...data,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      status: 'active' as const,
      ...(imageUrls && imageUrls.length > 0 && { imageUrls }),
    };

    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}

// Get all projects for a user
export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    // Use a simpler query that doesn't require composite index
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('createdBy', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));

    // Sort in memory instead of using orderBy
    return projects.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime; // Descending order
    });
  } catch (error) {
    console.error('Error getting projects:', error);
    throw new Error('Failed to load projects');
  }
}

// Update a project
export async function updateProject(projectId: string, data: Partial<ProjectFormData>): Promise<void> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}

// Delete a project
export async function deleteProject(projectId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}

// Subscribe to real-time project updates
export function subscribeToUserProjects(
  userId: string,
  callback: (projects: Project[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, PROJECTS_COLLECTION),
    where('createdBy', '==', userId)
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));

      // Sort in memory instead of using orderBy
      const sortedProjects = projects.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime; // Descending order
      });

      callback(sortedProjects);
    },
    (error) => {
      console.error('Error subscribing to projects:', error);
      onError?.(new Error('Failed to subscribe to projects'));
    }
  );
}

// Get all projects (for browse page)
export async function getAllProjects(): Promise<Project[]> {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION));

    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));

    // Sort in memory instead of using orderBy
    return projects.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime; // Descending order
    });
  } catch (error) {
    console.error('Error getting all projects:', error);
    throw new Error('Failed to load projects');
  }
}

// Subscribe to all projects (for browse page)
export function subscribeToAllProjects(
  callback: (projects: Project[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, PROJECTS_COLLECTION));

  return onSnapshot(
    q,
    (querySnapshot) => {
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));

      // Sort in memory instead of using orderBy
      const sortedProjects = projects.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime; // Descending order
      });

      callback(sortedProjects);
    },
    (error) => {
      console.error('Error subscribing to all projects:', error);
      onError?.(new Error('Failed to subscribe to projects'));
    }
  );
}

// Get a single project by ID
export async function getProjectById(projectId: string): Promise<Project | null> {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting project:', error);
    throw new Error('Failed to load project');
  }
}

// Update project progress
export async function updateProjectProgress(projectId: string, progress: Partial<Project['progress']>): Promise<void> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }

    const currentData = projectDoc.data() as Project;
    const currentProgress = currentData.progress || {
      overall: 0,
      tasksCompleted: 0,
      totalTasks: 0,
      lastUpdated: Timestamp.now()
    };

    const updatedProgress = {
      ...currentProgress,
      ...progress,
      lastUpdated: Timestamp.now()
    };

    await updateDoc(projectRef, {
      progress: updatedProgress,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating project progress:', error);
    throw new Error('Failed to update project progress');
  }
}

// Add milestone to project
export async function addMilestone(projectId: string, milestone: Omit<Milestone, 'id'>): Promise<string> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }

    const currentData = projectDoc.data() as Project;
    const currentMilestones = currentData.milestones || [];

    const newMilestone = {
      ...milestone,
      id: `milestone_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    };

    await updateDoc(projectRef, {
      milestones: [...currentMilestones, newMilestone],
      updatedAt: Timestamp.now(),
    });

    return newMilestone.id;
  } catch (error) {
    console.error('Error adding milestone:', error);
    throw new Error('Failed to add milestone');
  }
}

// Update milestone
export async function updateMilestone(projectId: string, milestoneId: string, updates: Partial<Milestone>): Promise<void> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }

    const currentData = projectDoc.data() as Project;
    const currentMilestones = currentData.milestones || [];

    const updatedMilestones = currentMilestones.map(milestone =>
      milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
    );

    await updateDoc(projectRef, {
      milestones: updatedMilestones,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw new Error('Failed to update milestone');
  }
}

// Add task to project
export async function addTask(projectId: string, task: Omit<ProjectTask, 'id'>): Promise<string> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }

    const currentData = projectDoc.data() as Project;
    const currentTasks = currentData.tasks || [];

    const newTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    };

    await updateDoc(projectRef, {
      tasks: [...currentTasks, newTask],
      updatedAt: Timestamp.now(),
    });

    return newTask.id;
  } catch (error) {
    console.error('Error adding task:', error);
    throw new Error('Failed to add task');
  }
}

// Update task
export async function updateTask(projectId: string, taskId: string, updates: Partial<ProjectTask>): Promise<void> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }

    const currentData = projectDoc.data() as Project;
    const currentTasks = currentData.tasks || [];

    const updatedTasks = currentTasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );

    // Update progress based on task completion
    const completedTasks = updatedTasks.filter(task => task.status === 'done').length;
    const totalTasks = updatedTasks.length;
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await updateDoc(projectRef, {
      tasks: updatedTasks,
      progress: {
        ...currentData.progress,
        overall: overallProgress,
        tasksCompleted: completedTasks,
        totalTasks,
        lastUpdated: Timestamp.now()
      },
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
}

// Search projects with filters
export async function searchProjects(filters: {
  category?: string;
  technologies?: string[];
  location?: string;
  status?: string;
  skills?: string[];
  hasFunding?: boolean;
  remoteOnly?: boolean;
  query?: string;
}): Promise<Project[]> {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION));
    const querySnapshot = await getDocs(q);
    let projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));

    // Apply filters
    if (filters.category) {
      projects = projects.filter(p => p.category === filters.category);
    }

    if (filters.technologies && filters.technologies.length > 0) {
      projects = projects.filter(p =>
        p.technologies?.some(tech =>
          filters.technologies!.some(filterTech =>
            tech.toLowerCase().includes(filterTech.toLowerCase())
          )
        )
      );
    }

    if (filters.location) {
      projects = projects.filter(p =>
        p.location?.city?.toLowerCase().includes(filters.location!.toLowerCase()) ||
        p.location?.country?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.status) {
      projects = projects.filter(p => p.status === filters.status);
    }

    if (filters.skills && filters.skills.length > 0) {
      projects = projects.filter(p =>
        p.peopleNeeded?.roles?.some((role: any) => {
          // Handle both old string format and new ProjectRole format
          if (typeof role === 'string') {
            return filters.skills!.some((filterSkill: string) =>
              role.toLowerCase().includes(filterSkill.toLowerCase())
            );
          } else {
            return role.skills?.some((skill: string) =>
              filters.skills!.some((filterSkill: string) =>
                skill.toLowerCase().includes(filterSkill.toLowerCase())
              )
            );
          }
        })
      );
    }

    if (filters.hasFunding) {
      projects = projects.filter(p =>
        p.resources?.some(resource => resource.type === 'funding')
      );
    }

    if (filters.remoteOnly) {
      projects = projects.filter(p => p.location?.type === 'remote');
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.technologies?.some(tech => tech.toLowerCase().includes(query)) ||
        p.goals?.some(goal => goal.toLowerCase().includes(query)) ||
        p.outcomes?.some(outcome => outcome.toLowerCase().includes(query))
      );
    }

    return projects.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error searching projects:', error);
    throw new Error('Failed to search projects');
  }
}
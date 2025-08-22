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
import { Project, ProjectFormData } from './types';

/**
 * Note: We're using in-memory sorting instead of Firestore's orderBy to avoid
 * composite index requirements. If you need more complex queries in the future,
 * consider creating composite indexes in the Firebase console or restructuring
 * your data model.
 */

const PROJECTS_COLLECTION = 'projects';

// Create a new project
export async function createProject(userId: string, data: ProjectFormData): Promise<string> {
  try {
    const now = Timestamp.now();
    const projectData = {
      ...data,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      status: 'active' as const,
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
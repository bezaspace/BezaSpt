'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/lib/types';
import { getUserProjects } from '@/lib/firestore';
import { ProjectCard } from '@/components/project-card';
import { LoadingSpinner } from '@/components/loading-spinner';

interface UserProjectsListProps {
  userId: string;
}

export function UserProjectsList({ userId }: UserProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const userProjects = await getUserProjects(userId);
        setProjects(userProjects);
      } catch (err) {
        console.error('Error loading user projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserProjects();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No projects found for this user.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
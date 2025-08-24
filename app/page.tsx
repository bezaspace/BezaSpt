'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useProjects } from '@/lib/project-context';
import { ProjectForm } from '@/components/project-form';
import { ProjectsList } from '@/components/projects-list';
import { CreateProjectButton } from '@/components/create-project-button';
import { ProjectProvider } from '@/lib/project-context';
import { Project } from '@/lib/types';


function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const { projects, loading: projectsLoading, error, updateProject, deleteProject } = useProjects();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <main className="text-center flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to BezaSpace</h1>
          <p className="text-lg mb-4">Create projects and connect with like-minded people.</p>
          <p className="text-sm text-gray-400">Please sign in to access your dashboard.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Your Project Dashboard</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Create projects, collaborate with others, and bring your ideas to life.
          </p>
           <div className="flex justify-center">
             <CreateProjectButton
               onClick={() => setShowProjectForm(true)}
               size="lg"
             />
           </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Projects Section */}
        <ProjectsList
          projects={projects}
          loading={projectsLoading}
          onCreateProject={() => setShowProjectForm(true)}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      </main>

      {/* Project Creation/Edit Form */}
      <ProjectForm
        project={editingProject}
        open={showProjectForm}
        onOpenChange={(open) => {
          setShowProjectForm(open);
          if (!open) {
            setEditingProject(null);
          }
        }}
        onSuccess={() => {
          // Projects will be updated automatically via real-time subscription
          setEditingProject(null);
        }}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProjectProvider>
      <DashboardContent />
    </ProjectProvider>
  );
}

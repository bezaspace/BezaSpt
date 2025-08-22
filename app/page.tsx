'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useProjects } from '@/lib/project-context';
import { AuthButton } from '@/components/auth-button';
import { ProjectForm } from '@/components/project-form';
import { ProjectsList } from '@/components/projects-list';
import { CreateProjectButton } from '@/components/create-project-button';
import { ProjectProvider } from '@/lib/project-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const { projects, loading: projectsLoading, error } = useProjects();
  const [showProjectForm, setShowProjectForm] = useState(false);

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
        <header className="mb-8 w-full max-w-4xl flex justify-between items-center">
          <h1 className="text-4xl font-bold">Welcome to BezaSpace</h1>
          <AuthButton />
        </header>
        <main className="text-center flex-1 flex flex-col justify-center">
          <p className="text-lg mb-4">Create projects and connect with like-minded people.</p>
          <p className="text-sm text-gray-400">Please sign in to access your dashboard.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">BezaSpace Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Welcome, {user.displayName}</span>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Your Project Dashboard</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Create projects, collaborate with others, and bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CreateProjectButton
              onClick={() => setShowProjectForm(true)}
              size="lg"
            />
            <Link href="/browse-projects">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Browse All Projects
              </Button>
            </Link>
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
        />
      </main>

      {/* Project Creation Form */}
      <ProjectForm
        open={showProjectForm}
        onOpenChange={setShowProjectForm}
        onSuccess={() => {
          // Projects will be updated automatically via real-time subscription
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

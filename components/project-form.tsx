'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProjectFormWizard } from './project-form-wizard';
import { Project } from '@/lib/types';

interface ProjectFormProps {
  project?: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProjectForm({ project, open, onOpenChange, onSuccess }: ProjectFormProps) {
  const isEditing = !!project;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-w-[90vw] bg-gray-900 border-gray-800 max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isEditing 
              ? 'Update your project details below.'
              : 'Follow the steps below to create your new project.'}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          <ProjectFormWizard
            project={project}
            onOpenChange={onOpenChange}
            onSuccess={onSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
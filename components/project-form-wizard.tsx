'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createProject } from '@/lib/firestore';
import { ProjectFormData } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { WizardNavigation } from './wizard-navigation';
import { Step1Basic } from './project-form-steps/step-1-basic';
import { Step2Goals } from './project-form-steps/step-2-goals';
import { Step3Outcomes } from './project-form-steps/step-3-outcomes';
import { Step4Technologies } from './project-form-steps/step-4-technologies';
import { Step5Roadmap } from './project-form-steps/step-5-roadmap';
import { Step6Team } from './project-form-steps/step-6-team';

interface ProjectFormWizardProps {
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const TOTAL_STEPS = 6;

export function ProjectFormWizard({ onOpenChange, onSuccess }: ProjectFormWizardProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    goals: [],
    outcomes: [],
    milestones: [],
    roadmap: [],
    peopleNeeded: {
      roles: [],
      count: 0
    },
    resources: [],
    location: {
      type: 'remote',
      address: '',
      city: '',
      country: ''
    },
    tasks: [],
    technologies: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper functions for managing arrays
  const addGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: [...(prev.goals || []), goal]
    }));
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: (prev.goals || []).filter((_, i) => i !== index)
    }));
  };

  const addOutcome = (outcome: string) => {
    setFormData(prev => ({
      ...prev,
      outcomes: [...(prev.outcomes || []), outcome]
    }));
  };

  const removeOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      outcomes: (prev.outcomes || []).filter((_, i) => i !== index)
    }));
  };

  const addTechnology = (technology: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: [...(prev.technologies || []), technology]
    }));
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: (prev.technologies || []).filter((_, i) => i !== index)
    }));
  };

  const addRoadmapItem = (title: string, description: string) => {
    const newMilestone = {
      id: `roadmap_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      title,
      description,
      dueDate: Timestamp.now(),
      status: 'pending' as const,
      progress: 0
    };

    setFormData(prev => ({
      ...prev,
      roadmap: [...(prev.roadmap || []), newMilestone]
    }));
  };

  const removeRoadmapItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roadmap: (prev.roadmap || []).filter((_, i) => i !== index)
    }));
  };



  const updateFormData = (updates: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    if (error) setError(null);
  };

  // Validation functions
  const validateStep1 = (): boolean => {
    return !!(formData.title.trim() && formData.description.trim() && formData.category);
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be signed in to create a project');
      return;
    }

    if (!validateStep1()) {
      setError('Please fill in all required fields');
      return;
    }

    if (currentStep !== TOTAL_STEPS) {
      setError('Please complete all steps before submitting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createProject(user.uid, formData);
      setFormData({
        title: '',
        description: '',
        category: '',
        goals: [],
        outcomes: [],
        milestones: [],
        roadmap: [],
        peopleNeeded: {
          roles: [],
          count: 0
        },
        resources: [],
        location: {
          type: 'remote',
          address: '',
          city: '',
          country: ''
        },
        tasks: [],
        technologies: []
      });
      setCurrentStep(1);
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Basic
            formData={formData}
            onUpdate={updateFormData}
            loading={loading}
          />
        );
      case 2:
        return (
          <Step2Goals
            formData={formData}
            onAddGoal={addGoal}
            onRemoveGoal={removeGoal}
            loading={loading}
          />
        );
      case 3:
        return (
          <Step3Outcomes
            formData={formData}
            onAddOutcome={addOutcome}
            onRemoveOutcome={removeOutcome}
            loading={loading}
          />
        );
      case 4:
        return (
          <Step4Technologies
            formData={formData}
            onAddTechnology={addTechnology}
            onRemoveTechnology={removeTechnology}
            loading={loading}
          />
        );
      case 5:
        return (
          <Step5Roadmap
            formData={formData}
            onAddRoadmapItem={addRoadmapItem}
            onRemoveRoadmapItem={removeRoadmapItem}
            loading={loading}
          />
        );
      case 6:
        return (
          <Step6Team
            formData={formData}
            onUpdate={updateFormData}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderCurrentStep()}

      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 p-3 rounded-lg">
          {error}
        </div>
      )}

      <WizardNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoNext={canGoNext()}
        canGoPrevious={currentStep > 1}
        isLastStep={currentStep === TOTAL_STEPS}
        isLoading={!!loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
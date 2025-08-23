'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createProject } from '@/lib/firestore';
import { ProjectFormData, Milestone } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingSpinner } from './loading-spinner';
import { X, Plus, Trash2 } from 'lucide-react';


interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PROJECT_CATEGORIES = [
  'Web Development',
  'Mobile App',
  'Data Science',
  'AI/ML',
  'Design',
  'Marketing',
  'Education',
  'Other'
];

export function ProjectForm({ open, onOpenChange, onSuccess }: ProjectFormProps) {
  const { user } = useAuth();
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
      count: 0,
      skills: []
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

  const [currentGoal, setCurrentGoal] = useState('');
  const [currentOutcome, setCurrentOutcome] = useState('');
  const [currentTechnology, setCurrentTechnology] = useState('');
  const [currentRoadmapTitle, setCurrentRoadmapTitle] = useState('');
  const [currentRoadmapDescription, setCurrentRoadmapDescription] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper functions for managing arrays
  const addGoal = () => {
    if (currentGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...(prev.goals || []), currentGoal.trim()]
      }));
      setCurrentGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: (prev.goals || []).filter((_, i) => i !== index)
    }));
  };

  const addOutcome = () => {
    if (currentOutcome.trim()) {
      setFormData(prev => ({
        ...prev,
        outcomes: [...(prev.outcomes || []), currentOutcome.trim()]
      }));
      setCurrentOutcome('');
    }
  };

  const removeOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      outcomes: (prev.outcomes || []).filter((_, i) => i !== index)
    }));
  };

  const addTechnology = () => {
    if (currentTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), currentTechnology.trim()]
      }));
      setCurrentTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: (prev.technologies || []).filter((_, i) => i !== index)
    }));
  };

  // Roadmap helper functions
  const addRoadmapItem = () => {
    if (currentRoadmapTitle.trim()) {
      const newMilestone: Milestone = {
        id: `roadmap_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        title: currentRoadmapTitle.trim(),
        description: currentRoadmapDescription.trim() || '',
        dueDate: Timestamp.now(),
        status: 'pending',
        progress: 0
      };

      setFormData(prev => ({
        ...prev,
        roadmap: [...(prev.roadmap || []), newMilestone]
      }));

      setCurrentRoadmapTitle('');
      setCurrentRoadmapDescription('');
    }
  };

  const removeRoadmapItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roadmap: (prev.roadmap || []).filter((_, i) => i !== index)
    }));
  };

  // Roles and skills helper functions
  const addRole = () => {
    if (currentRole.trim()) {
      setFormData(prev => ({
        ...prev,
        peopleNeeded: {
          ...prev.peopleNeeded!,
          roles: [...(prev.peopleNeeded?.roles || []), currentRole.trim()]
        }
      }));
      setCurrentRole('');
    }
  };

  const removeRole = (index: number) => {
    setFormData(prev => ({
      ...prev,
      peopleNeeded: {
        ...prev.peopleNeeded!,
        roles: (prev.peopleNeeded?.roles || []).filter((_, i) => i !== index)
      }
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        peopleNeeded: {
          ...prev.peopleNeeded!,
          skills: [...(prev.peopleNeeded?.skills || []), currentSkill.trim()]
        }
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      peopleNeeded: {
        ...prev.peopleNeeded!,
        skills: (prev.peopleNeeded?.skills || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be signed in to create a project');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      setError('Please fill in all required fields');
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
          count: 0,
          skills: []
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
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-w-[90vw] bg-gray-900 border-gray-800 max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Start your new project by filling in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Basic Information</h3>

              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-300">
                  Project Title *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter project title"
                  disabled={loading}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-300">
                  Category *
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {PROJECT_CATEGORIES.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-white hover:bg-gray-700 focus:bg-gray-700"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-300">
                  Description *
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project..."
                  rows={3}
                  disabled={loading}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                />
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Goals & Outcomes</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Project Goals</label>
                <div className="flex gap-2">
                  <Input
                    value={currentGoal}
                    onChange={(e) => setCurrentGoal(e.target.value)}
                    placeholder="Add a goal..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                  />
                  <Button type="button" onClick={addGoal} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.goals?.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                    <span className="text-gray-300 flex-1">{goal}</span>
                    <Button type="button" onClick={() => removeGoal(index)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Expected Outcomes</label>
                <div className="flex gap-2">
                  <Input
                    value={currentOutcome}
                    onChange={(e) => setCurrentOutcome(e.target.value)}
                    placeholder="Add an outcome..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
                  />
                  <Button type="button" onClick={addOutcome} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.outcomes?.map((outcome, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                    <span className="text-gray-300 flex-1">{outcome}</span>
                    <Button type="button" onClick={() => removeOutcome(index)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Technologies</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={currentTechnology}
                    onChange={(e) => setCurrentTechnology(e.target.value)}
                    placeholder="Add technology..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button type="button" onClick={addTechnology} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies?.map((tech, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-sm">
                      {tech}
                      <button type="button" onClick={() => removeTechnology(index)} className="text-red-400 hover:text-red-300">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Project Roadmap</h3>
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Input
                    value={currentRoadmapTitle}
                    onChange={(e) => setCurrentRoadmapTitle(e.target.value)}
                    placeholder="Roadmap step title..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <Textarea
                    value={currentRoadmapDescription}
                    onChange={(e) => setCurrentRoadmapDescription(e.target.value)}
                    placeholder="Step description (optional)..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    rows={2}
                  />
                </div>
                <Button type="button" onClick={addRoadmapItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Roadmap Step
                </Button>
                <div className="space-y-2">
                  {formData.roadmap?.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-2 bg-gray-800 p-3 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-white">{item.title}</div>
                        {item.description && (
                          <div className="text-sm text-gray-400 mt-1">{item.description}</div>
                        )}
                      </div>
                      <Button type="button" onClick={() => removeRoadmapItem(index)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* People Needed */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">People Needed</h3>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-300">Number of People</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.peopleNeeded?.count || 0}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    peopleNeeded: {
                      ...prev.peopleNeeded!,
                      count: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Roles Required</label>
                <div className="flex gap-2">
                  <Input
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="Add role..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                  />
                  <Button type="button" onClick={addRole} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.peopleNeeded?.roles?.map((role, index) => (
                    <div key={index} className="flex items-center gap-1 bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-sm">
                      {role}
                      <button type="button" onClick={() => removeRole(index)} className="text-red-400 hover:text-red-300">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Required Skills</label>
                <div className="flex gap-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Add skill..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.peopleNeeded?.skills?.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-green-900/30 text-green-300 px-2 py-1 rounded text-sm">
                      {skill}
                      <button type="button" onClick={() => removeSkill(index)} className="text-red-400 hover:text-red-300">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Location</h3>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-300">Work Type</label>
                <Select
                  value={formData.location?.type}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location!, type: value as 'remote' | 'onsite' | 'hybrid' }
                  }))}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="remote" className="text-white hover:bg-gray-700">Remote</SelectItem>
                    <SelectItem value="onsite" className="text-white hover:bg-gray-700">On-site</SelectItem>
                    <SelectItem value="hybrid" className="text-white hover:bg-gray-700">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.location?.type !== 'remote' && (
                <>
                  <Input
                    placeholder="City"
                    value={formData.location?.city || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location!, city: e.target.value }
                    }))}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <Input
                    placeholder="Country"
                    value={formData.location?.country || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location!, country: e.target.value }
                    }))}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </>
              )}
            </div>



            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 border-t border-gray-700 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
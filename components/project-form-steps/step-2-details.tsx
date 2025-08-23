'use client';

import { useState } from 'react';
import { ProjectFormData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';

interface Step2DetailsProps {
  formData: ProjectFormData;
  onAddGoal: (goal: string) => void;
  onRemoveGoal: (index: number) => void;
  onAddOutcome: (outcome: string) => void;
  onRemoveOutcome: (index: number) => void;
  onAddTechnology: (technology: string) => void;
  onRemoveTechnology: (index: number) => void;
  loading: boolean;
}

export function Step2Details({
  formData,
  onAddGoal,
  onRemoveGoal,
  onAddOutcome,
  onRemoveOutcome,
  onAddTechnology,
  onRemoveTechnology,
  loading
}: Step2DetailsProps) {
  const [currentGoal, setCurrentGoal] = useState('');
  const [currentOutcome, setCurrentOutcome] = useState('');
  const [currentTechnology, setCurrentTechnology] = useState('');

  const handleAddGoal = () => {
    if (currentGoal.trim()) {
      onAddGoal(currentGoal.trim());
      setCurrentGoal('');
    }
  };

  const handleAddOutcome = () => {
    if (currentOutcome.trim()) {
      onAddOutcome(currentOutcome.trim());
      setCurrentOutcome('');
    }
  };

  const handleAddTechnology = () => {
    if (currentTechnology.trim()) {
      onAddTechnology(currentTechnology.trim());
      setCurrentTechnology('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Project Details</h2>
        <p className="text-gray-400">Define your goals, expected outcomes, and technologies</p>
      </div>

      {/* Goals Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Goals</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              placeholder="Add a goal..."
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
              disabled={loading}
            />
            <Button type="button" onClick={handleAddGoal} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {formData.goals?.map((goal, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
              <span className="text-gray-300 flex-1">{goal}</span>
              <Button type="button" onClick={() => onRemoveGoal(index)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Outcomes Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Expected Outcomes</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={currentOutcome}
              onChange={(e) => setCurrentOutcome(e.target.value)}
              placeholder="Add an outcome..."
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
              disabled={loading}
            />
            <Button type="button" onClick={handleAddOutcome} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {formData.outcomes?.map((outcome, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
              <span className="text-gray-300 flex-1">{outcome}</span>
              <Button type="button" onClick={() => onRemoveOutcome(index)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Technologies</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={currentTechnology}
              onChange={(e) => setCurrentTechnology(e.target.value)}
              placeholder="Add technology..."
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
              disabled={loading}
            />
            <Button type="button" onClick={handleAddTechnology} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies?.map((tech, index) => (
              <div key={index} className="flex items-center gap-1 bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-sm">
                {tech}
                <button type="button" onClick={() => onRemoveTechnology(index)} className="text-red-400 hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
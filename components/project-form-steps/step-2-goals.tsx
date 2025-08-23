'use client';

import { useState } from 'react';
import { ProjectFormData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Step2GoalsProps {
  formData: ProjectFormData;
  onAddGoal: (goal: string) => void;
  onRemoveGoal: (index: number) => void;
  loading: boolean;
}

export function Step2Goals({
  formData,
  onAddGoal,
  onRemoveGoal,
  loading
}: Step2GoalsProps) {
  const [currentGoal, setCurrentGoal] = useState('');

  const handleAddGoal = () => {
    if (currentGoal.trim()) {
      onAddGoal(currentGoal.trim());
      setCurrentGoal('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Project Goals</h2>
        <p className="text-gray-400">Define the main objectives for your project</p>
      </div>

      {/* Goals Section */}
      <div className="space-y-4">
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
    </div>
  );
}
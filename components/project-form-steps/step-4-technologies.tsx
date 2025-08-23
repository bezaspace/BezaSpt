'use client';

import { useState } from 'react';
import { ProjectFormData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface Step4TechnologiesProps {
  formData: ProjectFormData;
  onAddTechnology: (technology: string) => void;
  onRemoveTechnology: (index: number) => void;
  loading: boolean;
}

export function Step4Technologies({
  formData,
  onAddTechnology,
  onRemoveTechnology,
  loading
}: Step4TechnologiesProps) {
  const [currentTechnology, setCurrentTechnology] = useState('');

  const handleAddTechnology = () => {
    if (currentTechnology.trim()) {
      onAddTechnology(currentTechnology.trim());
      setCurrentTechnology('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Technologies</h2>
        <p className="text-gray-400">Specify the technologies and tools you'll use</p>
      </div>

      {/* Technologies Section */}
      <div className="space-y-4">
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
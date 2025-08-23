'use client';

import { useState } from 'react';
import { ProjectFormData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Step3RoadmapProps {
  formData: ProjectFormData;
  onAddRoadmapItem: (title: string, description: string) => void;
  onRemoveRoadmapItem: (index: number) => void;
  loading: boolean;
}

export function Step3Roadmap({
  formData,
  onAddRoadmapItem,
  onRemoveRoadmapItem,
  loading
}: Step3RoadmapProps) {
  const [currentRoadmapTitle, setCurrentRoadmapTitle] = useState('');
  const [currentRoadmapDescription, setCurrentRoadmapDescription] = useState('');

  const handleAddRoadmapItem = () => {
    if (currentRoadmapTitle.trim()) {
      onAddRoadmapItem(currentRoadmapTitle.trim(), currentRoadmapDescription.trim());
      setCurrentRoadmapTitle('');
      setCurrentRoadmapDescription('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Project Roadmap</h2>
        <p className="text-gray-400">Plan the chronological steps for your project</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Input
            value={currentRoadmapTitle}
            onChange={(e) => setCurrentRoadmapTitle(e.target.value)}
            placeholder="Roadmap step title..."
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
            disabled={loading}
          />
          <Textarea
            value={currentRoadmapDescription}
            onChange={(e) => setCurrentRoadmapDescription(e.target.value)}
            placeholder="Step description (optional)..."
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
            rows={2}
            disabled={loading}
          />
        </div>
        <Button type="button" onClick={handleAddRoadmapItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
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
              <Button type="button" onClick={() => onRemoveRoadmapItem(index)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { ProjectFormData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Step3OutcomesProps {
  formData: ProjectFormData;
  onAddOutcome: (outcome: string) => void;
  onRemoveOutcome: (index: number) => void;
  loading: boolean;
}

export function Step3Outcomes({
  formData,
  onAddOutcome,
  onRemoveOutcome,
  loading
}: Step3OutcomesProps) {
  const [currentOutcome, setCurrentOutcome] = useState('');

  const handleAddOutcome = () => {
    if (currentOutcome.trim()) {
      onAddOutcome(currentOutcome.trim());
      setCurrentOutcome('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Expected Outcomes</h2>
        <p className="text-gray-400">Define what you hope to achieve with this project</p>
      </div>

      {/* Outcomes Section */}
      <div className="space-y-4">
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
    </div>
  );
}
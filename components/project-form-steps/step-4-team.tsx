'use client';

import { useState } from 'react';
import { ProjectFormData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface Step4TeamProps {
  formData: ProjectFormData;
  onUpdate: (updates: Partial<ProjectFormData>) => void;
  onAddRole: (role: string) => void;
  onRemoveRole: (index: number) => void;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (index: number) => void;
  loading: boolean;
}

export function Step4Team({
  formData,
  onUpdate,
  onAddRole,
  onRemoveRole,
  onAddSkill,
  onRemoveSkill,
  loading
}: Step4TeamProps) {
  const [currentRole, setCurrentRole] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAddRole = () => {
    if (currentRole.trim()) {
      onAddRole(currentRole.trim());
      setCurrentRole('');
    }
  };

  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      onAddSkill(currentSkill.trim());
      setCurrentSkill('');
    }
  };

  const handleLocationChange = (field: string, value: string) => {
    onUpdate({
      location: {
        ...formData.location!,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Team & Location</h2>
        <p className="text-gray-400">Define your team requirements and work preferences</p>
      </div>

      {/* People Needed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Team Requirements</h3>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-300">Number of People</label>
          <Input
            type="number"
            min="1"
            value={formData.peopleNeeded?.count || 0}
            onChange={(e) => onUpdate({
              peopleNeeded: {
                ...formData.peopleNeeded!,
                count: parseInt(e.target.value) || 0
              }
            })}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
            disabled={loading}
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
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
              disabled={loading}
            />
            <Button type="button" onClick={handleAddRole} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.peopleNeeded?.roles?.map((role, index) => (
              <div key={index} className="flex items-center gap-1 bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-sm">
                {role}
                <button type="button" onClick={() => onRemoveRole(index)} className="text-red-400 hover:text-red-300">
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
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              disabled={loading}
            />
            <Button type="button" onClick={handleAddSkill} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.peopleNeeded?.skills?.map((skill, index) => (
              <div key={index} className="flex items-center gap-1 bg-green-900/30 text-green-300 px-2 py-1 rounded text-sm">
                {skill}
                <button type="button" onClick={() => onRemoveSkill(index)} className="text-red-400 hover:text-red-300">
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
            onValueChange={(value) => handleLocationChange('type', value)}
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
              onChange={(e) => handleLocationChange('city', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
              disabled={loading}
            />
            <Input
              placeholder="Country"
              value={formData.location?.country || ''}
              onChange={(e) => handleLocationChange('country', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
              disabled={loading}
            />
          </>
        )}
      </div>
    </div>
  );
}
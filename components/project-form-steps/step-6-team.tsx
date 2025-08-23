'use client';

import { useState } from 'react';
import { ProjectFormData, ProjectRole } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, X as XIcon } from 'lucide-react';

interface Step6TeamProps {
  formData: ProjectFormData;
  onUpdate: (updates: Partial<ProjectFormData>) => void;
  loading: boolean;
}

export function Step6Team({
  formData,
  onUpdate,
  loading
}: Step6TeamProps) {
  const [currentRoleName, setCurrentRoleName] = useState('');

  const [currentResponsibility, setCurrentResponsibility] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentContribution, setCurrentContribution] = useState('');

  const handleAddRole = () => {
    if (currentRoleName.trim()) {
      const newRole: ProjectRole = {
        id: `role_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        name: currentRoleName.trim(),
        responsibilities: [],
        skills: [],
        contributions: []
      };

      onUpdate({
        peopleNeeded: {
          ...formData.peopleNeeded!,
          roles: [...(formData.peopleNeeded?.roles || []), newRole]
        }
      });
      setCurrentRoleName('');
    }
  };

  const handleRemoveRole = (roleId: string) => {
    onUpdate({
      peopleNeeded: {
        ...formData.peopleNeeded!,
        roles: (formData.peopleNeeded?.roles || []).filter(role => role.id !== roleId)
      }
    });
  };

  const handleAddResponsibility = (roleId: string) => {
    if (currentResponsibility.trim()) {
      const updatedRoles = (formData.peopleNeeded?.roles || []).map(role => {
        if (role.id === roleId) {
          return {
            ...role,
            responsibilities: [...role.responsibilities, currentResponsibility.trim()]
          };
        }
        return role;
      });

      onUpdate({
        peopleNeeded: {
          ...formData.peopleNeeded!,
          roles: updatedRoles
        }
      });
      setCurrentResponsibility('');
    }
  };

  const handleRemoveResponsibility = (roleId: string, index: number) => {
    const updatedRoles = (formData.peopleNeeded?.roles || []).map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          responsibilities: role.responsibilities.filter((_, i) => i !== index)
        };
      }
      return role;
    });

    onUpdate({
      peopleNeeded: {
        ...formData.peopleNeeded!,
        roles: updatedRoles
      }
    });
  };

  const handleAddSkill = (roleId: string) => {
    if (currentSkill.trim()) {
      const updatedRoles = (formData.peopleNeeded?.roles || []).map(role => {
        if (role.id === roleId) {
          return {
            ...role,
            skills: [...role.skills, currentSkill.trim()]
          };
        }
        return role;
      });

      onUpdate({
        peopleNeeded: {
          ...formData.peopleNeeded!,
          roles: updatedRoles
        }
      });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (roleId: string, index: number) => {
    const updatedRoles = (formData.peopleNeeded?.roles || []).map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          skills: role.skills.filter((_, i) => i !== index)
        };
      }
      return role;
    });

    onUpdate({
      peopleNeeded: {
        ...formData.peopleNeeded!,
        roles: updatedRoles
      }
    });
  };

  const handleAddContribution = (roleId: string) => {
    if (currentContribution.trim()) {
      const updatedRoles = (formData.peopleNeeded?.roles || []).map(role => {
        if (role.id === roleId) {
          return {
            ...role,
            contributions: [...role.contributions, currentContribution.trim()]
          };
        }
        return role;
      });

      onUpdate({
        peopleNeeded: {
          ...formData.peopleNeeded!,
          roles: updatedRoles
        }
      });
      setCurrentContribution('');
    }
  };

  const handleRemoveContribution = (roleId: string, index: number) => {
    const updatedRoles = (formData.peopleNeeded?.roles || []).map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          contributions: role.contributions.filter((_, i) => i !== index)
        };
      }
      return role;
    });

    onUpdate({
      peopleNeeded: {
        ...formData.peopleNeeded!,
        roles: updatedRoles
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Team Roles</h2>
        <p className="text-gray-400">Define the roles needed for your project</p>
      </div>

      {/* Add Role */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={currentRoleName}
            onChange={(e) => setCurrentRoleName(e.target.value)}
            placeholder="Add a role name..."
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
            disabled={loading}
          />
          <Button type="button" onClick={handleAddRole} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {formData.peopleNeeded?.roles?.map((role) => (
          <div key={role.id} className="bg-gray-800/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{role.name}</h3>
              <Button
                type="button"
                onClick={() => handleRemoveRole(role.id)}
                size="sm"
                variant="ghost"
                className="text-red-400 hover:text-red-300"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">What they must do:</h4>
              <div className="flex gap-2">
                <Input
                  value={currentResponsibility}
                  onChange={(e) => setCurrentResponsibility(e.target.value)}
                  placeholder="Add responsibility..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResponsibility(role.id))}
                  disabled={loading}
                />
                <Button
                  type="button"
                  onClick={() => handleAddResponsibility(role.id)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-center gap-1 bg-green-900/30 text-green-300 px-2 py-1 rounded text-sm">
                    {responsibility}
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(role.id, index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Required skills:</h4>
              <div className="flex gap-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Add skill..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(role.id))}
                  disabled={loading}
                />
                <Button
                  type="button"
                  onClick={() => handleAddSkill(role.id)}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1 bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-sm">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(role.id, index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contributions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">What they bring to the table:</h4>
              <div className="flex gap-2">
                <Input
                  value={currentContribution}
                  onChange={(e) => setCurrentContribution(e.target.value)}
                  placeholder="Add contribution..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddContribution(role.id))}
                  disabled={loading}
                />
                <Button
                  type="button"
                  onClick={() => handleAddContribution(role.id)}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.contributions.map((contribution, index) => (
                  <div key={index} className="flex items-center gap-1 bg-orange-900/30 text-orange-300 px-2 py-1 rounded text-sm">
                    {contribution}
                    <button
                      type="button"
                      onClick={() => handleRemoveContribution(role.id, index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
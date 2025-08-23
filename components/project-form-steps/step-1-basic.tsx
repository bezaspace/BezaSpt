'use client';

import { ProjectFormData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step1BasicProps {
  formData: ProjectFormData;
  onUpdate: (updates: Partial<ProjectFormData>) => void;
  loading: boolean;
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

export function Step1Basic({ formData, onUpdate, loading }: Step1BasicProps) {
  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Basic Information</h2>
        <p className="text-gray-400">Let's start with the fundamentals of your project</p>
      </div>

      <div className="space-y-4">
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
            rows={4}
            disabled={loading}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, DollarSign, Wrench, Package, HelpCircle } from 'lucide-react';
import { Resource } from '@/lib/types';

interface ResourceManagerProps {
  resources: Resource[];
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onUpdateResource: (id: string, updates: Partial<Resource>) => void;
  onDeleteResource: (id: string) => void;
}

export function ResourceManager({
  resources,
  onAddResource,
  onUpdateResource,
  onDeleteResource
}: ResourceManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'tools' as 'funding' | 'tools' | 'equipment' | 'other',
    name: '',
    description: '',
    amount: 0,
    status: 'needed' as 'available' | 'needed' | 'secured'
  });

  const resetForm = () => {
    setFormData({
      type: 'tools',
      name: '',
      description: '',
      amount: 0,
      status: 'needed'
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      onUpdateResource(editingId, formData);
    } else {
      onAddResource(formData);
    }
    resetForm();
  };

  const startEdit = (resource: Resource) => {
    setFormData({
      type: resource.type,
      name: resource.name,
      description: resource.description,
      amount: resource.amount || 0,
      status: resource.status
    });
    setEditingId(resource.id);
    setIsAdding(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'funding':
        return <DollarSign className="h-4 w-4" />;
      case 'tools':
        return <Wrench className="h-4 w-4" />;
      case 'equipment':
        return <Package className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'funding':
        return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'tools':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'equipment':
        return 'bg-purple-600/20 text-purple-400 border-purple-600/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secured':
        return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'available':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'needed':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Resources</CardTitle>
            <CardDescription className="text-gray-400">
              Manage project resources and funding
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="funding" className="text-white">Funding</SelectItem>
                      <SelectItem value="tools" className="text-white">Tools</SelectItem>
                      <SelectItem value="equipment" className="text-white">Equipment</SelectItem>
                      <SelectItem value="other" className="text-white">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="needed" className="text-white">Needed</SelectItem>
                      <SelectItem value="available" className="text-white">Available</SelectItem>
                      <SelectItem value="secured" className="text-white">Secured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Input
                placeholder="Resource name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="bg-gray-700 border-gray-600 text-white"
              />
              {formData.type === 'funding' && (
                <Input
                  type="number"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              )}
              <div className="flex gap-2">
                <Button onClick={handleSubmit} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Update' : 'Add'} Resource
                </Button>
                <Button onClick={resetForm} variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {resources.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No resources added yet</p>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(resource.type)}`}>
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-white font-medium">{resource.name}</h4>
                      {resource.description && (
                        <p className="text-gray-400 text-sm">{resource.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => startEdit(resource)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => onDeleteResource(resource.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`text-xs ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </Badge>
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </Badge>
                    {resource.amount && resource.amount > 0 && (
                      <Badge variant="secondary" className="text-xs bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                        ${resource.amount.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
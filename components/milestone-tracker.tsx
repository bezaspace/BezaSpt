'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Milestone } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onUpdateMilestone: (id: string, updates: Partial<Milestone>) => void;
  onDeleteMilestone: (id: string) => void;
}

export function MilestoneTracker({
  milestones,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone
}: MilestoneTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: Timestamp.now(),
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    progress: 0
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: Timestamp.now(),
      status: 'pending',
      progress: 0
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingId) {
      onUpdateMilestone(editingId, formData);
    } else {
      onAddMilestone(formData);
    }
    resetForm();
  };

  const startEdit = (milestone: Milestone) => {
    setFormData({
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate,
      status: milestone.status,
      progress: milestone.progress
    });
    setEditingId(milestone.id);
    setIsAdding(true);
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Milestones</CardTitle>
            <CardDescription className="text-gray-400">
              Track project milestones and progress
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 space-y-4">
              <Input
                placeholder="Milestone title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="pending" className="text-white">Pending</SelectItem>
                      <SelectItem value="in-progress" className="text-white">In Progress</SelectItem>
                      <SelectItem value="completed" className="text-white">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Progress (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Update' : 'Add'} Milestone
                </Button>
                <Button onClick={resetForm} variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {milestones.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No milestones added yet</p>
          ) : (
            milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(milestone.status)}`}>
                  {getStatusIcon(milestone.status)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="text-white font-medium">{milestone.title}</h4>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => startEdit(milestone)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => onDeleteMilestone(milestone.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {milestone.description && (
                    <p className="text-gray-400 text-sm">{milestone.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {formatDate(milestone.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {milestone.progress}%
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          milestone.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                          milestone.status === 'in-progress' ? 'bg-blue-600/20 text-blue-400' :
                          'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {milestone.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${milestone.progress}%` }}
                    />
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
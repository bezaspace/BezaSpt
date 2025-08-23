'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { TrendingUp, Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProgressIndicatorProps {
  project: Project;
}

export function ProgressIndicator({ project }: ProgressIndicatorProps) {
  const progress = project.progress || {
    overall: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    lastUpdated: project.updatedAt
  };

  const milestones = project.milestones || [];
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;

  const tasks = project.tasks || [];
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'todo').length;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Project Progress
        </CardTitle>
        <CardDescription className="text-gray-400">
          Overall project completion and milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Overall Progress</h4>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
              {progress.overall}%
            </Badge>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress.overall)}`}
              style={{ width: `${progress.overall}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            Last updated: {formatDate(progress.lastUpdated)}
          </p>
        </div>

        {/* Tasks Progress */}
        {tasks.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Tasks Progress
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{inProgressTasks}</div>
                <div className="text-xs text-gray-400">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{pendingTasks}</div>
                <div className="text-xs text-gray-400">Pending</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {completedTasks} of {tasks.length} tasks completed
            </div>
          </div>
        )}

        {/* Milestones Progress */}
        {milestones.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Milestones Progress
            </h4>
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.status === 'completed' ? 'bg-green-600' :
                    milestone.status === 'in-progress' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle className="h-3 w-3 text-white" />
                    ) : milestone.status === 'in-progress' ? (
                      <Clock className="h-3 w-3 text-white" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">{milestone.title}</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          milestone.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                          milestone.status === 'in-progress' ? 'bg-blue-600/20 text-blue-400' :
                          'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {milestone.progress}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              {completedMilestones} of {totalMilestones} milestones completed
            </div>
          </div>
        )}

        {/* Goals Summary */}
        {project.goals && project.goals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals Summary
            </h4>
            <div className="text-sm text-gray-400">
              {project.goals.length} project goals defined
            </div>
            <div className="text-xs text-gray-500">
              {project.goals[0]}
              {project.goals.length > 1 && ` + ${project.goals.length - 1} more`}
            </div>
          </div>
        )}

        {/* Resources Summary */}
        {project.resources && project.resources.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Resources Status</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-400">
                  {project.resources.filter(r => r.status === 'secured').length}
                </div>
                <div className="text-xs text-gray-400">Secured</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-400">
                  {project.resources.filter(r => r.status === 'available').length}
                </div>
                <div className="text-xs text-gray-400">Available</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-400">
                  {project.resources.filter(r => r.status === 'needed').length}
                </div>
                <div className="text-xs text-gray-400">Needed</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
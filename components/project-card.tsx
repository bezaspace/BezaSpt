'use client';

import { Project } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, MapPin, Code, Target, TrendingUp, User } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onClick?: (project: Project) => void;
  clickable?: boolean;
}

export function ProjectCard({ project, onEdit, onDelete, onClick, clickable = false }: ProjectCardProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleClick = () => {
    if (clickable && onClick) {
      onClick(project);
    }
  };

  return (
    <Card
      className={`h-full bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors ${
        clickable ? 'cursor-pointer hover:bg-gray-800/50' : ''
      }`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-white text-lg line-clamp-2 font-semibold">
              {project.title}
            </CardTitle>
            <Badge
              variant="secondary"
              className="text-xs bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/30"
            >
              {project.category}
            </Badge>
          </div>
          {!clickable && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.imageUrls && project.imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {project.imageUrls.slice(0, 2).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${project.title} image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-700"
              />
            ))}
            {project.imageUrls.length > 2 && (
              <div className="relative">
                <img
                  src={project.imageUrls[2]}
                  alt={`${project.title} image 3`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-700"
                />
                {project.imageUrls.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      +{project.imageUrls.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <CardDescription className="text-gray-400 line-clamp-3 leading-relaxed">
          {project.description}
        </CardDescription>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Code className="h-3 w-3" />
              <span>Technologies</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-blue-600/20 text-blue-400 border-blue-600/30"
                >
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-600/20 text-gray-400 border-gray-600/30"
                >
                  +{project.technologies.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {project.location && project.location.type && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span className="capitalize">{project.location.type}</span>
            {project.location.city && (
              <span className="text-gray-400">• {project.location.city}</span>
            )}
          </div>
        )}

        {/* Goals */}
        {project.goals && project.goals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Target className="h-3 w-3" />
              <span>Goals ({project.goals.length})</span>
            </div>
            <div className="text-xs text-gray-400 line-clamp-2">
              {project.goals[0]}
              {project.goals.length > 1 && ` + ${project.goals.length - 1} more`}
            </div>
          </div>
        )}

        {/* Roadmap Preview */}
        {project.roadmap && project.roadmap.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Target className="h-3 w-3" />
              <span>Roadmap ({project.roadmap.length} steps)</span>
            </div>
            <div className="text-xs text-gray-400 line-clamp-1">
              {project.roadmap[0]?.title}
              {project.roadmap.length > 1 && ` + ${project.roadmap.length - 1} more`}
            </div>
          </div>
        )}

        {/* People Needed Preview */}
        {project.peopleNeeded && project.peopleNeeded.roles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>Needs {project.peopleNeeded.count} people</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {project.peopleNeeded.roles.slice(0, 2).map((role, index) => {
                // Handle both old string format and new ProjectRole format
                const roleName = typeof role === 'string' ? role : role.name;
                const roleKey = typeof role === 'string' ? index : role.id;

                return (
                  <Badge
                    key={roleKey}
                    variant="secondary"
                    className="text-xs bg-purple-600/20 text-purple-400 border-purple-600/30"
                  >
                    {roleName}
                  </Badge>
                );
              })}
              {project.peopleNeeded.roles.length > 2 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-600/20 text-gray-400 border-gray-600/30"
                >
                  +{project.peopleNeeded.roles.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Progress */}
        {project.progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>Progress</span>
              </div>
              <span>{project.progress.overall}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${project.progress.overall}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
            <span className="capitalize text-gray-400">{project.status}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(project.id)}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Project } from '@/lib/types';
import { getProjectById } from '@/lib/firestore';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Tag, Edit, Trash2, Target, MapPin, Code, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setError('Invalid project ID');
      setLoading(false);
      return;
    }

    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectData = await getProjectById(id);

        if (!projectData) {
          setError('Project not found');
        } else {
          setProject(projectData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const isOwner = user && project && user.uid === project.createdBy;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="max-w-4xl mx-auto px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">
              {error || 'Project not found'}
            </h1>
            <p className="text-gray-400 mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/browse-projects">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse All Projects
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-4xl mx-auto px-8 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-white">{project.title}</h1>
              <div className="flex items-center gap-4">
                <Badge
                  variant="secondary"
                  className="text-sm bg-blue-600/20 text-blue-400 border-blue-600/30"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {project.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                  <span className="text-gray-400 capitalize">{project.status}</span>
                </div>
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-700 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Project Images */}
        {project.imageUrls && project.imageUrls.length > 0 && (
          <div className="mb-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Project Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`${project.title} image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                        onClick={() => {
                          // Open image in new tab for full view
                          window.open(url, '_blank');
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors pointer-events-none" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Click on any image to view in full size
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Project Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Goals */}
            {project.goals && project.goals.length > 0 && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Project Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.goals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-white font-semibold">{index + 1}</span>
                        </div>
                        <p className="text-gray-300">{goal}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Outcomes */}
            {project.outcomes && project.outcomes.length > 0 && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Expected Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.outcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <p className="text-gray-300">{outcome}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/30"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Roadmap */}
            {project.roadmap && project.roadmap.length > 0 && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Project Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.roadmap.map((milestone, index) => (
                      <div key={milestone.id || index} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-white font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{milestone.title}</h4>
                          {milestone.description && (
                            <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <div className={`px-2 py-1 rounded text-xs ${
                              milestone.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                              milestone.status === 'in-progress' ? 'bg-blue-600/20 text-blue-400' :
                              'bg-gray-600/20 text-gray-400'
                            }`}>
                              {milestone.status}
                            </div>
                            {milestone.dueDate && (
                              <span className="text-xs text-gray-400">
                                Due: {formatDate(milestone.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* People Needed / Roles */}
            {project.peopleNeeded && project.peopleNeeded.roles.length > 0 && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    People Needed ({project.peopleNeeded.count})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.peopleNeeded.roles.map((role) => {
                      // Handle both old string format and new ProjectRole format
                      const roleName = typeof role === 'string' ? role : role.name;
                      const roleId = typeof role === 'string' ? role : role.id;
                      const responsibilities = typeof role === 'string' ? [] : role.responsibilities;
                      const skills = typeof role === 'string' ? [] : role.skills;
                      const contributions = typeof role === 'string' ? [] : role.contributions;

                      return (
                        <div key={roleId} className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                          <h4 className="text-white font-medium">{roleName}</h4>

                          {responsibilities.length > 0 && (
                            <div>
                              <h5 className="text-gray-400 text-sm mb-2">Responsibilities:</h5>
                              <ul className="list-disc list-inside space-y-1">
                                {responsibilities.map((resp, idx) => (
                                  <li key={idx} className="text-gray-300 text-sm">{resp}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {skills.length > 0 && (
                            <div>
                              <h5 className="text-gray-400 text-sm mb-2">Required Skills:</h5>
                              <div className="flex flex-wrap gap-1">
                                {skills.map((skill, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs bg-green-600/20 text-green-400 border-green-600/30"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {contributions.length > 0 && (
                            <div>
                              <h5 className="text-gray-400 text-sm mb-2">Value Contribution:</h5>
                              <ul className="list-disc list-inside space-y-1">
                                {contributions.map((contrib, idx) => (
                                  <li key={idx} className="text-gray-300 text-sm">{contrib}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {project.location && project.location.type && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Type:</span>
                      <Badge variant="secondary" className="bg-gray-600/20 text-gray-300 border-gray-600/30">
                        {project.location.type}
                      </Badge>
                    </div>
                    {project.location.city && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">City:</span>
                        <span className="text-white">{project.location.city}</span>
                      </div>
                    )}
                    {project.location.country && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Country:</span>
                        <span className="text-white">{project.location.country}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress */}
            {project.progress && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Overall Progress</span>
                      <span className="text-white font-semibold">{project.progress.overall}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress.overall}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Tasks Completed:</span>
                        <span className="text-white ml-2">{project.progress.tasksCompleted} / {project.progress.totalTasks}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-white ml-2">{formatDate(project.progress.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tasks */}
            {project.tasks && project.tasks.length > 0 && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Tasks ({project.tasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.tasks.map((task, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          task.status === 'done' ? 'bg-green-600' :
                          task.status === 'in-progress' ? 'bg-blue-600' : 'bg-gray-600'
                        }`}>
                          {task.status === 'done' ? (
                            <CheckCircle className="h-3 w-3 text-white" />
                          ) : task.status === 'in-progress' ? (
                            <Clock className="h-3 w-3 text-white" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                task.priority === 'high' ? 'bg-red-600/20 text-red-400 border-red-600/30' :
                                task.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' :
                                'bg-green-600/20 text-green-400 border-green-600/30'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                            {task.dueDate && (
                              <span className="text-xs text-gray-400">
                                Due: {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Details */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="text-white">{formatDate(project.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Last Updated</p>
                      <p className="text-white">{formatDate(project.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Project Creator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-sm text-gray-400">
                    {isOwner ? 'You are the creator of this project' : 'Created by another user'}
                  </p>
                  {isOwner && (
                    <Badge className="mt-2 bg-green-600/20 text-green-400 border-green-600/30">
                      Owner
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!user ? (
                  <Link href="/browse-projects">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Sign In to Collaborate
                    </Button>
                  </Link>
                ) : isOwner ? (
                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Manage Project
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                      View Collaborators
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Request to Join
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                      Send Message
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Project Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {project.tasks ? project.tasks.length : 0}
                      </p>
                      <p className="text-sm text-gray-400">Total Tasks</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {project.tasks ? project.tasks.filter(t => t.status === 'done').length : 0}
                      </p>
                      <p className="text-sm text-gray-400">Completed</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {project.technologies ? project.technologies.length : 0}
                      </p>
                      <p className="text-sm text-gray-400">Technologies</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {project.goals ? project.goals.length : 0}
                      </p>
                      <p className="text-sm text-gray-400">Goals</p>
                    </div>
                  </div>
                  {project.progress && (
                    <div className="pt-2 border-t border-gray-700">
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{project.progress.overall}%</p>
                        <p className="text-sm text-gray-400">Overall Progress</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
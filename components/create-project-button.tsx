'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CreateProjectButtonProps {
  onClick: () => void;
  loading?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function CreateProjectButton({
  onClick,
  loading = false,
  variant = 'default',
  size = 'default',
  className = ''
}: CreateProjectButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      variant={variant}
      size={size}
      className={`${className} ${variant === 'default' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200' : ''}`}
    >
      <Plus className="h-4 w-4 mr-2" />
      {loading ? 'Creating...' : 'Create Project'}
    </Button>
  );
}
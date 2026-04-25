import React from 'react';
import { FileText, Video, Link as LinkIcon, Award, ExternalLink } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface ResourceData {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'tool';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url: string;
  duration?: string;
  provider?: string;
  isFavorite?: boolean;
}

interface ResourceCardProps {
  resource: ResourceData;
  onAddFavorite?: (resourceId: string) => void;
  onRemoveFavorite?: (resourceId: string) => void;
}

const typeIcons = {
  article: <FileText size={24} className="text-blue-600" />,
  video: <Video size={24} className="text-red-600" />,
  course: <Award size={24} className="text-purple-600" />,
  tool: <LinkIcon size={24} className="text-green-600" />,
};

const difficultyColors = {
  beginner: 'default',
  intermediate: 'warning',
  advanced: 'danger',
} as const;

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onAddFavorite,
  onRemoveFavorite,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            {typeIcons[resource.type]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{resource.title}</h3>
            {resource.provider && (
              <p className="text-sm text-gray-600">{resource.provider}</p>
            )}
          </div>
        </div>
        <button
          onClick={() =>
            resource.isFavorite
              ? onRemoveFavorite?.(resource.id)
              : onAddFavorite?.(resource.id)
          }
          className={`text-2xl transition-colors ${
            resource.isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          ♥
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-4 flex-1">{resource.description}</p>

      <div className="flex items-center justify-between mb-4 py-4 border-y border-gray-200">
        <div className="flex gap-2">
          <Badge variant={difficultyColors[resource.difficulty]}>
            {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
          </Badge>
          <Badge variant="primary">{resource.type}</Badge>
        </div>
        {resource.duration && (
          <span className="text-sm text-gray-600">{resource.duration}</span>
        )}
      </div>

      <Button variant="outline" size="sm" onClick={() => window.open(resource.url, '_blank')}>
        <ExternalLink size={16} />
        Open Resource
      </Button>
    </div>
  );
};

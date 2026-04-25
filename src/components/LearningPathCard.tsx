import React from 'react';
import { BookOpen, Clock, Users, CheckCircle } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface LearningPathData {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolledCount?: number;
  completionPercentage?: number;
  modules?: number;
  isEnrolled?: boolean;
  isPaid?: boolean;
  price?: number;
}

interface LearningPathCardProps {
  path: LearningPathData;
  onEnroll?: (pathId: string) => void;
  onResume?: (pathId: string) => void;
}

const levelColors = {
  beginner: 'default',
  intermediate: 'warning',
  advanced: 'danger',
} as const;

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  path,
  onEnroll,
  onResume,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{path.title}</h3>
          <Badge variant={levelColors[path.level]} className="mt-2">
            {path.level.charAt(0).toUpperCase() + path.level.slice(1)}
          </Badge>
        </div>
        {path.isEnrolled && path.completionPercentage !== undefined && (
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{path.completionPercentage}%</div>
            <p className="text-xs text-gray-600">Complete</p>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4">{path.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-200">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-gray-500" />
          <span className="text-sm text-gray-600">{path.duration}h</span>
        </div>
        {path.modules && (
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-gray-500" />
            <span className="text-sm text-gray-600">{path.modules} modules</span>
          </div>
        )}
        {path.enrolledCount && (
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-500" />
            <span className="text-sm text-gray-600">{path.enrolledCount}+ enrolled</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {path.isEnrolled ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onResume?.(path.id)}
            className="flex-1"
          >
            <CheckCircle size={18} />
            Continue Learning
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEnroll?.(path.id)}
            className="flex-1"
          >
            {path.isPaid ? `Enroll - $${path.price}` : 'Enroll Now'}
          </Button>
        )}
      </div>
    </div>
  );
};

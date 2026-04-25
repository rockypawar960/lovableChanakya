import React, { useState } from 'react';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Badge } from './ui/Badge';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  assessmentsCompleted?: number;
  totalLearningHours?: number;
}

interface UserRowProps {
  user: UserData;
  onEdit?: (user: UserData) => void;
  onDelete?: (userId: string) => void;
}

const statusColors = {
  active: 'success',
  inactive: 'default',
  suspended: 'danger',
} as const;

export const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <Badge variant={statusColors[user.status]}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {user.assessmentsCompleted || 0} assessments
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {user.totalLearningHours || 0}h
      </td>
      <td className="px-6 py-4 relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreVertical size={18} className="text-gray-600" />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                onEdit?.(user);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
            >
              <Edit2 size={16} />
              Edit User
            </button>
            <button
              onClick={() => {
                onDelete?.(user.id);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
              Delete User
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  backgroundColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  backgroundColor = 'bg-blue-50',
}) => {
  return (
    <div className={`${backgroundColor} rounded-lg p-6 border border-gray-200`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-gray-600 text-sm font-medium">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>

      {trend && (
        <div className="flex items-center gap-2">
          {trend.isPositive ? (
            <TrendingUp size={16} className="text-green-600" />
          ) : (
            <TrendingDown size={16} className="text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% this month
          </span>
        </div>
      )}
    </div>
  );
};

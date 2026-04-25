import React from 'react';
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
}

const alertConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    textColor: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    textColor: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    textColor: 'text-yellow-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <InfoIcon className="w-5 h-5 text-blue-600" />,
    textColor: 'text-blue-800',
  },
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
  ...props
}) => {
  const config = alertConfig[type];

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-lg p-4 flex gap-3 ${className}`}
      {...props}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1">
        {title && <h3 className={`font-semibold ${config.textColor}`}>{title}</h3>}
        <p className={`text-sm ${config.textColor}`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 font-semibold ${config.textColor} hover:opacity-70`}
        >
          ×
        </button>
      )}
    </div>
  );
};

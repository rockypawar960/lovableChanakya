import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          className={`w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer ${className}`}
          {...props}
        />
        {label && <label className="text-gray-700 cursor-pointer">{label}</label>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

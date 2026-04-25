import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          className={`w-4 h-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer ${className}`}
          {...props}
        />
        {label && <label className="text-gray-700 cursor-pointer">{label}</label>}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

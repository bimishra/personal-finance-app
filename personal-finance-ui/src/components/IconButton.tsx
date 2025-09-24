import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'danger';
  className?: string;
  disabled?: boolean;
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  label,
  icon,
  variant = 'default',
  className = '',
  disabled = false,
  tooltip,
}) => {
  const baseClasses = 'p-2 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1';
  const variantClasses = {
    default: disabled
      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:ring-indigo-500',
    danger: disabled
      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
      : 'text-gray-600 hover:text-red-600 hover:bg-red-50 active:bg-red-100 focus:ring-red-500',
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={onClick}
        className={`peer ${baseClasses} ${variantClasses[variant]} ${className}`}
        aria-label={label}
        disabled={disabled}
      >
        {icon}
      </button>

      {tooltip && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 invisible peer-hover:opacity-100 peer-focus:opacity-100 peer-hover:visible peer-focus:visible transition-opacity duration-150 z-[100] whitespace-nowrap shadow-lg pointer-events-none"
        >
          {tooltip}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
};
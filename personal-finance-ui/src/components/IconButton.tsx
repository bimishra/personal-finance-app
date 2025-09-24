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
  const baseClasses = 'p-1.5 rounded-full transition-colors duration-200 relative group';
  const variantClasses = {
    default: disabled
      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
    danger: disabled
      ? 'bg-red-50 text-red-300 cursor-not-allowed'
      : 'hover:bg-red-50 text-red-600 hover:text-red-700',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      title={tooltip || label}
      aria-label={label}
      disabled={disabled}
    >
      {icon}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 max-w-xs text-center">
          {tooltip}
        </div>
      )}
    </button>
  );
};
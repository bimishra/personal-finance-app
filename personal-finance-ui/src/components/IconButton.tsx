import React, { useState } from 'react';
import styles from './IconButton.module.css';

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
  const [showTooltip, setShowTooltip] = useState(false);

  const variantClass = disabled ? styles.disabled : variant === 'danger' ? styles.danger : styles.default;

  return (
    <div className={styles.container} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <button
        onClick={onClick}
        className={`${styles.button} ${variantClass} ${className}`}
        aria-label={label}
        disabled={disabled}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {icon}
      </button>

      {tooltip && (
        <div role="tooltip" className={`${styles.tooltip} ${showTooltip ? styles.tooltipVisible : ''}`}>
          {tooltip}
          <div className={styles.tooltipArrow}></div>
        </div>
      )}
    </div>
  );
};
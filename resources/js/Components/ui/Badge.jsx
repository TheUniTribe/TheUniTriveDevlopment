import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
  };

  const variantClasses = variants[variant] || variants.default;

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export {Badge};

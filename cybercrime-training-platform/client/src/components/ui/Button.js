import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Button component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.variant - Button variant (primary, secondary, danger)
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {Function} props.onClick - Click handler
 * @param {string} props.to - Link destination (if button should act as a link)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {React.ReactNode} props.children - Button content
 * @returns {React.ReactNode} - Button component
 */
const Button = ({
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  onClick,
  to,
  size = 'md',
  children,
  ...rest
}) => {
  // Define variant classes
  const variantClasses = {
    primary: 'bg-police-blue text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'bg-white text-police-blue border border-police-blue hover:bg-gray-100',
  };
  
  // Define size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  // Common classes for both button and link
  const commonClasses = `rounded-lg transition-colors ${
    variantClasses[variant]
  } ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  // If 'to' prop is provided, render a Link component
  if (to && !disabled) {
    return (
      <Link
        to={to}
        className={commonClasses}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  // Otherwise render a regular button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={commonClasses}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
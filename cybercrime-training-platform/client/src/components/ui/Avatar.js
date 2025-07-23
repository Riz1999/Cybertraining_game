import React from 'react';

/**
 * Avatar component for displaying user profile images
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.size - Avatar size (xs, sm, md, lg, xl)
 * @param {string} props.status - User status (online, away, busy, offline)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.initials - User initials (displayed if no image)
 * @returns {React.ReactElement} Avatar component
 */
const Avatar = ({
  src,
  alt = 'User',
  size = 'md',
  status,
  className = '',
  initials,
}) => {
  // Define size styles
  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  // Define status styles
  const statusStyles = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  // Get user initials if no image and initials provided
  const getUserInitials = () => {
    if (initials) return initials;
    if (alt && alt !== 'User') {
      return alt
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${
            sizeStyles[size] || sizeStyles.md
          } rounded-full object-cover border-2 border-white`}
        />
      ) : (
        <div
          className={`${
            sizeStyles[size] || sizeStyles.md
          } rounded-full bg-police-blue text-white flex items-center justify-center font-medium border-2 border-white`}
        >
          {getUserInitials()}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${
            statusStyles[status] || statusStyles.offline
          } ${size === 'xs' ? 'h-1.5 w-1.5' : size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
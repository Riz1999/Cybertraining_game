import React, { useState, useRef, useEffect } from 'react';

/**
 * Dropdown component for displaying a menu of options
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.trigger - Element that triggers the dropdown
 * @param {Array} props.items - Array of dropdown items
 * @param {string} props.align - Dropdown alignment (left, right)
 * @param {string} props.width - Dropdown width (auto, sm, md, lg)
 * @param {boolean} props.withDividers - Whether to show dividers between items
 * @returns {React.ReactElement} Dropdown component
 */
const Dropdown = ({
  trigger,
  items = [],
  align = 'left',
  width = 'auto',
  withDividers = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Define width styles
  const widthStyles = {
    auto: 'w-auto',
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
  };

  // Define alignment styles
  const alignStyles = {
    left: 'left-0',
    right: 'right-0',
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle item click
  const handleItemClick = (onClick) => {
    if (onClick) {
      onClick();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute z-10 mt-2 ${alignStyles[align] || alignStyles.left} ${
            widthStyles[width] || widthStyles.auto
          } bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          {items.map((item, index) => {
            // If item is a divider
            if (item.divider) {
              return <hr key={`divider-${index}`} className="my-1 border-gray-200" />;
            }

            // If item is a header
            if (item.header) {
              return (
                <div
                  key={`header-${index}`}
                  className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {item.header}
                </div>
              );
            }

            // Regular item
            return (
              <React.Fragment key={index}>
                <div
                  className={`${
                    item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                  } block px-4 py-2 text-sm`}
                  onClick={() => !item.disabled && handleItemClick(item.onClick)}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </div>
                {withDividers && index < items.length - 1 && !items[index + 1].divider && !items[index + 1].header && (
                  <hr className="my-1 border-gray-200" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
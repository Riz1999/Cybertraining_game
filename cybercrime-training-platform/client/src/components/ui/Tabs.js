import React, { useState, useEffect } from 'react';

/**
 * Tabs component for organizing content into tabbed sections
 * @param {Object} props - Component props
 * @param {Array} props.tabs - Array of tab objects with label and content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Tab style variant (default, pills, underline)
 * @param {number} props.defaultTab - Index of the default active tab
 * @returns {React.ReactElement} Tabs component
 */
const Tabs = ({
  tabs = [],
  className = '',
  variant = 'default',
  defaultTab = 0,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Use the defaultTab prop as the initial value only
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Define variant styles
  const variantStyles = {
    default: {
      tabs: 'flex border-b border-gray-200',
      tab: (isActive) =>
        `py-2 px-4 font-medium text-sm cursor-pointer ${
          isActive
            ? 'border-b-2 border-police-blue text-police-blue'
            : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
        }`,
    },
    pills: {
      tabs: 'flex space-x-2',
      tab: (isActive) =>
        `py-2 px-4 font-medium text-sm rounded-md cursor-pointer ${
          isActive
            ? 'bg-police-blue text-white'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
        }`,
    },
    underline: {
      tabs: 'flex space-x-8',
      tab: (isActive) =>
        `py-2 font-medium text-sm cursor-pointer border-b-2 ${
          isActive
            ? 'border-police-blue text-police-blue'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`,
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className={className}>
      <div className={style.tabs}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={style.tab(activeTab === index)}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="py-4">{tabs[activeTab]?.content}</div>
    </div>
  );
};

export default Tabs;
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tab component for use with the Tabs component
 * This is a presentational component that renders content when active
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the tab
 * @param {string} props.title - Tab title to display
 * @param {React.ReactNode} props.children - Content to display when tab is active
 * @param {boolean} props.disabled - Whether the tab is disabled
 * @returns {React.ReactElement} Tab component
 */
const Tab = ({ id, title, children, disabled = false }) => {
  // This component doesn't render anything directly
  // It's used by the parent Tabs component to organize content
  return <>{children}</>;
};

Tab.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool
};

export default Tab;
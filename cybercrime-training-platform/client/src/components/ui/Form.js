import React from 'react';

/**
 * Form component for handling form submissions
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {React.ReactNode} props.children - Form content
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Form component
 */
const Form = ({ onSubmit, children, className = '' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

/**
 * Form group component for grouping form elements
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form group content
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Form group component
 */
export const FormGroup = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

/**
 * Form label component
 * @param {Object} props - Component props
 * @param {string} props.htmlFor - ID of the associated form element
 * @param {React.ReactNode} props.children - Label content
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Form label component
 */
export const FormLabel = ({ htmlFor, children, required = false, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

/**
 * Form error component
 * @param {Object} props - Component props
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Form error component
 */
export const FormError = ({ error, className = '' }) => {
  if (!error) return null;
  return <p className={`mt-1 text-sm text-red-500 ${className}`}>{error}</p>;
};

/**
 * Form actions component for form buttons
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form actions content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.align - Alignment of buttons (left, right, center, between)
 * @returns {React.ReactElement} Form actions component
 */
export const FormActions = ({ children, className = '', align = 'right' }) => {
  const alignStyles = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
  };

  return (
    <div className={`mt-6 flex ${alignStyles[align] || alignStyles.right} ${className}`}>
      {children}
    </div>
  );
};

export default Form;
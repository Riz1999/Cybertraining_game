import React from 'react';

/**
 * Textarea component for multi-line text input
 * @param {Object} props - Component props
 * @param {string} props.id - Textarea ID
 * @param {string} props.name - Textarea name
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Textarea label
 * @param {string} props.placeholder - Textarea placeholder
 * @param {boolean} props.required - Whether the textarea is required
 * @param {string} props.error - Error message
 * @param {number} props.rows - Number of rows
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Textarea component
 */
const Textarea = ({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  error,
  rows = 4,
  className = '',
  ...rest
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-police-blue focus:border-police-blue ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Textarea;
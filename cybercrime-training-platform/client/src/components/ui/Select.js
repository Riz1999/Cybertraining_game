import React from 'react';

/**
 * Select component for dropdown selections
 * @param {Object} props - Component props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of options with value and label
 * @param {string} props.label - Select label
 * @param {string} props.placeholder - Select placeholder
 * @param {boolean} props.required - Whether the select is required
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Select component
 */
const Select = ({
  id,
  name,
  value,
  onChange,
  options = [],
  label,
  placeholder = 'Select an option',
  required = false,
  error,
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
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-police-blue focus:border-police-blue ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        required={required}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
import React from 'react';

/**
 * Reusable Input component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Whether the input is required
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether the input is disabled
 * @returns {React.ReactNode} - Input component
 */
const Input = ({
  type,
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled,
  ...rest
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
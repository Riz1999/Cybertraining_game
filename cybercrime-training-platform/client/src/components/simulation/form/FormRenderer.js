import React from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';

/**
 * FormRenderer component
 * 
 * This component renders a form template with droppable fields.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.formTemplate - The form template to render
 * @param {Object} props.formState - The current state of the form
 * @param {Object} props.errors - Form validation errors
 * @param {Function} props.onDrop - Callback when an item is dropped on a field
 */
const FormRenderer = ({
  formTemplate,
  formState,
  errors = {},
  onDrop
}) => {
  // Group fields by section
  const fieldsBySection = {};
  
  formTemplate.fields.forEach(field => {
    const sectionId = field.sectionId || 'default';
    
    if (!fieldsBySection[sectionId]) {
      fieldsBySection[sectionId] = [];
    }
    
    fieldsBySection[sectionId].push(field);
  });
  
  // Get sections in order
  const sections = formTemplate.sections || [{ id: 'default', title: 'Form Information' }];
  
  return (
    <div className="form-renderer">
      {sections.map(section => (
        <div key={section.id} className="form-section mb-6">
          <h4 className="text-md font-semibold mb-3 pb-2 border-b border-gray-200">
            {section.title}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(fieldsBySection[section.id] || []).map(field => (
              <FormField
                key={field.id}
                field={field}
                value={formState[field.id]?.value || ''}
                isFilled={formState[field.id]?.isFilled || false}
                isRequired={formState[field.id]?.isRequired || false}
                error={errors[field.id]}
                onDrop={(itemId) => onDrop(field.id, itemId)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

FormRenderer.propTypes = {
  formTemplate: PropTypes.shape({
    title: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      sectionId: PropTypes.string,
      isRequired: PropTypes.bool
    })).isRequired,
    sections: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }))
  }).isRequired,
  formState: PropTypes.object.isRequired,
  errors: PropTypes.object,
  onDrop: PropTypes.func.isRequired
};

export default FormRenderer;
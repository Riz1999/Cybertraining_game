import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Button, Badge } from '../ui';

/**
 * NCRP Mock Form component with drag-and-drop functionality
 * @param {Object} props - Component props
 * @param {Object} props.scenario - Form scenario data
 * @param {Function} props.onComplete - Function called when form is completed
 * @param {Function} props.onProgress - Function called when progress is made
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} NCRP Mock Form component
 */
const NCRPMockForm = ({ 
  scenario, 
  onComplete, 
  onProgress, 
  className = '' 
}) => {
  const [availableItems, setAvailableItems] = useState([]);
  const [formFields, setFormFields] = useState({});
  const [errors, setErrors] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({});

  // Initialize form data
  useEffect(() => {
    if (scenario) {
      setAvailableItems(scenario.dragItems || []);
      
      // Initialize form fields with empty values
      const initialFields = {};
      scenario.formTemplate.sections.forEach(section => {
        section.fields.forEach(field => {
          initialFields[field.id] = {
            value: '',
            isCorrect: false,
            sectionId: section.id
          };
        });
      });
      setFormFields(initialFields);
    }
  }, [scenario]);

  // Handle drag end
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the dragged item
    const draggedItem = availableItems.find(item => item.id === draggableId);
    if (!draggedItem) return;

    // If dropped on a form field
    if (destination.droppableId.startsWith('field-')) {
      const fieldId = destination.droppableId.replace('field-', '');
      
      // Update form field
      setFormFields(prev => ({
        ...prev,
        [fieldId]: {
          ...prev[fieldId],
          value: draggedItem.value,
          draggedItem: draggedItem
        }
      }));

      // Remove item from available items if it's a single-use item
      if (draggedItem.singleUse) {
        setAvailableItems(prev => prev.filter(item => item.id !== draggableId));
      }

      // Clear any existing error for this field
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));

      // Report progress
      if (onProgress) {
        const completedFields = Object.values(formFields).filter(field => field.value).length + 1;
        const totalFields = Object.keys(formFields).length;
        onProgress({
          completedFields,
          totalFields,
          progress: (completedFields / totalFields) * 100
        });
      }
    }

    // If dropped back to available items area
    if (destination.droppableId === 'available-items' && source.droppableId.startsWith('field-')) {
      const fieldId = source.droppableId.replace('field-', '');
      const fieldData = formFields[fieldId];
      
      if (fieldData && fieldData.draggedItem) {
        // Add item back to available items
        setAvailableItems(prev => [...prev, fieldData.draggedItem]);
        
        // Clear form field
        setFormFields(prev => ({
          ...prev,
          [fieldId]: {
            ...prev[fieldId],
            value: '',
            draggedItem: null
          }
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const newFeedback = {};
    let correctCount = 0;
    let totalFields = 0;

    scenario.formTemplate.sections.forEach(section => {
      section.fields.forEach(field => {
        totalFields++;
        const fieldData = formFields[field.id];
        
        if (!fieldData.value) {
          newErrors[field.id] = 'This field is required';
        } else {
          // Check if the value is correct
          const isCorrect = fieldData.value === field.correctValue;
          
          setFormFields(prev => ({
            ...prev,
            [field.id]: {
              ...prev[field.id],
              isCorrect
            }
          }));

          if (isCorrect) {
            correctCount++;
            newFeedback[field.id] = {
              type: 'success',
              message: 'Correct!'
            };
          } else {
            newFeedback[field.id] = {
              type: 'error',
              message: `Incorrect. Expected: ${field.correctValue}`
            };
          }
        }
      });
    });

    setErrors(newErrors);
    setFeedback(newFeedback);

    const accuracy = (correctCount / totalFields) * 100;
    const calculatedScore = Math.round(accuracy);
    setScore(calculatedScore);

    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = () => {
    const isValid = validateForm();
    
    if (isValid) {
      setIsCompleted(true);
      if (onComplete) {
        onComplete({
          score,
          accuracy: score,
          formData: formFields,
          completedAt: new Date()
        });
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setAvailableItems(scenario.dragItems || []);
    
    const initialFields = {};
    scenario.formTemplate.sections.forEach(section => {
      section.fields.forEach(field => {
        initialFields[field.id] = {
          value: '',
          isCorrect: false,
          sectionId: section.id
        };
      });
    });
    setFormFields(initialFields);
    setErrors({});
    setFeedback({});
    setIsCompleted(false);
    setScore(0);
  };

  if (!scenario) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <p className="text-gray-600">No form scenario provided</p>
        </div>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <Card className={className}>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              score >= 80 ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {score >= 80 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Form Completed!</h3>
            <p className="text-gray-600">
              {score >= 80 
                ? 'Excellent work! You have successfully completed the NCRP form.'
                : 'Good effort! Review the feedback to improve your form completion skills.'
              }
            </p>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}%</div>
              <div className="text-sm text-blue-800">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(formFields).filter(field => field.isCorrect).length}
              </div>
              <div className="text-sm text-green-800">Correct Fields</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(formFields).length}
              </div>
              <div className="text-sm text-purple-800">Total Fields</div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={handleReset} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => onComplete && onComplete({ score, formData: formFields })} variant="primary">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={className}>
        {/* Header */}
        <Card className="mb-6">
          <div className="p-4 bg-police-blue text-white rounded-t-lg">
            <h3 className="text-lg font-bold">{scenario.title}</h3>
            <p className="text-police-blue-100">{scenario.description}</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Progress: {Object.values(formFields).filter(field => field.value).length}/{Object.keys(formFields).length} fields completed
              </span>
              <span>Drag items from the right panel to fill the form</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form Template */}
          <div className="lg:col-span-3">
            <Card>
              <div className="p-4 bg-gray-50 border-b">
                <h4 className="font-bold text-gray-900">NCRP Complaint Form</h4>
                <p className="text-sm text-gray-600">National Cybercrime Reporting Portal</p>
              </div>
              
              <div className="p-6">
                {scenario.formTemplate.sections.map((section) => (
                  <div key={section.id} className="mb-8">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                      {section.title}
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          
                          <Droppable droppableId={`field-${field.id}`}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`min-h-[50px] p-3 border-2 border-dashed rounded-lg transition-colors ${
                                  snapshot.isDraggingOver
                                    ? 'border-police-blue bg-police-blue-50'
                                    : formFields[field.id]?.value
                                    ? feedback[field.id]?.type === 'success'
                                      ? 'border-green-300 bg-green-50'
                                      : feedback[field.id]?.type === 'error'
                                      ? 'border-red-300 bg-red-50'
                                      : 'border-gray-300 bg-gray-50'
                                    : 'border-gray-300 bg-gray-50'
                                }`}
                              >
                                {formFields[field.id]?.value ? (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900">
                                      {formFields[field.id].value}
                                    </span>
                                    {feedback[field.id] && (
                                      <Badge variant={feedback[field.id].type === 'success' ? 'success' : 'error'}>
                                        {feedback[field.id].type === 'success' ? '✓' : '✗'}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500">
                                    Drop {field.type} here
                                  </span>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          
                          {errors[field.id] && (
                            <p className="text-sm text-red-600">{errors[field.id]}</p>
                          )}
                          
                          {feedback[field.id] && (
                            <p className={`text-sm ${
                              feedback[field.id].type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {feedback[field.id].message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Available Items */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4 bg-gray-50 border-b">
                <h4 className="font-bold text-gray-900">Available Information</h4>
                <p className="text-sm text-gray-600">Drag items to form fields</p>
              </div>
              
              <Droppable droppableId="available-items">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 min-h-[400px] ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      {availableItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 bg-white border rounded-lg shadow-sm cursor-move transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 mr-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    item.category === 'personal' ? 'bg-blue-400' :
                                    item.category === 'incident' ? 'bg-red-400' :
                                    item.category === 'financial' ? 'bg-green-400' :
                                    item.category === 'technical' ? 'bg-purple-400' :
                                    'bg-gray-400'
                                  }`}></div>
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.label}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {item.value}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                    
                    {availableItems.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <p className="text-sm">All items have been used</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            disabled={Object.values(formFields).filter(field => field.value).length === 0}
          >
            Submit Form
          </Button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default NCRPMockForm;
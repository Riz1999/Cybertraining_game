import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../ui';

/**
 * NCRP Form Completion Activity
 * Practice completing NCRP forms with drag-and-drop interface
 */
const NCRPFormCompletion = ({ activity, onComplete, isCompleted, previousScore }) => {
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [availableData, setAvailableData] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(activity.timeLimit);
  const [timerActive, setTimerActive] = useState(false);

  const { formSections, sampleCase } = activity.content;

  // Initialize available data for drag and drop
  useEffect(() => {
    const dataItems = [
      // Complainant data
      { id: 'name', value: sampleCase.complainant.name, type: 'complainant', label: 'Full Name' },
      { id: 'mobile', value: sampleCase.complainant.mobile, type: 'complainant', label: 'Mobile Number' },
      { id: 'email', value: sampleCase.complainant.email, type: 'complainant', label: 'Email Address' },
      { id: 'address', value: sampleCase.complainant.address, type: 'complainant', label: 'Address' },
      { id: 'aadhaar', value: sampleCase.complainant.aadhaar, type: 'complainant', label: 'Aadhaar Number' },
      
      // Incident data
      { id: 'incident-date', value: sampleCase.incident.date, type: 'incident', label: 'Date of Incident' },
      { id: 'incident-time', value: sampleCase.incident.time, type: 'incident', label: 'Time of Incident' },
      { id: 'category', value: 'Financial Fraud', type: 'incident', label: 'Category' },
      { id: 'subcategory', value: 'UPI Fraud', type: 'incident', label: 'Subcategory' },
      { id: 'description', value: sampleCase.incident.description, type: 'incident', label: 'Description' },
      
      // Suspect data
      { id: 'suspect-mobile', value: sampleCase.suspect.mobile, type: 'suspect', label: 'Suspect Mobile' },
      { id: 'suspect-upi', value: sampleCase.suspect.upiId, type: 'suspect', label: 'Suspect UPI ID' },
      
      // Financial data
      { id: 'loss-amount', value: sampleCase.financial.amount.toString(), type: 'financial', label: 'Loss Amount' },
      { id: 'transaction-id', value: sampleCase.financial.transactionId, type: 'financial', label: 'Transaction ID' },
      { id: 'bank-name', value: sampleCase.financial.bankName, type: 'financial', label: 'Bank Name' },
      
      // Distractors (incorrect data)
      { id: 'wrong-name', value: 'Rajesh Sharma', type: 'distractor', label: 'Wrong Name' },
      { id: 'wrong-mobile', value: '9999999999', type: 'distractor', label: 'Wrong Mobile' },
      { id: 'wrong-amount', value: '25000', type: 'distractor', label: 'Wrong Amount' },
      { id: 'wrong-date', value: '2024-02-15', type: 'distractor', label: 'Wrong Date' }
    ];
    
    // Shuffle the data items
    setAvailableData(dataItems.sort(() => Math.random() - 0.5));
  }, [sampleCase]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Start timer when component mounts
  useEffect(() => {
    if (!isCompleted && !timerActive) {
      setTimerActive(true);
    }
  }, [isCompleted]);

  // Handle time up
  const handleTimeUp = () => {
    const finalScore = calculateScore();
    onComplete(finalScore, { formData, completedSections: Array.from(completedSections) });
  };

  // Handle drag start
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e, fieldId) => {
    e.preventDefault();
    if (draggedItem) {
      setFormData(prev => ({
        ...prev,
        [fieldId]: draggedItem.value
      }));
      
      // Remove item from available data
      setAvailableData(prev => prev.filter(item => item.id !== draggedItem.id));
      setDraggedItem(null);
    }
  };

  // Handle manual input
  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Check if section is complete
  const isSectionComplete = (sectionIndex) => {
    const section = formSections[sectionIndex];
    const requiredFields = section.fields.filter(field => field.required);
    
    return requiredFields.every(field => 
      formData[field.id] && formData[field.id].trim() !== ''
    );
  };

  // Handle section completion
  const handleSectionComplete = () => {
    if (isSectionComplete(currentSection)) {
      setCompletedSections(prev => new Set([...prev, currentSection]));
      
      if (currentSection < formSections.length - 1) {
        setCurrentSection(prev => prev + 1);
      } else {
        // All sections completed
        const finalScore = calculateScore();
        onComplete(finalScore, { formData, completedSections: Array.from(completedSections) });
      }
    }
  };

  // Calculate score
  const calculateScore = () => {
    let totalPoints = 0;
    let maxPoints = 0;
    
    formSections.forEach((section, sectionIndex) => {
      section.fields.forEach(field => {
        maxPoints += field.required ? 10 : 5;
        
        const userValue = formData[field.id];
        if (userValue) {
          // Check if the value is correct based on sample case
          const correctValue = getCorrectValue(field.id);
          if (correctValue && userValue === correctValue) {
            totalPoints += field.required ? 10 : 5;
          } else if (userValue.trim() !== '') {
            // Partial credit for any non-empty value
            totalPoints += field.required ? 3 : 2;
          }
        }
      });
    });
    
    return Math.round((totalPoints / maxPoints) * 100);
  };

  // Get correct value for a field
  const getCorrectValue = (fieldId) => {
    const mapping = {
      'name': sampleCase.complainant.name,
      'mobile': sampleCase.complainant.mobile,
      'email': sampleCase.complainant.email,
      'address': sampleCase.complainant.address,
      'aadhaar': sampleCase.complainant.aadhaar,
      'incident-date': sampleCase.incident.date,
      'incident-time': sampleCase.incident.time,
      'category': 'financial-fraud',
      'subcategory': 'UPI Fraud',
      'description': sampleCase.incident.description,
      'suspect-mobile': sampleCase.suspect.mobile,
      'loss-amount': sampleCase.financial.amount.toString(),
      'transaction-id': sampleCase.financial.transactionId,
      'bank-name': sampleCase.financial.bankName
    };
    
    return mapping[fieldId];
  };

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{activity.title}</h3>
            <Badge variant="success">Completed - {previousScore}%</Badge>
          </div>
          <p className="text-gray-600 mb-4">{activity.description}</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              You have successfully completed the NCRP form completion activity with a score of {previousScore}%.
              You demonstrated good form-filling skills and attention to detail.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const currentSectionData = formSections[currentSection];

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{activity.title}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="info">
              Section {currentSection + 1} of {formSections.length}
            </Badge>
            <Badge variant={timeRemaining < 300 ? 'warning' : 'outline'}>
              Time: {formatTime(timeRemaining)}
            </Badge>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{activity.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Data Panel */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Available Information</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableData.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className={`p-3 border rounded-lg cursor-move transition-colors ${
                        item.type === 'distractor' 
                          ? 'border-red-200 bg-red-50 hover:bg-red-100' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-700">{item.label}</div>
                      <div className="text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">{currentSectionData.title}</h4>
                
                <div className="space-y-4">
                  {currentSectionData.fields.map(field => (
                    <div key={field.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'textarea' ? (
                        <textarea
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, field.id)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-police-blue focus:border-transparent min-h-[100px]"
                          placeholder={`Drop information here or type manually...`}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-police-blue focus:border-transparent"
                        >
                          <option value="">Select {field.label}</option>
                          {field.id === 'category' && (
                            <>
                              <option value="financial-fraud">Financial Fraud</option>
                              <option value="online-harassment">Online Harassment</option>
                              <option value="identity-theft">Identity Theft</option>
                              <option value="cyber-terrorism">Cyber Terrorism</option>
                            </>
                          )}
                          {field.id === 'subcategory' && (
                            <>
                              <option value="UPI Fraud">UPI Fraud</option>
                              <option value="Credit Card Fraud">Credit Card Fraud</option>
                              <option value="Investment Scam">Investment Scam</option>
                              <option value="Lottery Scam">Lottery Scam</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, field.id)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-police-blue focus:border-transparent"
                          placeholder={`Drop information here or type manually...`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleSectionComplete}
                    disabled={!isSectionComplete(currentSection)}
                    variant="primary"
                  >
                    {currentSection < formSections.length - 1 ? 'Next Section' : 'Complete Form'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {completedSections.size} / {formSections.length} sections</span>
            <span>Current Score: {calculateScore()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-police-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSections.size / formSections.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NCRPFormCompletion;
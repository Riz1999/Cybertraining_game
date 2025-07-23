# Form Simulation Components

This directory contains a comprehensive set of React components for creating interactive form-based simulations, specifically designed for cybercrime training scenarios.

## Overview

The form simulation system allows users to practice completing official forms (like NCRP - National Cyber Crime Reporting Portal) through an interactive drag-and-drop interface. Users drag information items from a panel into the appropriate form fields, with real-time validation and scoring.

## Components

### Core Components

#### `FormSimulationContainer`
The main container component that orchestrates the entire form simulation experience.

**Features:**
- Manages form state and validation
- Handles drag-and-drop interactions
- Calculates scores and provides feedback
- Integrates with validation and scoring systems

**Props:**
- `simulationData`: Object containing form template, drag items, and scenario
- `userProfile`: User information for personalization
- `onComplete`: Callback function called when simulation is completed

#### `FormRenderer`
Renders the form template with organized sections and fields.

**Features:**
- Supports multiple form sections
- Responsive grid layout
- Dynamic field rendering based on template

#### `FormField`
Individual form field component with drag-and-drop capabilities.

**Features:**
- HTML5 drag-and-drop support
- Visual feedback for drag states
- Validation error display
- Required field indicators

#### `DraggableInfoPanel`
Panel containing draggable information items.

**Features:**
- Scenario context display
- Categorized information items
- Visual drag indicators
- Item count tracking

#### `DraggableItem`
Individual draggable information item.

**Features:**
- Smooth drag interactions
- Visual feedback during drag
- Category badges
- Hover effects

### Specialized Components

#### `NCRPFormSimulation`
Specialized component for NCRP (National Cyber Crime Reporting Portal) form simulations.

**Features:**
- Pre-configured NCRP form template
- Realistic cybercrime scenarios
- Enhanced scoring for law enforcement training
- Detailed performance feedback

#### `FormSimulationExample`
Demo component showcasing the form simulation functionality.

**Features:**
- Sample scenario data
- Complete workflow demonstration
- Results display with detailed feedback
- Restart functionality

## Utility Modules

### `FormValidation.js`
Comprehensive validation system for form fields and entire forms.

**Functions:**
- `validateField(field, value)`: Validates individual fields
- `validateForm(formTemplate, formState)`: Validates entire form
- `calculateCompletionPercentage()`: Calculates form completion
- `calculateAccuracy()`: Measures accuracy against correct answers
- `generateFeedback()`: Provides performance feedback

**Validation Types:**
- Required field validation
- Email format validation
- Phone number validation (Indian format)
- Date and time validation
- Number validation

### `FormScoring.js`
Advanced scoring system for form simulations.

**Functions:**
- `calculateFormScore()`: Comprehensive scoring algorithm
- `calculateFieldScoring()`: Field-level scoring analysis
- `getPerformanceLevel()`: Performance level determination

**Scoring Components:**
- **Accuracy (50%)**: Correctness of information placement
- **Completion (30%)**: Percentage of fields completed
- **Speed (20%)**: Time efficiency with optimal time calculations

**Performance Levels:**
- Excellent (90-100%)
- Very Good (80-89%)
- Good (70-79%)
- Satisfactory (60-69%)
- Needs Improvement (50-59%)
- Poor (0-49%)

## Usage Examples

### Basic Form Simulation

```jsx
import { FormSimulationContainer } from './components/simulation/form';

const simulationData = {
  type: 'form',
  formTemplate: {
    title: 'Sample Form',
    sections: [
      { id: 'personal', title: 'Personal Information' }
    ],
    fields: [
      {
        id: 'name',
        label: 'Full Name',
        type: 'text',
        sectionId: 'personal',
        isRequired: true,
        correctValue: 'John Doe'
      }
    ]
  },
  dragItems: [
    {
      id: 'item1',
      label: 'Name',
      value: 'John Doe',
      category: 'Personal'
    }
  ],
  scenario: {
    title: 'Sample Scenario',
    description: 'Complete the form using provided information'
  }
};

function MySimulation() {
  const handleComplete = (results) => {
    console.log('Simulation completed:', results);
  };

  return (
    <FormSimulationContainer
      simulationData={simulationData}
      onComplete={handleComplete}
    />
  );
}
```

### NCRP Form Simulation

```jsx
import { NCRPFormSimulation } from './components/simulation/form';

const scenario = {
  victim: {
    name: 'Priya Sharma',
    phone: '+91-9876543210',
    email: 'priya@example.com',
    address: 'New Delhi'
  },
  incident: {
    date: '2024-01-20',
    time: '16:45',
    category: 'Financial Fraud',
    description: 'Fraudulent bank call resulted in ₹75,000 loss'
  },
  suspect: {
    phone: '+91-7654321098',
    account: '9876543210987654'
  },
  evidence: {
    transactionId: 'UTR987654321098',
    amount: '75000',
    bankName: 'HDFC Bank'
  }
};

function NCRPTraining() {
  const handleComplete = (results) => {
    console.log('NCRP simulation completed:', results);
    console.log('Score:', results.totalScore);
    console.log('Performance:', results.performanceLevel);
  };

  return (
    <NCRPFormSimulation
      scenario={scenario}
      onComplete={handleComplete}
    />
  );
}
```

## Form Template Structure

```javascript
const formTemplate = {
  title: "Form Title",
  sections: [
    {
      id: "section_id",
      title: "Section Title"
    }
  ],
  fields: [
    {
      id: "field_id",
      label: "Field Label",
      type: "text|email|tel|date|time|number|textarea|select",
      sectionId: "section_id",
      isRequired: true|false,
      correctValue: "expected_value", // For scoring
      points: 1 // Optional, default 1
    }
  ]
};
```

## Drag Item Structure

```javascript
const dragItems = [
  {
    id: "unique_id",
    label: "Display Label",
    value: "Actual Value",
    category: "Category Name" // Optional
  }
];
```

## Scoring Results Structure

```javascript
const results = {
  totalScore: 85, // 0-100
  breakdown: {
    accuracy: 90,
    completion: 85,
    speed: 75
  },
  performanceLevel: "Very Good",
  feedback: {
    summary: "Performance summary",
    strengths: ["High accuracy", "Complete submission"],
    weaknesses: ["Slow completion"],
    recommendations: ["Practice more", "Focus on speed"],
    nextSteps: ["Try advanced scenarios"]
  },
  accuracy: 0.9, // 0-1
  timeSpent: 180, // seconds
  correctCount: 9,
  totalFields: 10,
  completionPercentage: 100,
  fieldAccuracy: {
    field_id: {
      isCorrect: true,
      expected: "expected_value",
      actual: "actual_value"
    }
  }
};
```

## Testing

The components include comprehensive tests covering:

- Component rendering
- Form validation
- Scoring algorithms
- User interactions
- Integration workflows

Run tests with:
```bash
npm test -- --testPathPattern=FormSimulation.test.js
```

## Styling

Components use Tailwind CSS for styling with:
- Responsive design
- Drag-and-drop visual feedback
- Validation state indicators
- Performance level color coding
- Accessibility considerations

## Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- ARIA labels and descriptions

## Browser Compatibility

- Modern browsers with HTML5 drag-and-drop support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Considerations

- Lazy loading of large form templates
- Optimized re-rendering with React.memo
- Efficient drag-and-drop event handling
- Minimal DOM manipulations
- Debounced validation

## Future Enhancements

- Multi-language support
- Advanced form field types
- Custom validation rules
- Integration with backend APIs
- Real-time collaboration features
- Mobile touch support improvements
- Advanced analytics and reporting
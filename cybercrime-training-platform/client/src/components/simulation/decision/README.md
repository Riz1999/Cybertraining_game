# Decision-Based Scenario System

This directory contains the implementation of the decision-based scenario system for the cybercrime training platform. This system allows trainees to navigate through complex decision trees that simulate real-world cybercrime investigation scenarios.

## Overview

The decision-based scenario system is designed to train police officers in making critical decisions during cybercrime investigations. It provides:

- **Branching narratives** that adapt based on user choices
- **Real-time feedback** on decision quality
- **Consequence visualization** showing the impact of decisions
- **Performance tracking** with scoring and optimization metrics
- **Time-based challenges** to simulate pressure situations

## Components

### Core Components

#### `DecisionTreeContainer`
The main orchestrator component that manages the entire decision scenario flow.

**Props:**
- `treeData` (object): The decision tree data structure
- `userId` (string): Unique identifier for the user
- `onComplete` (function): Callback when scenario is completed
- `onError` (function): Error handling callback
- `showProgress` (boolean): Whether to show progress indicator
- `autoAdvanceFeedback` (boolean): Auto-advance after feedback

#### `DecisionPoint`
Renders individual decision points with options and timer.

**Props:**
- `decisionPoint` (object): Decision point data
- `onDecisionMade` (function): Callback when decision is made
- `timeLimit` (number): Time limit in seconds
- `showTimer` (boolean): Whether to show countdown timer
- `disabled` (boolean): Whether interaction is disabled

#### `DecisionFeedback`
Displays feedback after a decision is made, including consequences and scoring.

**Props:**
- `evaluation` (object): Decision evaluation result
- `option` (object): The chosen option
- `onContinue` (function): Callback to continue to next decision
- `showConsequences` (boolean): Whether to show consequences
- `autoAdvanceDelay` (number): Auto-advance delay in seconds

#### `DecisionProgress`
Shows user progress through the decision tree scenario.

**Props:**
- `progress` (object): Current progress data
- `tree` (object): Decision tree structure
- `showDetailedHistory` (boolean): Show detailed decision history

### Data Models

#### `DecisionTree`
Represents a complete decision scenario with multiple decision points.

**Properties:**
- `id`: Unique identifier
- `title`: Scenario title
- `description`: Scenario description
- `decisionPoints`: Array of decision points
- `startDecisionId`: ID of the starting decision
- `minScore`/`maxScore`: Scoring bounds

#### `DecisionPoint`
Represents a single decision point in the scenario.

**Properties:**
- `id`: Unique identifier
- `title`: Decision point title
- `scenario`: Scenario description
- `context`: Additional context information
- `timeLimit`: Time limit for decision (optional)
- `options`: Array of decision options

#### `DecisionOption`
Represents a choice available at a decision point.

**Properties:**
- `id`: Unique identifier
- `text`: Option text
- `description`: Detailed description
- `points`: Points awarded for this choice
- `feedback`: Feedback message
- `consequences`: Array of consequences
- `nextDecisionId`: ID of next decision point
- `isOptimal`: Whether this is the optimal choice
- `category`: Option category (escalate, wait, file_fir, etc.)

#### `DecisionConsequence`
Represents the consequence of a decision choice.

**Properties:**
- `type`: Consequence type (positive, negative, neutral)
- `description`: Consequence description
- `impact`: Impact level (low, medium, high)
- `delay`: Display delay in milliseconds

### Services

#### `DecisionTreeService`
Manages decision tree navigation and state.

**Key Methods:**
- `initializeTree(treeData, userId)`: Initialize a new scenario
- `makeDecision(optionId)`: Process a decision choice
- `getCurrentDecision()`: Get current decision point
- `getPerformanceMetrics()`: Get performance statistics
- `getDecisionPath()`: Get complete decision history
- `calculateOptimalPath()`: Calculate optimal decision sequence

## Usage

### Basic Usage

```javascript
import { DecisionTreeContainer } from './components/simulation/decision';

const MyComponent = () => {
  const handleComplete = (metrics) => {
    console.log('Scenario completed:', metrics);
  };

  return (
    <DecisionTreeContainer
      treeData={myDecisionTree}
      userId="user123"
      onComplete={handleComplete}
      showProgress={true}
    />
  );
};
```

### Creating a Decision Tree

```javascript
const sampleTree = {
  id: 'sample-scenario',
  title: 'Sample Decision Scenario',
  description: 'A sample decision tree for training',
  decisionPoints: [
    {
      id: 'first-decision',
      title: 'Initial Decision',
      scenario: 'You encounter a situation...',
      timeLimit: 120,
      options: [
        {
          id: 'option-1',
          text: 'Take immediate action',
          points: 10,
          feedback: 'Good choice!',
          consequences: [
            {
              type: 'positive',
              description: 'Quick resolution achieved',
              impact: 'high'
            }
          ],
          nextDecisionId: 'second-decision',
          isOptimal: true,
          category: 'escalate'
        }
        // ... more options
      ]
    }
    // ... more decision points
  ],
  startDecisionId: 'first-decision'
};
```

## Scoring System

The scoring system evaluates decisions based on:

1. **Points per decision**: Each option has an associated point value
2. **Optimal decision tracking**: Tracks whether choices are marked as optimal
3. **Time performance**: Considers decision-making speed
4. **Consequence impact**: Evaluates the severity of consequences

### Performance Metrics

- **Total Score**: Sum of all points earned
- **Optimal Decision Rate**: Percentage of optimal choices made
- **Average Decision Time**: Time spent per decision
- **Completion Status**: Whether scenario was completed

## Integration with Requirements

This system addresses the following requirements:

### Requirement 5.1 (Module 4 - Escalation Scenarios)
- Presents complaint delay scenarios
- Provides decision points for escalation timing

### Requirement 5.2 (Decision Options)
- Offers Escalate, Wait, and File FIR options
- Provides appropriate feedback for each choice

### Requirement 5.3 (CCTNS Interface)
- Includes CCTNS interface walkthrough based on decisions
- Simulates proper procedural protocols

### Requirement 5.4 (Decision Scoring)
- Scores decisions based on escalation timing appropriateness
- Provides feedback on decision quality

## Testing

The system includes comprehensive testing capabilities:

### Demo Component
Use `DecisionTreeDemo` to test the complete system with sample data.

### Sample Data
`SampleDecisionTree.js` contains a complete Module 4 scenario for testing.

### Performance Testing
The service includes methods for analyzing decision patterns and optimization.

## Customization

### Styling
All components use Tailwind CSS classes and can be customized via the `className` prop.

### Timing
Decision time limits and feedback delays are fully configurable.

### Scoring
The scoring algorithm can be customized by modifying the evaluation logic in decision options.

### Consequences
Consequences support delayed display and different impact levels for realistic feedback.

## Best Practices

1. **Decision Point Design**
   - Keep scenarios realistic and relevant
   - Provide clear context and background
   - Use appropriate time limits for pressure

2. **Option Creation**
   - Ensure options are distinct and meaningful
   - Provide clear feedback for each choice
   - Mark optimal decisions appropriately

3. **Consequence Design**
   - Use realistic consequences that match real-world outcomes
   - Vary impact levels to show decision importance
   - Consider delayed consequences for realism

4. **Performance Optimization**
   - Use appropriate time limits to encourage quick thinking
   - Balance scoring to reward both speed and accuracy
   - Provide improvement suggestions based on performance

## Future Enhancements

Potential improvements to the system:

1. **Advanced Analytics**: More detailed performance tracking and reporting
2. **Adaptive Difficulty**: Adjust scenario complexity based on user performance
3. **Collaborative Scenarios**: Multi-user decision scenarios
4. **Voice Integration**: Voice-based decision making for accessibility
5. **Mobile Optimization**: Enhanced mobile experience for field training
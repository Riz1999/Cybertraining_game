# Timer Simulation Components

This directory contains a comprehensive set of React components for creating time-based challenges and simulations, specifically designed for cybercrime training scenarios where time pressure is a critical factor.

## Overview

The timer simulation system provides a complete framework for creating timed challenges that simulate real-world scenarios where quick decision-making and efficient task completion are essential. The system includes visual indicators, scoring algorithms, and animated feedback to create engaging and educational experiences.

## Components

### Core Components

#### `CountdownTimer`
A flexible countdown timer with visual progress indicators and multiple callback hooks.

**Features:**
- Circular progress ring with color-coded states
- Multiple size variants (small, medium, large)
- Warning and critical threshold callbacks
- Pause, resume, and reset functionality
- Visual state indicators (normal, warning, critical)

**Props:**
```javascript
{
  duration: number,           // Timer duration in seconds
  onComplete: function,       // Called when timer reaches zero
  onTick: function,          // Called every second (optional)
  onWarning: function,       // Called when entering warning zone
  onCritical: function,      // Called when entering critical zone
  autoStart: boolean,        // Auto-start timer (default: true)
  size: 'small|medium|large', // Timer size
  variant: 'default|urgent|critical', // Visual variant
  showProgress: boolean,     // Show progress ring (default: true)
  warningThreshold: number,  // Warning threshold % (default: 30)
  criticalThreshold: number  // Critical threshold % (default: 10)
}
```

#### `TimePressureIndicator`
Visual and audio cues for time pressure with urgency level indicators.

**Features:**
- Real-time urgency level detection
- Visual alerts and notifications
- Screen flash effects for critical states
- Floating particle effects
- Audio alerts (optional)
- Multiple positioning options

**Props:**
```javascript
{
  timeLeft: number,          // Time remaining in seconds
  totalTime: number,         // Total time limit in seconds
  position: 'top|bottom|floating', // Indicator position
  showAlerts: boolean,       // Show alert popups
  enableSound: boolean,      // Enable sound alerts
  onUrgencyChange: function  // Called when urgency changes
}
```

#### `TimerResultAnimation`
Animated success/failure states with confetti effects and detailed scoring display.

**Features:**
- Multiple result types (success, failure, timeout, excellent)
- Confetti and particle animations
- Detailed score breakdown display
- Performance level indicators
- Bonus point celebrations
- Customizable messages

**Props:**
```javascript
{
  result: 'success|failure|timeout|excellent',
  scoreData: object,         // Score data from timer scoring
  onAnimationComplete: function,
  showConfetti: boolean,     // Show confetti animation
  customMessage: string      // Custom message override
}
```

#### `TimedChallengeContainer`
Comprehensive container that orchestrates the entire timed challenge experience.

**Features:**
- Complete challenge lifecycle management
- User action tracking
- Integrated scoring system
- State management (ready, active, completed, timeout)
- Challenge controls (start, pause, reset)
- Result animation integration

**Props:**
```javascript
{
  timeLimit: number,         // Time limit in seconds
  children: React.Element,   // Challenge content
  onComplete: function,      // Called when challenge completes
  onTimeUp: function,        // Called when time runs out
  challengeData: object,     // Challenge configuration
  autoStart: boolean,        // Auto-start challenge
  title: string,             // Challenge title
  description: string,       // Challenge description
  scoringWeights: object     // Custom scoring weights
}
```

### Utility Components

#### `TimePressureBar`
Horizontal progress bar with color-coded time pressure indication.

#### `TimePressurePulse`
Pulsing indicator showing time pressure intensity.

## Scoring System

### `TimerScoring.js`
Advanced scoring algorithms for time-based performance evaluation.

#### `calculateTimerScore(params)`
Calculates comprehensive scores based on multiple factors:

**Scoring Components:**
- **Completion (40%)**: Whether the challenge was completed
- **Speed (30%)**: Time efficiency with optimal time calculations
- **Accuracy (30%)**: Correctness of responses/actions

**Parameters:**
```javascript
{
  timeLimit: number,         // Total time limit
  timeUsed: number,          // Actual time used
  accuracy: number,          // Accuracy score (0-1)
  completed: boolean,        // Completion status
  weights: {                 // Custom weights
    completion: 0.4,
    speed: 0.3,
    accuracy: 0.3
  }
}
```

**Returns:**
```javascript
{
  totalScore: number,        // Final score (0-100)
  breakdown: {
    completion: number,
    speed: number,
    accuracy: number
  },
  performanceLevel: string,  // Performance classification
  feedback: object,          // Detailed feedback
  timeMetrics: object        // Time analysis data
}
```

#### Performance Levels
- **Exceptional (90-100%)**: Outstanding performance with speed bonus
- **Excellent (80-89%)**: High-quality completion
- **Good (70-79%)**: Solid performance
- **Satisfactory (60-69%)**: Meets basic requirements
- **Needs Improvement (50-59%)**: Below expectations
- **Poor (0-49%)**: Significant improvement needed
- **Incomplete**: Challenge not completed

#### `calculateTimeBonus(timeLimit, timeUsed, baseScore)`
Calculates bonus points for exceptional speed:

- **Lightning Fast (≤25% time)**: +15 points
- **Very Fast (≤50% time)**: +10 points
- **Fast (≤75% time)**: +5 points

#### `analyzeTimePressurePerformance(actions, timeLimit)`
Analyzes user behavior under time pressure:

- Average response time
- Response time variation
- Time distribution analysis
- Pressure handling quality assessment

## Usage Examples

### Basic Countdown Timer

```jsx
import { CountdownTimer } from './components/simulation/timer';

function MyTimer() {
  const handleComplete = () => {
    console.log('Timer completed!');
  };

  const handleWarning = (timeLeft) => {
    console.log(`Warning: ${timeLeft} seconds remaining`);
  };

  return (
    <CountdownTimer
      duration={120}
      onComplete={handleComplete}
      onWarning={handleWarning}
      size="large"
      warningThreshold={25}
      criticalThreshold={10}
    />
  );
}
```

### Complete Timed Challenge

```jsx
import { TimedChallengeContainer } from './components/simulation/timer';

function BankFreezeChallenge({ isActive, onComplete, trackAction }) {
  const [step, setStep] = useState(1);
  
  const handleStepComplete = () => {
    if (trackAction) {
      trackAction('step_completed', { step });
    }
    
    if (step === 3) {
      onComplete(0.9); // 90% accuracy
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div>
      <h3>Step {step}: Complete the bank freeze request</h3>
      <button 
        onClick={handleStepComplete}
        disabled={!isActive}
      >
        Complete Step
      </button>
    </div>
  );
}

function MyTimedChallenge() {
  const handleComplete = (scoreData) => {
    console.log('Challenge completed:', scoreData);
  };

  const handleTimeUp = (scoreData) => {
    console.log('Time up:', scoreData);
  };

  return (
    <TimedChallengeContainer
      timeLimit={180} // 3 minutes
      title="Emergency Bank Account Freeze"
      description="Freeze a suspect's account within the time limit"
      onComplete={handleComplete}
      onTimeUp={handleTimeUp}
      scoringWeights={{
        completion: 0.5,
        speed: 0.3,
        accuracy: 0.2
      }}
    >
      <BankFreezeChallenge />
    </TimedChallengeContainer>
  );
}
```

### Time Pressure Indicators

```jsx
import { TimePressureIndicator, TimePressureBar } from './components/simulation/timer';

function MyChallenge() {
  const [timeLeft, setTimeLeft] = useState(120);
  const totalTime = 120;

  const handleUrgencyChange = (urgencyLevel, indicators) => {
    console.log(`Urgency changed to: ${urgencyLevel}`);
    
    if (urgencyLevel === 'critical') {
      // Show additional warnings or change UI
    }
  };

  return (
    <div>
      <TimePressureIndicator
        timeLeft={timeLeft}
        totalTime={totalTime}
        position="top"
        showAlerts={true}
        onUrgencyChange={handleUrgencyChange}
      />
      
      <div className="challenge-content">
        {/* Your challenge content */}
      </div>
      
      <TimePressureBar
        timeLeft={timeLeft}
        totalTime={totalTime}
        height="h-3"
      />
    </div>
  );
}
```

### Custom Scoring

```jsx
import { calculateTimerScore, calculateTimeBonus } from './components/simulation/timer';

function evaluatePerformance(timeLimit, timeUsed, userAccuracy) {
  // Calculate base score
  const scoring = calculateTimerScore({
    timeLimit,
    timeUsed,
    accuracy: userAccuracy,
    completed: true,
    weights: {
      completion: 0.4,
      speed: 0.35,
      accuracy: 0.25
    }
  });

  // Calculate time bonus
  const bonus = calculateTimeBonus(timeLimit, timeUsed, scoring.totalScore);

  return {
    ...scoring,
    bonus,
    finalScore: bonus.finalScore
  };
}
```

## Styling and Theming

The components use Tailwind CSS with custom animations defined in `index.css`:

### Custom Animations
- `animate-shake`: Shake effect for failures
- `animate-float`: Floating particle effects
- `animate-fade-in-scale`: Smooth entrance animations
- `animate-countdown-pulse`: Timer pulsing effect
- `animate-timer-critical`: Critical state animation

### Color Schemes
- **Normal**: Green tones for safe time remaining
- **Warning**: Yellow/orange tones for low time
- **Critical**: Red tones with pulsing effects
- **Success**: Green celebration colors
- **Failure**: Red warning colors

## Accessibility Features

- Screen reader compatible timer announcements
- Keyboard navigation support
- High contrast mode compatibility
- Focus management during state changes
- ARIA labels for all interactive elements

## Performance Considerations

- Optimized timer intervals (1-second precision)
- Efficient re-rendering with React.memo
- Minimal DOM manipulations
- Debounced state updates
- Lazy loading of animation assets

## Testing

Comprehensive test suite covering:
- Timer functionality and callbacks
- Scoring algorithm accuracy
- Component integration
- User interaction flows
- Edge cases and error handling

Run tests with:
```bash
npm test -- --testPathPattern=TimerComponents.test.js
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Real-World Applications

### Cybercrime Training Scenarios

1. **Bank Account Freezing**: Simulate urgent account freeze requests
2. **Evidence Collection**: Time-critical evidence gathering
3. **Victim Response**: Quick response to cybercrime reports
4. **System Navigation**: Efficient use of law enforcement systems
5. **Decision Making**: Rapid decision-making under pressure

### Scoring Criteria for Law Enforcement

- **Speed**: Critical in preventing further financial loss
- **Accuracy**: Correct procedures prevent legal issues
- **Completeness**: All required steps must be followed
- **Pressure Handling**: Maintaining quality under stress

## Future Enhancements

- Multi-language timer announcements
- Advanced analytics and reporting
- Integration with learning management systems
- Real-time collaboration features
- Mobile-optimized touch interactions
- Voice command integration
- Adaptive difficulty based on performance
# Map Simulation Components

This directory contains components for creating interactive map-based simulations, specifically designed for the cybercrime training platform's System Map exploration activity.

## Components

### SystemMap

The main interactive map component that displays cybercrime investigation systems (NCRP, I4C, 1930, CCTNS) with clickable elements and information popups.

**Features:**
- Interactive SVG-based map visualization
- Clickable system nodes with detailed information popups
- Progress tracking for system exploration
- Automatic knowledge check after exploring all systems
- Responsive design with mobile support

**Props:**
- `systems` - Array of system objects with position, name, description, and details
- `connections` - Array of connection objects showing relationships between systems
- `onSystemClick` - Callback function when a system is clicked
- `onKnowledgeCheckComplete` - Callback function when knowledge check is completed
- `className` - Additional CSS classes

### MapSimulationContainer

Container component that manages the state and logic for map-based simulations, including scoring, progress tracking, and completion logic.

**Features:**
- Score calculation and tracking
- Progress monitoring
- Completion detection
- Integration with simulation framework
- Default system data for cybercrime investigation

**Props:**
- `simulation` - Simulation object containing map data and configuration
- `onComplete` - Callback function when simulation is completed
- `onProgress` - Callback function for progress updates
- `className` - Additional CSS classes

## Usage

### Basic Usage

```jsx
import { SystemMap, MapSimulationContainer } from './components/simulation/map';

// Using SystemMap directly
<SystemMap
  systems={systemsData}
  connections={connectionsData}
  onSystemClick={handleSystemClick}
  onKnowledgeCheckComplete={handleKnowledgeCheck}
/>

// Using MapSimulationContainer (recommended)
<MapSimulationContainer
  simulation={simulationData}
  onComplete={handleSimulationComplete}
  onProgress={handleProgress}
/>
```

### System Data Structure

```javascript
const systems = [
  {
    id: 'ncrp',
    name: 'NCRP',
    description: 'National Cybercrime Reporting Portal',
    details: 'Detailed description of the system...',
    position: { x: 150, y: 120 },
    keyFeatures: [
      'Online complaint filing',
      'Case status tracking',
      // ... more features
    ]
  },
  // ... more systems
];

const connections = [
  { from: 'ncrp', to: 'i4c' },
  { from: 'ncrp', to: 'helpline-1930' },
  // ... more connections
];
```

### Simulation Data Structure

```javascript
const simulation = {
  title: 'Cybercrime Systems Map Exploration',
  description: 'Explore the interconnected systems...',
  scenario: {
    metadata: {
      mapData: {
        systems: systemsData,
        connections: connectionsData
      }
    }
  }
};
```

## Scoring System

The map simulation uses the following scoring system:
- **System Exploration**: 10 points per system clicked
- **Knowledge Check**: Up to 50 points based on correct answers
- **Total Maximum Score**: 100 points (40 for exploration + 50 for knowledge check + 10 bonus)

## Knowledge Check

After exploring all systems, users are presented with a knowledge check consisting of:
1. Questions about system purposes and functions
2. Multiple choice format
3. Immediate feedback and scoring
4. Results summary with percentage score

## Styling

The components use Tailwind CSS classes for styling. Key design elements:
- Blue color scheme matching the cybercrime theme
- Interactive hover effects
- Progress indicators
- Modal popups for system information
- Responsive design for mobile devices

## Integration

These components integrate with:
- The main simulation engine
- Progress tracking system
- Scoring and badge systems
- Module completion logic

## Testing

Components include:
- PropTypes validation
- Error boundary handling
- Responsive design testing
- Accessibility features

## Accessibility

- Keyboard navigation support
- Screen reader compatible
- High contrast colors
- Clear focus indicators
- Alternative text for visual elements
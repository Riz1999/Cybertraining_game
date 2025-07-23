# Complaint Delay Scenario System

This system simulates scenarios where cybercrime complaints have been delayed in processing, requiring officers to make decisions about escalation to FIR and filing in CCTNS.

## Overview

The Complaint Delay Scenario System is part of Module 4: Escalation to FIR and CCTNS in the Cybercrime Training Platform. It helps officers learn when and how to escalate cybercrime complaints to formal FIRs and file them in the CCTNS system.

## Features

- **Timeline Visualization**: Displays a chronological timeline of events in a case, highlighting critical points and decision moments.
- **Decision Points**: Presents officers with decision scenarios where they must choose the appropriate action based on case details.
- **Context Information**: Provides detailed case information, including victim details, case history, and relevant documentation.
- **Feedback System**: Offers immediate feedback on decisions, explaining why certain choices are correct or incorrect.
- **Scoring**: Evaluates officer performance based on decision quality, timing, and procedural correctness.

## Components

1. **ComplaintDelayScenario.js**: Core data models for the scenario system.
2. **ComplaintDelayScenarioService.js**: Service for generating and managing scenarios.
3. **TimelineVisualization.js**: Component for visualizing the case timeline.
4. **DecisionPointComponent.js**: Component for presenting decision points.
5. **ContextInfoDisplay.js**: Component for displaying case context information.
6. **ComplaintDelayScenarioSimulation.js**: Main component that integrates all parts.
7. **ComplaintDelayScenarioPage.js**: Page component with intro, simulation, and results screens.

## Usage

To use the Complaint Delay Scenario System:

1. Navigate to `/complaint-delay` in the application.
2. Read the introduction and objectives.
3. Click "Start Simulation" to begin.
4. Review the case timeline and context information.
5. Make decisions at decision points.
6. Receive feedback and a final score.

## Testing

You can test the system using:

1. The test HTML page at `/test-complaint-delay.html`
2. The test script at `/src/tests/ComplaintDelayScenarioTest.js`

## Integration

The system is integrated with:

- Module progress tracking
- Badge awarding system
- User authentication and authorization

## Future Enhancements

Planned enhancements include:

- Additional case types (identity theft, cyber harassment)
- More complex decision trees with branching scenarios
- Integration with real CCTNS documentation requirements
- Collaborative decision-making scenarios
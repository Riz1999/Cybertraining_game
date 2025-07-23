# Module 4: Escalation to FIR and CCTNS

This module focuses on teaching officers when and how to escalate cybercrime complaints to formal FIRs and file them in the CCTNS system.

## Overview

Module 4 is a critical part of the cybercrime training platform, helping officers understand the criteria for escalating complaints to formal FIRs and the procedures for filing cases in the CCTNS system. The module includes interactive simulations, documentation exercises, and system training.

## Activities

### 1. Complaint Delay Scenario

The main activity in this module is the Complaint Delay Scenario simulation, which allows officers to practice handling cases where complaints have been delayed in processing. The simulation includes:

- Timeline visualization of case events
- Context information about the case
- Decision points where officers must choose appropriate actions
- Feedback on decisions and performance evaluation

### 2. FIR Documentation Requirements

This activity teaches officers about the essential documentation needed for filing cybercrime FIRs, including:

- Required forms and attachments
- Legal requirements for FIR filing
- Documentation standards and best practices

### 3. CCTNS Filing Procedure

This activity provides hands-on practice with filing cybercrime cases in the CCTNS system, covering:

- CCTNS interface navigation
- Data entry requirements
- Case tracking and management

## Implementation

The module is implemented using the following components:

- `ComplaintDelayScenarioModule.js`: Main component for the complaint delay scenario
- `ComplaintDelayScenario.js`: Data models for the scenario
- `ComplaintDelayScenarioService.js`: Service for generating and managing scenarios
- `TimelineVisualization.js`: Component for visualizing the case timeline
- `DecisionPointComponent.js`: Component for presenting decision points
- `ContextInfoDisplay.js`: Component for displaying case context information

## Integration

The module is integrated with:

- Module progress tracking
- Badge awarding system
- User authentication and authorization

## Testing

You can test the module using:

1. The test script at `/src/tests/module4-test.js`
2. The standalone test page at `/complaint-delay-test.html`

## Badge

Upon successful completion of this module, officers earn the "FIR Specialist" badge, recognizing their mastery of the procedures for escalating cybercrime complaints to FIRs.
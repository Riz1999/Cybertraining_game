/**
 * ComplaintDelayScenarioTest.js
 * 
 * Test script for the complaint delay scenario system.
 */
import ComplaintDelayScenarioService from '../services/ComplaintDelayScenarioService';

// Create an instance of the service
const scenarioService = new ComplaintDelayScenarioService();

// Generate a test scenario
const testScenario = scenarioService.generateScenario({
  complexity: 'medium',
  caseType: 'financial',
  timeSpan: 14,
  decisionPoints: 3
});

// Log the scenario details
console.log('Test Scenario Generated:');
console.log('Title:', testScenario.title);
console.log('Description:', testScenario.description);
console.log('Timeline Events:', testScenario.timelineEvents.length);
console.log('Decision Points:', testScenario.decisionPoints.length);

// Test getting a timeline event
const firstEvent = testScenario.getStartTimelineEvent();
console.log('First Timeline Event:', firstEvent ? firstEvent.title : 'None');

// Test getting a decision point
const firstDecisionPoint = testScenario.getDecisionPointByTimelineEvent(firstEvent.id);
console.log('Decision Point for First Event:', firstDecisionPoint ? firstDecisionPoint.title : 'None');

// Test calculating max score
console.log('Max Score:', testScenario.maxScore);

console.log('Test completed successfully!');
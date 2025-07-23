/**
 * Simple test script for the Complaint Delay Scenario System
 * 
 * This script can be run to verify that the system is working correctly.
 * It creates a scenario and logs the details to the console.
 */

// Import the necessary modules
import ComplaintDelayScenarioService from '../services/ComplaintDelayScenarioService';
import { formatDate } from '../utils/helpers';

/**
 * Run a test of the Complaint Delay Scenario System
 */
function testComplaintDelayScenario() {
  console.log('=== Testing Complaint Delay Scenario System ===');
  
  try {
    // Create a scenario service
    const scenarioService = new ComplaintDelayScenarioService();
    console.log('✓ Created scenario service');
    
    // Generate a scenario
    const scenario = scenarioService.generateScenario({
      complexity: 'medium',
      caseType: 'financial',
      timeSpan: 14,
      decisionPoints: 3
    });
    console.log('✓ Generated scenario:', scenario.title);
    
    // Log timeline events
    console.log(`✓ Timeline events: ${scenario.timelineEvents.length}`);
    scenario.timelineEvents.forEach((event, index) => {
      console.log(`  ${index + 1}. ${event.title} (${formatDate(event.timestamp)})`);
    });
    
    // Log decision points
    console.log(`✓ Decision points: ${scenario.decisionPoints.length}`);
    scenario.decisionPoints.forEach((point, index) => {
      console.log(`  ${index + 1}. ${point.title}`);
      console.log(`     Options: ${point.options.length}`);
      point.options.forEach((option, optIndex) => {
        console.log(`       ${optIndex + 1}. ${option.text} (${option.isCorrect ? 'Correct' : 'Incorrect'})`);
      });
    });
    
    // Log scenario details
    console.log('✓ Scenario details:');
    console.log(`  Title: ${scenario.title}`);
    console.log(`  Description: ${scenario.description}`);
    console.log(`  Max Score: ${scenario.maxScore}`);
    
    console.log('=== Test completed successfully! ===');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testComplaintDelayScenario();

// Export the test function for use in other scripts
export default testComplaintDelayScenario;
/**
 * Simple Dialog Example
 * 
 * This file provides a simple example of a dialog simulation.
 */
import { DialogTree, DialogNode, DialogMessage, DialogParticipant, DialogOption } from '../specialized/dialog/DialogModels';
import { PARTICIPANT_TYPES, EMOTIONAL_STATES, MESSAGE_TYPES, COMMUNICATION_METRICS } from '../specialized/dialog/DialogTypes';

/**
 * Create a simple dialog example
 * @returns {Object} The simulation data
 */
const createSimpleDialogExample = () => {
  try {
    // Create a victim character
    const victim = new DialogParticipant({
      id: 'victim',
      name: 'Rajesh Kumar',
      type: PARTICIPANT_TYPES.CHARACTER,
      avatarUrl: '/assets/avatars/victim-male.png',
      description: 'A victim of online banking fraud',
      emotionalState: EMOTIONAL_STATES.DISTRESSED
    });

    // Create dialog nodes
    const introNode = new DialogNode({
      id: 'intro',
      message: new DialogMessage({
        type: MESSAGE_TYPES.TEXT,
        content: "Hello officer, I need help. Someone has stolen money from my bank account.",
        participantId: 'victim',
        participantType: PARTICIPANT_TYPES.CHARACTER
      }),
      participantId: 'victim',
      emotionalStateChange: EMOTIONAL_STATES.DISTRESSED,
      options: [
        new DialogOption({
          id: 'intro-response-1',
          text: "I understand this is distressing. Can you tell me what happened?",
          nextNodeId: 'details',
          metrics: {
            [COMMUNICATION_METRICS.EMPATHY]: 2,
            [COMMUNICATION_METRICS.CLARITY]: 1,
            [COMMUNICATION_METRICS.PROFESSIONALISM]: 1,
            [COMMUNICATION_METRICS.PATIENCE]: 1
          }
        }),
        new DialogOption({
          id: 'intro-response-2',
          text: "You need to be more careful with your account details.",
          nextNodeId: 'defensive',
          metrics: {
            [COMMUNICATION_METRICS.EMPATHY]: -1,
            [COMMUNICATION_METRICS.CLARITY]: 0,
            [COMMUNICATION_METRICS.PROFESSIONALISM]: -1,
            [COMMUNICATION_METRICS.PATIENCE]: -1
          }
        })
      ]
    });

    const detailsNode = new DialogNode({
      id: 'details',
      message: new DialogMessage({
        type: MESSAGE_TYPES.TEXT,
        content: "I received a call yesterday claiming to be from my bank. They asked for my account details and I gave them. This morning I found ₹75,000 missing from my account.",
        participantId: 'victim',
        participantType: PARTICIPANT_TYPES.CHARACTER
      }),
      participantId: 'victim',
      emotionalStateChange: EMOTIONAL_STATES.WORRIED,
      options: [
        new DialogOption({
          id: 'details-response-1',
          text: "Thank you for sharing these details. We'll file an NCRP complaint to help recover your funds.",
          nextNodeId: 'conclusion',
          metrics: {
            [COMMUNICATION_METRICS.EMPATHY]: 1,
            [COMMUNICATION_METRICS.CLARITY]: 2,
            [COMMUNICATION_METRICS.PROFESSIONALISM]: 2,
            [COMMUNICATION_METRICS.PATIENCE]: 1
          }
        }),
        new DialogOption({
          id: 'details-response-2',
          text: "Do you have the transaction details and the phone number that called you?",
          nextNodeId: 'conclusion',
          metrics: {
            [COMMUNICATION_METRICS.EMPATHY]: 0,
            [COMMUNICATION_METRICS.CLARITY]: 1,
            [COMMUNICATION_METRICS.PROFESSIONALISM]: 1,
            [COMMUNICATION_METRICS.PATIENCE]: 0
          }
        })
      ]
    });

    const defensiveNode = new DialogNode({
      id: 'defensive',
      message: new DialogMessage({
        type: MESSAGE_TYPES.TEXT,
        content: "I know that now! But they sounded so convincing. I just need help getting my money back.",
        participantId: 'victim',
        participantType: PARTICIPANT_TYPES.CHARACTER
      }),
      participantId: 'victim',
      emotionalStateChange: EMOTIONAL_STATES.ANGRY,
      options: [
        new DialogOption({
          id: 'defensive-response-1',
          text: "I apologize. You're right, these scammers are very sophisticated. Let's focus on helping you.",
          nextNodeId: 'details',
          metrics: {
            [COMMUNICATION_METRICS.EMPATHY]: 2,
            [COMMUNICATION_METRICS.CLARITY]: 1,
            [COMMUNICATION_METRICS.PROFESSIONALISM]: 2,
            [COMMUNICATION_METRICS.PATIENCE]: 2
          }
        }),
        new DialogOption({
          id: 'defensive-response-2',
          text: "Please calm down. I need you to answer my questions if you want help.",
          nextNodeId: 'conclusion',
          metrics: {
            [COMMUNICATION_METRICS.EMPATHY]: -2,
            [COMMUNICATION_METRICS.CLARITY]: 0,
            [COMMUNICATION_METRICS.PROFESSIONALISM]: -1,
            [COMMUNICATION_METRICS.PATIENCE]: -2
          }
        })
      ]
    });

    const conclusionNode = new DialogNode({
      id: 'conclusion',
      message: new DialogMessage({
        type: MESSAGE_TYPES.TEXT,
        content: "Thank you for your help. What do we do next?",
        participantId: 'victim',
        participantType: PARTICIPANT_TYPES.CHARACTER
      }),
      participantId: 'victim',
      emotionalStateChange: EMOTIONAL_STATES.CALM,
      isEndNode: true,
      options: [] // Add empty options array to prevent map error
    });

    // Create the dialog tree
    const dialogTree = new DialogTree({
      title: 'Simple Banking Fraud Interview',
      description: 'Practice interviewing a victim of banking fraud',
      nodes: {
        'intro': introNode,
        'details': detailsNode,
        'defensive': defensiveNode,
        'conclusion': conclusionNode
      },
      participants: {
        'victim': victim
      },
      rootNodeId: 'intro'
    });

    // Return the simulation data
    return {
      title: 'Online Banking Fraud Interview',
      description: 'Practice interviewing a victim of online banking fraud with empathy and professionalism.',
      dialogTree: dialogTree, // Return the actual DialogTree instance
      metadata: {
        difficulty: 'beginner',
        category: 'financial-fraud',
        estimatedTime: '5 minutes'
      }
    };
  } catch (error) {
    console.error('Error creating dialog example:', error);
    throw error;
  }
};

export default createSimpleDialogExample;
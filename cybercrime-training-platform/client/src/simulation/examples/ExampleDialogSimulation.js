/**
 * Example Dialog Simulation
 * 
 * This file provides an example dialog simulation that can be used for testing
 * and as a reference for creating new dialog simulations.
 */
import { SIMULATION_TYPES, INTERACTION_TYPES } from '../models/SimulationTypes';
import { EMOTIONAL_STATES } from '../specialized/dialog/DialogTypes';

// Example dialog simulation for cybercrime victim interview
const victimInterviewSimulation = {
  id: 'victim-interview-simulation',
  type: SIMULATION_TYPES.DIALOG,
  title: 'Victim Interview: Online Banking Fraud',
  description: 'Practice interviewing a victim of online banking fraud with empathy and professionalism.',
  
  scenario: {
    title: 'Online Banking Fraud Interview',
    description: 'A victim has arrived at the police station to report an online banking fraud.',
    context: 'You are a police officer at the cybercrime cell. A distressed victim has arrived to report that money has been fraudulently transferred from their bank account.',
    characters: [
      {
        id: 'victim-1',
        name: 'Rajesh Kumar',
        role: 'Victim',
        description: 'A 45-year-old bank employee who has lost ₹50,000 in an online banking fraud.',
        avatarUrl: '/assets/characters/victim-male-1.png',
        emotionalState: EMOTIONAL_STATES.DISTRESSED
      }
    ]
  },
  
  interactions: [
    {
      id: 'greeting',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'Rajesh Kumar enters the police station looking visibly upset. He approaches your desk.',
      metadata: {
        speakerId: 'system'
      },
      options: [
        {
          id: 'greeting-1',
          text: 'Hello sir, please have a seat. You seem upset. How can I help you today?',
          value: 'empathetic',
          points: 10,
          feedback: 'Excellent approach. You acknowledged his emotional state and offered help in a professional manner.',
          isCorrect: true,
          nextInteractionId: 'victim-intro',
          metadata: {
            metrics: {
              empathy: 3,
              professionalism: 2,
              patience: 2
            }
          }
        },
        {
          id: 'greeting-2',
          text: 'Good morning. Please fill out this complaint form first.',
          value: 'procedural',
          points: 3,
          feedback: 'This approach is too procedural for someone in distress. It\'s better to establish rapport first.',
          isCorrect: false,
          nextInteractionId: 'victim-intro-upset',
          metadata: {
            metrics: {
              empathy: 0,
              professionalism: 1,
              patience: 0
            }
          }
        },
        {
          id: 'greeting-3',
          text: 'Yes? What happened?',
          value: 'abrupt',
          points: 1,
          feedback: 'This approach is too abrupt and lacks empathy. The victim is already distressed and needs a more supportive reception.',
          isCorrect: false,
          nextInteractionId: 'victim-intro-upset',
          metadata: {
            metrics: {
              empathy: 0,
              professionalism: 0,
              patience: 0
            }
          }
        }
      ]
    },
    {
      id: 'victim-intro',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'Thank you, officer. I\'m really worried. Yesterday I received a call from someone claiming to be from my bank. They said there was suspicious activity on my account and asked me to verify my details. This morning I found ₹50,000 missing from my account!',
      metadata: {
        speakerId: 'victim-1'
      },
      nextInteractionId: 'response-to-intro'
    },
    {
      id: 'victim-intro-upset',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'I don\'t have time for forms right now! I just lost ₹50,000 from my bank account! Someone called me pretending to be from my bank yesterday, and now my money is gone!',
      metadata: {
        speakerId: 'victim-1',
        emotionalChange: EMOTIONAL_STATES.ANGRY
      },
      nextInteractionId: 'response-to-intro'
    },
    {
      id: 'response-to-intro',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'Rajesh is clearly distressed about his financial loss. How do you respond?',
      metadata: {
        speakerId: 'system'
      },
      options: [
        {
          id: 'response-1',
          text: 'I understand this is very distressing, sir. I\'ll help you report this properly. First, could you tell me more details about the call you received?',
          value: 'supportive',
          points: 10,
          feedback: 'Great response. You showed empathy while also beginning to collect important information.',
          isCorrect: true,
          nextInteractionId: 'victim-details',
          metadata: {
            metrics: {
              empathy: 3,
              clarity: 2,
              professionalism: 2,
              patience: 2
            }
          }
        },
        {
          id: 'response-2',
          text: 'You should never share your banking details over the phone. This is a common scam.',
          value: 'judgmental',
          points: 2,
          feedback: 'While this information is correct, the timing is poor. The victim already feels vulnerable, and this response comes across as judgmental.',
          isCorrect: false,
          nextInteractionId: 'victim-defensive',
          metadata: {
            metrics: {
              empathy: 0,
              clarity: 1,
              professionalism: 1,
              patience: 0
            }
          }
        },
        {
          id: 'response-3',
          text: 'I need your account number, the transaction details, and a copy of your bank statement before we can proceed.',
          value: 'procedural',
          points: 5,
          feedback: 'This response is too procedural without acknowledging the victim\'s distress first. However, this information will eventually be needed.',
          isCorrect: false,
          nextInteractionId: 'victim-reluctant',
          metadata: {
            metrics: {
              empathy: 0,
              clarity: 2,
              professionalism: 2,
              patience: 0
            }
          }
        }
      ]
    },
    {
      id: 'victim-details',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'The caller said his name was Rahul from HDFC Bank. He knew my name and said there was suspicious activity on my account. He said I needed to verify my details or my account would be blocked. He asked for my card number, expiry date, and the OTP that was sent to my phone. I was worried, so I gave him the information.',
      metadata: {
        speakerId: 'victim-1',
        emotionalChange: EMOTIONAL_STATES.SCARED
      },
      nextInteractionId: 'ask-for-details'
    },
    {
      id: 'victim-defensive',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'I know that now! But the caller knew my name and some details about my account. He sounded very professional. I thought it was really my bank calling!',
      metadata: {
        speakerId: 'victim-1',
        emotionalChange: EMOTIONAL_STATES.FRUSTRATED
      },
      nextInteractionId: 'ask-for-details'
    },
    {
      id: 'victim-reluctant',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'I don\'t have all those documents with me right now. I just discovered the theft this morning and came straight here. Can\'t you just take my complaint first?',
      metadata: {
        speakerId: 'victim-1',
        emotionalChange: EMOTIONAL_STATES.FRUSTRATED
      },
      nextInteractionId: 'ask-for-details'
    },
    {
      id: 'ask-for-details',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'You need to gather specific information about the fraud. What do you ask next?',
      metadata: {
        speakerId: 'system'
      },
      options: [
        {
          id: 'ask-1',
          text: 'Do you know when exactly the transaction occurred and where the money was transferred to?',
          value: 'specific',
          points: 10,
          feedback: 'Excellent question. This information is critical for potentially freezing the transaction if it\'s within 24 hours.',
          isCorrect: true,
          nextInteractionId: 'victim-transaction-details',
          metadata: {
            metrics: {
              clarity: 3,
              accuracy: 3,
              professionalism: 2
            }
          }
        },
        {
          id: 'ask-2',
          text: 'Have you contacted your bank about this yet?',
          value: 'bank',
          points: 5,
          feedback: 'This is a relevant question, but not the most urgent one. Time is critical in fraud cases, and transaction details should be prioritized.',
          isCorrect: false,
          nextInteractionId: 'victim-bank-contact',
          metadata: {
            metrics: {
              clarity: 2,
              accuracy: 1,
              professionalism: 2
            }
          }
        },
        {
          id: 'ask-3',
          text: 'Did you save the phone number that called you?',
          value: 'phone',
          points: 7,
          feedback: 'This is a good investigative question, but transaction details are more time-sensitive for potentially recovering the funds.',
          isCorrect: false,
          nextInteractionId: 'victim-phone-number',
          metadata: {
            metrics: {
              clarity: 2,
              accuracy: 2,
              professionalism: 2
            }
          }
        }
      ]
    },
    {
      id: 'victim-transaction-details',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'Yes, I checked my account online. The transaction happened at 9:30 PM yesterday. The money was transferred to an account at PQR Bank. I have the transaction reference number from my statement - it\'s UTR123456789.',
      metadata: {
        speakerId: 'victim-1',
        emotionalChange: EMOTIONAL_STATES.NEUTRAL
      },
      nextInteractionId: 'action-plan'
    },
    {
      id: 'victim-bank-contact',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'I called their helpline this morning, but they said I need to file a police complaint first before they can investigate. That\'s why I\'m here.',
      metadata: {
        speakerId: 'victim-1'
      },
      nextInteractionId: 'ask-transaction-details'
    },
    {
      id: 'victim-phone-number',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'Yes, I have it in my call history. The number is 98765-43210. It showed up as "HDFC Bank" on my caller ID, which is why I trusted it.',
      metadata: {
        speakerId: 'victim-1'
      },
      nextInteractionId: 'ask-transaction-details'
    },
    {
      id: 'ask-transaction-details',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'You still need critical transaction information. What do you ask?',
      metadata: {
        speakerId: 'system'
      },
      options: [
        {
          id: 'ask-details-1',
          text: 'I need to know when exactly the transaction occurred and if you have any transaction reference number from your statement.',
          value: 'transaction-details',
          points: 10,
          feedback: 'Good follow-up. This information is essential for the next steps.',
          isCorrect: true,
          nextInteractionId: 'victim-transaction-details',
          metadata: {
            metrics: {
              clarity: 3,
              accuracy: 3,
              professionalism: 2
            }
          }
        }
      ]
    },
    {
      id: 'action-plan',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'Based on the information provided, what action do you take next?',
      metadata: {
        speakerId: 'system'
      },
      options: [
        {
          id: 'action-1',
          text: 'Since the fraud occurred within 24 hours, I\'ll immediately contact the nodal officer of PQR Bank to try to freeze the transaction while we file your formal complaint.',
          value: 'freeze',
          points: 10,
          feedback: 'Excellent decision. Acting quickly to freeze the transaction is the top priority when fraud is reported within 24 hours.',
          isCorrect: true,
          nextInteractionId: 'victim-grateful',
          metadata: {
            metrics: {
              accuracy: 3,
              professionalism: 3,
              clarity: 3
            }
          }
        },
        {
          id: 'action-2',
          text: 'Let\'s file an FIR right away and then contact the bank.',
          value: 'fir',
          points: 5,
          feedback: 'Filing an FIR is important, but when the fraud is within 24 hours, attempting to freeze the transaction should be the immediate priority.',
          isCorrect: false,
          nextInteractionId: 'victim-concerned',
          metadata: {
            metrics: {
              accuracy: 1,
              professionalism: 2,
              clarity: 2
            }
          }
        },
        {
          id: 'action-3',
          text: 'I\'ll register your complaint on the NCRP portal and give you a reference number.',
          value: 'ncrp',
          points: 3,
          feedback: 'While registering on NCRP is part of the process, the immediate action should be attempting to freeze the transaction since it\'s within 24 hours.',
          isCorrect: false,
          nextInteractionId: 'victim-concerned',
          metadata: {
            metrics: {
              accuracy: 1,
              professionalism: 2,
              clarity: 1
            }
          }
        }
      ]
    },
    {
      id: 'victim-grateful',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'Thank you so much, officer! I didn\'t know that was possible. I hope we can get my money back. What else should I do to protect myself?',
      metadata: {
        speakerId: 'victim-1',
        emotionalChange: EMOTIONAL_STATES.HAPPY
      },
      nextInteractionId: 'final-advice'
    },
    {
      id: 'victim-concerned',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'But isn\'t there something we can do to stop the transaction? My colleague said that if it\'s reported within 24 hours, the bank can sometimes freeze the transfer.',
      metadata: {
        speakerId: 'victim-1',
        emotionalChange: EMOTIONAL_STATES.CONFUSED
      },
      nextInteractionId: 'correct-action'
    },
    {
      id: 'correct-action',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'The victim is right. How do you respond?',
      metadata: {
        speakerId: 'system'
      },
      options: [
        {
          id: 'correct-1',
          text: 'You\'re absolutely right, and I apologize for not mentioning that first. I\'ll immediately contact the nodal officer of the receiving bank to try to freeze the transaction.',
          value: 'acknowledge',
          points: 7,
          feedback: 'Good recovery. You acknowledged the oversight and are now taking the correct action.',
          isCorrect: true,
          nextInteractionId: 'victim-relieved',
          metadata: {
            metrics: {
              empathy: 2,
              accuracy: 2,
              professionalism: 2
            }
          }
        }
      ]
    },
    {
      id: 'victim-relieved',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'Thank you, officer. That\'s a relief. I was worried nothing could be done about this.',
      metadata: {
        speakerId: 'victim-1',
        emotionalChange: EMOTIONAL_STATES.CALM
      },
      nextInteractionId: 'final-advice'
    },
    {
      id: 'final-advice',
      type: INTERACTION_TYPES.MULTIPLE_CHOICE,
      prompt: 'What final advice do you give to Rajesh to protect himself from future fraud?',
      metadata: {
        speakerId: 'system'
      },
      options: [
        {
          id: 'advice-1',
          text: 'You should immediately change all your banking passwords, enable two-factor authentication, and never share OTPs or banking details with anyone over the phone, even if they claim to be from your bank.',
          value: 'comprehensive',
          points: 10,
          feedback: 'Excellent advice covering both immediate actions and future prevention.',
          isCorrect: true,
          nextInteractionId: 'conclusion',
          metadata: {
            metrics: {
              clarity: 3,
              accuracy: 3,
              professionalism: 3
            }
          }
        },
        {
          id: 'advice-2',
          text: 'Be more careful next time and don\'t share your details with anyone.',
          value: 'basic',
          points: 2,
          feedback: 'This advice is too vague and comes across as judgmental rather than helpful.',
          isCorrect: false,
          nextInteractionId: 'conclusion',
          metadata: {
            metrics: {
              clarity: 1,
              accuracy: 1,
              professionalism: 0
            }
          }
        },
        {
          id: 'advice-3',
          text: 'Contact your bank to block your current cards and accounts, and request new ones. Also, monitor your credit report for any suspicious activities.',
          value: 'reactive',
          points: 7,
          feedback: 'This is good reactive advice but doesn\'t include preventive measures for the future.',
          isCorrect: false,
          nextInteractionId: 'conclusion',
          metadata: {
            metrics: {
              clarity: 2,
              accuracy: 2,
              professionalism: 2
            }
          }
        }
      ]
    },
    {
      id: 'conclusion',
      type: INTERACTION_TYPES.TEXT_RESPONSE,
      prompt: 'Thank you for your help and advice, officer. I feel much better knowing that there\'s a chance to recover my money and that I know how to protect myself better in the future.',
      metadata: {
        speakerId: 'victim-1',
        emotionalChange: EMOTIONAL_STATES.CALM
      },
      nextInteractionId: null
    }
  ],
  
  startInteractionId: 'greeting'
};

// Export the example dialog simulation
export default {
  victimInterviewSimulation
};
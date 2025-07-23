/**
 * Victim Character Profiles for Dialog Simulations
 * Each profile includes character details, background, and emotional state
 */

export const victimProfiles = {
  // Banking Fraud Victim - Elderly, Distressed
  elderlyBankingVictim: {
    id: 'elderly-banking-victim',
    name: 'Mrs. Sunita Sharma',
    age: 68,
    occupation: 'Retired Teacher',
    description: 'Elderly woman who lost ₹50,000 in a phishing scam',
    background: 'Recently retired, not very tech-savvy, lives alone, relies on pension',
    emotionalState: 'distressed',
    characteristics: [
      'Speaks slowly and sometimes repeats information',
      'Gets confused with technical terms',
      'Becomes emotional when discussing the loss',
      'Trusting but now fearful of technology'
    ],
    imageUrl: '/assets/characters/elderly-woman.png',
    voiceProfile: {
      tone: 'soft',
      pace: 'slow',
      accent: 'hindi-english'
    }
  },

  // Online Shopping Fraud - Young Professional
  youngProfessionalVictim: {
    id: 'young-professional-victim',
    name: 'Rahul Gupta',
    age: 28,
    occupation: 'Software Engineer',
    description: 'Young professional who fell victim to fake e-commerce website',
    background: 'Tech-savvy but busy, shops online frequently, good income',
    emotionalState: 'frustrated',
    characteristics: [
      'Speaks quickly and provides detailed information',
      'Understands technical concepts well',
      'Frustrated about being deceived despite being tech-aware',
      'Wants quick resolution'
    ],
    imageUrl: '/assets/characters/young-male-professional.png',
    voiceProfile: {
      tone: 'clear',
      pace: 'fast',
      accent: 'neutral'
    }
  },

  // Social Media Harassment - College Student
  collegeStudentVictim: {
    id: 'college-student-victim',
    name: 'Priya Patel',
    age: 20,
    occupation: 'College Student',
    description: 'College student facing cyberbullying and harassment',
    background: 'Active on social media, studying, lives in hostel, limited income',
    emotionalState: 'anxious',
    characteristics: [
      'Hesitant to share details initially',
      'Uses social media terminology',
      'Worried about privacy and reputation',
      'Seeks reassurance and support'
    ],
    imageUrl: '/assets/characters/college-student-female.png',
    voiceProfile: {
      tone: 'quiet',
      pace: 'medium',
      accent: 'young'
    }
  },

  // Investment Fraud - Middle-aged Businessman
  businessmanVictim: {
    id: 'businessman-victim',
    name: 'Mr. Vikram Singh',
    age: 45,
    occupation: 'Small Business Owner',
    description: 'Business owner who lost money in cryptocurrency fraud',
    background: 'Runs a small manufacturing business, looking to invest savings',
    emotionalState: 'angry',
    characteristics: [
      'Direct and to-the-point communication',
      'Angry about the deception',
      'Concerned about business impact',
      'Wants immediate action'
    ],
    imageUrl: '/assets/characters/middle-aged-businessman.png',
    voiceProfile: {
      tone: 'firm',
      pace: 'medium-fast',
      accent: 'business'
    }
  },

  // Romance Scam - Middle-aged Woman
  romanceScamVictim: {
    id: 'romance-scam-victim',
    name: 'Mrs. Kavita Mehta',
    age: 42,
    occupation: 'Homemaker',
    description: 'Recently divorced woman who fell victim to romance scam',
    background: 'Recently divorced, looking for companionship online, has teenage children',
    emotionalState: 'embarrassed',
    characteristics: [
      'Embarrassed and reluctant to share details',
      'Emotional about the relationship aspect',
      'Worried about family finding out',
      'Needs empathetic handling'
    ],
    imageUrl: '/assets/characters/middle-aged-woman.png',
    voiceProfile: {
      tone: 'soft',
      pace: 'slow',
      accent: 'emotional'
    }
  }
};

/**
 * Dialog Scenarios for different types of cybercrimes
 */
export const dialogScenarios = {
  // Banking Fraud Interview Scenario
  bankingFraudInterview: {
    id: 'banking-fraud-interview',
    title: 'Banking Fraud Victim Interview',
    description: 'Interview an elderly victim of a phishing scam who lost ₹50,000',
    victim: victimProfiles.elderlyBankingVictim,
    context: 'The victim received a fake SMS claiming to be from her bank and provided her details on a fraudulent website.',
    learningObjectives: [
      'Practice empathetic communication with elderly victims',
      'Extract key information without causing distress',
      'Handle emotional responses professionally',
      'Gather technical details in simple terms'
    ],
    interactions: [
      {
        id: 'intro',
        prompt: 'Namaste ji, I got a call from police station. Someone told me to come here about my bank money problem. I am very worried... they took all my money!',
        emotion: 'distressed',
        context: 'Victim is visibly upset and speaking in a mix of Hindi and English',
        options: [
          {
            text: 'Please don\'t worry, Mrs. Sharma. I\'m here to help you. Can you please sit down and tell me what happened?',
            scores: { empathy: 15, professionalism: 10, information: 5 },
            extractedInfo: { victimName: 'Mrs. Sunita Sharma', emotionalState: 'distressed' },
            nextInteractionId: 'incident-details'
          },
          {
            text: 'I need you to calm down first. Then we can start with the complaint process. Do you have your bank statements?',
            scores: { empathy: 5, professionalism: 15, information: 10 },
            hint: 'This approach is too direct for a distressed elderly victim',
            nextInteractionId: 'incident-details-rushed'
          },
          {
            text: 'Ma\'am, I understand this is very difficult for you. Let\'s take this step by step. First, can you tell me your name and when this happened?',
            scores: { empathy: 20, professionalism: 15, information: 10 },
            extractedInfo: { victimName: 'Mrs. Sunita Sharma', approachUsed: 'empathetic' },
            nextInteractionId: 'incident-details-gentle'
          }
        ]
      },
      {
        id: 'incident-details',
        prompt: 'Thank you beta. Yesterday I got SMS from bank saying my account will be closed. I got scared and clicked the link. They asked for my PIN and OTP... I gave it because I thought it was bank.',
        emotion: 'regretful',
        context: 'Victim is calmer but feels guilty about sharing information',
        options: [
          {
            text: 'It\'s not your fault, Mrs. Sharma. These fraudsters are very clever. Can you show me the SMS you received?',
            scores: { empathy: 15, professionalism: 10, information: 15 },
            extractedInfo: { incidentType: 'phishing', method: 'SMS', victimAction: 'shared PIN and OTP' },
            nextInteractionId: 'technical-details'
          },
          {
            text: 'You should never share your PIN or OTP with anyone. Banks never ask for this information. What was the exact amount lost?',
            scores: { empathy: 0, professionalism: 10, information: 15 },
            hint: 'This response blames the victim and may make them more defensive',
            nextInteractionId: 'defensive-response'
          },
          {
            text: 'I understand you were trying to protect your account. These scammers make their messages look very real. Can you remember what time you received the SMS?',
            scores: { empathy: 20, professionalism: 15, information: 10 },
            extractedInfo: { incidentType: 'phishing', method: 'SMS', victimMindset: 'protective' },
            nextInteractionId: 'timeline-details'
          }
        ]
      },
      {
        id: 'technical-details',
        prompt: 'Yes, I have the SMS. Here... *shows phone*. After I entered my details, I got another message saying ₹50,000 was debited. I called bank immediately but they said transaction was already done.',
        emotion: 'helpless',
        context: 'Victim shows the fraudulent SMS and bank transaction alert',
        options: [
          {
            text: 'Thank you for showing me this. This is clearly a fraudulent SMS. Did you save any screenshots or write down the website address you visited?',
            scores: { empathy: 10, professionalism: 15, information: 20 },
            extractedInfo: { evidenceAvailable: 'SMS', amountLost: '50000', bankNotified: 'yes' },
            nextInteractionId: 'evidence-collection'
          },
          {
            text: 'This is a classic phishing SMS. The grammar and spelling mistakes are obvious signs. You should have been more careful.',
            scores: { empathy: -10, professionalism: 5, information: 10 },
            hint: 'Avoid making the victim feel worse about their mistake',
            nextInteractionId: 'victim-becomes-defensive'
          },
          {
            text: 'I can see how convincing this message looks. You did the right thing by calling the bank immediately. Let me help you file a proper complaint to recover your money.',
            scores: { empathy: 20, professionalism: 20, information: 15 },
            extractedInfo: { evidenceAvailable: 'SMS', amountLost: '50000', bankNotified: 'yes', victimResponse: 'immediate' },
            nextInteractionId: 'complaint-filing'
          }
        ]
      },
      {
        id: 'complaint-filing',
        prompt: 'Will I get my money back? This was my whole month\'s pension money. I don\'t know how to tell my son about this...',
        emotion: 'worried',
        context: 'Victim is concerned about financial impact and family reaction',
        options: [
          {
            text: 'I cannot guarantee recovery, but we will do everything possible. Filing this complaint is the first step. Your family will understand that you were deceived.',
            scores: { empathy: 15, professionalism: 20, information: 10 },
            extractedInfo: { financialImpact: 'monthly pension', familyConcern: 'yes' },
            nextInteractionId: 'completion'
          },
          {
            text: 'Recovery depends on how quickly we act. Don\'t worry about your family - focus on providing all the details we need for the investigation.',
            scores: { empathy: 10, professionalism: 15, information: 15 },
            extractedInfo: { recoveryUrgency: 'time-sensitive' },
            nextInteractionId: 'completion'
          },
          {
            text: 'Mrs. Sharma, I understand your worry. We have helped many people in similar situations. Let\'s complete your complaint and I\'ll explain the next steps clearly.',
            scores: { empathy: 20, professionalism: 20, information: 15 },
            extractedInfo: { financialImpact: 'monthly pension', familyConcern: 'yes', reassuranceGiven: 'yes' },
            nextInteractionId: 'completion'
          }
        ]
      }
    ]
  },

  // Social Media Harassment Scenario
  socialMediaHarassment: {
    id: 'social-media-harassment',
    title: 'Cyberbullying Victim Interview',
    description: 'Interview a college student facing online harassment and cyberbullying',
    victim: victimProfiles.collegeStudentVictim,
    context: 'A college student is being harassed online with fake profiles and inappropriate messages.',
    learningObjectives: [
      'Handle sensitive cases involving young victims',
      'Understand social media harassment patterns',
      'Provide appropriate support and guidance',
      'Collect digital evidence properly'
    ],
    interactions: [
      {
        id: 'intro',
        prompt: 'Hi... um... I\'m not sure if I should be here. My friends said I should report this but I\'m worried it might make things worse...',
        emotion: 'anxious',
        context: 'Young victim is hesitant and worried about consequences',
        options: [
          {
            text: 'It\'s completely normal to feel this way. You\'ve taken a brave step by coming here. Whatever you\'re facing, we\'re here to help you safely.',
            scores: { empathy: 20, professionalism: 15, information: 5 },
            extractedInfo: { victimAge: 'young', hesitancy: 'high', supportSystem: 'friends' },
            nextInteractionId: 'building-trust'
          },
          {
            text: 'You need to file a complaint if someone is harassing you online. Can you show me the messages or posts?',
            scores: { empathy: 5, professionalism: 10, information: 15 },
            hint: 'Too direct - young victims need more reassurance first',
            nextInteractionId: 'victim-withdraws'
          },
          {
            text: 'I understand your concern about making things worse. Let\'s talk about what\'s happening first, and then we can decide the best way to help you.',
            scores: { empathy: 18, professionalism: 18, information: 8 },
            extractedInfo: { victimAge: 'young', hesitancy: 'high', approachNeeded: 'gentle' },
            nextInteractionId: 'building-trust'
          }
        ]
      },
      {
        id: 'building-trust',
        prompt: 'Someone created fake profiles using my photos and is sending inappropriate messages to my classmates. They\'re also posting mean comments on my posts. I don\'t know who it is...',
        emotion: 'embarrassed',
        context: 'Victim is sharing details but still embarrassed about the situation',
        options: [
          {
            text: 'This is a serious form of harassment called impersonation and cyberbullying. You\'re right to report it. Can you show me these fake profiles?',
            scores: { empathy: 10, professionalism: 20, information: 15 },
            extractedInfo: { crimeType: 'impersonation and cyberbullying', evidence: 'fake profiles', impact: 'social' },
            nextInteractionId: 'evidence-gathering'
          },
          {
            text: 'That sounds really difficult to deal with. How long has this been going on? And have you tried blocking these accounts?',
            scores: { empathy: 15, professionalism: 10, information: 10 },
            extractedInfo: { crimeType: 'cyberbullying', duration: 'unknown' },
            nextInteractionId: 'timeline-discussion'
          },
          {
            text: 'I\'m sorry you\'re going through this. No one deserves to be treated this way. Let\'s document everything carefully so we can take proper action.',
            scores: { empathy: 20, professionalism: 18, information: 12 },
            extractedInfo: { crimeType: 'cyberbullying and impersonation', victimSupport: 'provided' },
            nextInteractionId: 'evidence-gathering'
          }
        ]
      }
    ]
  }
};

export default { victimProfiles, dialogScenarios };
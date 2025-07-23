/**
 * Module 2: Complaint Categorization and Intake Data
 * Contains victim scenarios, categorization options, and NCRP form data
 */

export const module2Data = {
  id: 'module-2-complaint-categorization',
  title: 'Complaint Categorization and Intake',
  description: 'Master the art of categorizing complaints and collecting accurate information from victims',
  estimatedDuration: 60, // minutes
  difficulty: 'intermediate',
  minPassingScore: 80,
  prerequisites: ['module-1-intro-cybercrime'],
  
  // Learning objectives
  objectives: [
    'Accurately categorize different types of cybercrime complaints',
    'Conduct effective victim interviews using proper techniques',
    'Complete NCRP forms with accurate and complete information',
    'Apply appropriate response protocols based on complaint type',
    'Demonstrate empathy and professionalism in victim interactions'
  ],

  // Module activities
  activities: [
    {
      id: 'victim-dialog-simulation',
      title: 'Victim Dialog Simulation',
      type: 'simulation',
      description: 'Practice interviewing victims through realistic dialog scenarios',
      points: 100,
      timeLimit: null,
      content: {
        scenarios: [
          {
            id: 'financial-fraud-victim',
            title: 'Financial Fraud Case',
            victimProfile: {
              name: 'Rajesh Kumar',
              age: 45,
              occupation: 'Small Business Owner',
              location: 'Mumbai, Maharashtra',
              emotionalState: 'distressed',
              techSavviness: 'basic'
            },
            initialStatement: "Sir, I have been cheated! Someone has taken ₹2,50,000 from my account. I got a call saying I won a lottery and they asked for my bank details to transfer the prize money. Now all my money is gone!",
            dialogOptions: [
              {
                id: 'empathetic-response',
                text: "I understand this must be very distressing for you, Mr. Kumar. Let me help you with this. Can you tell me exactly when this happened?",
                score: 20,
                feedback: "Excellent! Showing empathy while gathering initial information is the right approach.",
                nextDialog: 'timeline-questions'
              },
              {
                id: 'direct-questioning',
                text: "When did you give your bank details? What information exactly did you share?",
                score: 10,
                feedback: "While these are important questions, starting with empathy would be better for victim comfort.",
                nextDialog: 'timeline-questions'
              },
              {
                id: 'blame-response',
                text: "Why did you share your bank details with unknown callers? You should have been more careful.",
                score: 0,
                feedback: "Never blame the victim. This approach will make them reluctant to share information.",
                nextDialog: 'defensive-victim'
              }
            ]
          },
          {
            id: 'online-harassment-victim',
            title: 'Online Harassment Case',
            victimProfile: {
              name: 'Priya Sharma',
              age: 28,
              occupation: 'Software Engineer',
              location: 'Bangalore, Karnataka',
              emotionalState: 'anxious',
              techSavviness: 'advanced'
            },
            initialStatement: "I'm being harassed online by someone who has my personal photos. They're threatening to share them on social media if I don't pay money. I'm scared and don't know what to do.",
            dialogOptions: [
              {
                id: 'reassuring-response',
                text: "I'm sorry you're going through this, Ms. Sharma. You did the right thing by reporting this. We take such cases very seriously. Can you tell me how the perpetrator contacted you?",
                score: 20,
                feedback: "Perfect approach - reassuring the victim while gathering essential information.",
                nextDialog: 'harassment-details'
              },
              {
                id: 'evidence-focus',
                text: "Do you have screenshots of the threats? What platform is being used for harassment?",
                score: 15,
                feedback: "Good focus on evidence, but starting with reassurance would be more appropriate.",
                nextDialog: 'harassment-details'
              },
              {
                id: 'dismissive-response',
                text: "How did they get your photos in the first place? You should be more careful about what you share online.",
                score: 0,
                feedback: "This response blames the victim and may prevent them from sharing crucial information.",
                nextDialog: 'reluctant-victim'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'complaint-categorization',
      title: 'Complaint Categorization Exercise',
      type: 'categorization',
      description: 'Categorize various cybercrime complaints into appropriate categories',
      points: 100,
      timeLimit: 900, // 15 minutes
      content: {
        categories: [
          {
            id: 'financial-fraud',
            name: 'Financial Fraud',
            description: 'Fraudulent transactions, fake investment schemes, lottery scams',
            subcategories: ['UPI Fraud', 'Credit Card Fraud', 'Investment Scam', 'Lottery Scam', 'Banking Fraud']
          },
          {
            id: 'online-harassment',
            name: 'Online Harassment/Cyberbullying',
            description: 'Threats, harassment, cyberbullying, stalking',
            subcategories: ['Cyberbullying', 'Online Stalking', 'Threats', 'Doxxing', 'Revenge Porn']
          },
          {
            id: 'identity-theft',
            name: 'Identity Theft',
            description: 'Unauthorized use of personal information',
            subcategories: ['Aadhaar Misuse', 'PAN Card Fraud', 'Social Media Impersonation', 'Document Forgery']
          },
          {
            id: 'cyber-terrorism',
            name: 'Cyber Terrorism/Security',
            description: 'Hacking, data breaches, malware attacks',
            subcategories: ['Website Hacking', 'Data Breach', 'Malware Attack', 'Ransomware', 'DDoS Attack']
          },
          {
            id: 'online-gambling',
            name: 'Online Gambling',
            description: 'Illegal online gambling and betting',
            subcategories: ['Illegal Betting', 'Online Casino', 'Fantasy Sports Fraud']
          }
        ],
        cases: [
          {
            id: 'case-1',
            description: "Complainant received a call claiming they won ₹25 lakh in KBC lottery. Caller asked for bank details and OTP to transfer prize money. ₹1.2 lakh debited from account.",
            correctCategory: 'financial-fraud',
            correctSubcategory: 'Lottery Scam',
            difficulty: 'easy'
          },
          {
            id: 'case-2',
            description: "Someone created a fake Facebook profile using complainant's photos and is sending inappropriate messages to their contacts, damaging their reputation.",
            correctCategory: 'identity-theft',
            correctSubcategory: 'Social Media Impersonation',
            difficulty: 'medium'
          },
          {
            id: 'case-3',
            description: "Complainant's ex-boyfriend is continuously sending threatening messages on WhatsApp and has shared private photos without consent on social media.",
            correctCategory: 'online-harassment',
            correctSubcategory: 'Revenge Porn',
            difficulty: 'medium'
          },
          {
            id: 'case-4',
            description: "Company's website was hacked and customer database containing personal and financial information of 10,000+ users was stolen and put up for sale on dark web.",
            correctCategory: 'cyber-terrorism',
            correctSubcategory: 'Data Breach',
            difficulty: 'hard'
          },
          {
            id: 'case-5',
            description: "Complainant invested ₹5 lakh in a cryptocurrency scheme promoted on social media. The website has now disappeared and money cannot be withdrawn.",
            correctCategory: 'financial-fraud',
            correctSubcategory: 'Investment Scam',
            difficulty: 'medium'
          }
        ]
      }
    },
    {
      id: 'ncrp-form-completion',
      title: 'NCRP Form Completion',
      type: 'form-filling',
      description: 'Complete NCRP forms with accurate information using drag-and-drop interface',
      points: 100,
      timeLimit: 1200, // 20 minutes
      content: {
        formSections: [
          {
            id: 'complainant-details',
            title: 'Complainant Details',
            fields: [
              { id: 'name', label: 'Full Name', type: 'text', required: true },
              { id: 'mobile', label: 'Mobile Number', type: 'tel', required: true },
              { id: 'email', label: 'Email Address', type: 'email', required: true },
              { id: 'address', label: 'Address', type: 'textarea', required: true },
              { id: 'aadhaar', label: 'Aadhaar Number', type: 'text', required: false }
            ]
          },
          {
            id: 'incident-details',
            title: 'Incident Details',
            fields: [
              { id: 'incident-date', label: 'Date of Incident', type: 'date', required: true },
              { id: 'incident-time', label: 'Time of Incident', type: 'time', required: false },
              { id: 'category', label: 'Category of Crime', type: 'select', required: true },
              { id: 'subcategory', label: 'Sub-category', type: 'select', required: true },
              { id: 'description', label: 'Incident Description', type: 'textarea', required: true }
            ]
          },
          {
            id: 'suspect-details',
            title: 'Suspect Details (if known)',
            fields: [
              { id: 'suspect-name', label: 'Suspect Name', type: 'text', required: false },
              { id: 'suspect-mobile', label: 'Suspect Mobile', type: 'tel', required: false },
              { id: 'suspect-email', label: 'Suspect Email', type: 'email', required: false },
              { id: 'suspect-address', label: 'Suspect Address', type: 'textarea', required: false }
            ]
          },
          {
            id: 'financial-details',
            title: 'Financial Details (if applicable)',
            fields: [
              { id: 'loss-amount', label: 'Amount Lost (₹)', type: 'number', required: false },
              { id: 'transaction-id', label: 'Transaction ID/UTR', type: 'text', required: false },
              { id: 'bank-name', label: 'Bank Name', type: 'text', required: false },
              { id: 'account-number', label: 'Account Number', type: 'text', required: false }
            ]
          }
        ],
        sampleCase: {
          complainant: {
            name: 'Amit Patel',
            mobile: '9876543210',
            email: 'amit.patel@email.com',
            address: '123, Residency Road, Ahmedabad, Gujarat - 380001',
            aadhaar: '1234-5678-9012'
          },
          incident: {
            date: '2024-01-15',
            time: '14:30',
            category: 'financial-fraud',
            subcategory: 'UPI Fraud',
            description: 'Received fake UPI payment request appearing to be from known contact. Approved payment of ₹15,000 thinking it was legitimate.'
          },
          suspect: {
            mobile: '8765432109',
            upiId: 'fraud@paytm'
          },
          financial: {
            amount: 15000,
            transactionId: 'TXN123456789',
            bankName: 'State Bank of India'
          }
        }
      }
    }
  ],

  // Assessment criteria
  assessment: {
    passingScore: 80,
    maxAttempts: 3,
    scoring: {
      'victim-dialog-simulation': {
        weight: 0.4,
        criteria: [
          { aspect: 'empathy', weight: 0.3 },
          { aspect: 'information-gathering', weight: 0.4 },
          { aspect: 'professionalism', weight: 0.3 }
        ]
      },
      'complaint-categorization': {
        weight: 0.3,
        criteria: [
          { aspect: 'accuracy', weight: 0.6 },
          { aspect: 'speed', weight: 0.2 },
          { aspect: 'reasoning', weight: 0.2 }
        ]
      },
      'ncrp-form-completion': {
        weight: 0.3,
        criteria: [
          { aspect: 'completeness', weight: 0.4 },
          { aspect: 'accuracy', weight: 0.4 },
          { aspect: 'efficiency', weight: 0.2 }
        ]
      }
    }
  },

  // Badge reward
  badgeReward: {
    id: 'first-responder',
    name: 'First Responder',
    description: 'Mastered complaint categorization and intake procedures with professional excellence',
    criteria: 'Complete Module 2 with 80% or higher score'
  }
};

export default module2Data;
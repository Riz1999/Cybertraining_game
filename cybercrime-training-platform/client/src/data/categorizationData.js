/**
 * Cybercrime Categorization Data
 * Contains categories and scenarios for complaint categorization training
 */

// Standard cybercrime categories used in India
export const cybercrimeCategories = [
  {
    id: 'financial-fraud',
    name: 'Financial Fraud',
    description: 'Fraudulent activities involving money, banking, or financial transactions',
    examples: ['Credit card fraud', 'Net banking fraud', 'UPI fraud', 'Investment scams'],
    subcategories: [
      'Banking fraud',
      'Credit/Debit card fraud',
      'Investment fraud',
      'Insurance fraud',
      'Loan fraud'
    ]
  },
  {
    id: 'social-media-crime',
    name: 'Social Media & Communication Crime',
    description: 'Crimes committed through social media platforms and communication apps',
    examples: ['Cyberbullying', 'Fake profiles', 'Harassment', 'Morphed images'],
    subcategories: [
      'Cyberbullying/harassment',
      'Fake social media profiles',
      'Morphed/fake images',
      'Defamation',
      'Stalking'
    ]
  },
  {
    id: 'online-fraud',
    name: 'Online Shopping & E-commerce Fraud',
    description: 'Fraudulent activities related to online shopping and e-commerce',
    examples: ['Fake websites', 'Non-delivery of goods', 'Counterfeit products'],
    subcategories: [
      'Fake e-commerce websites',
      'Non-delivery of goods',
      'Counterfeit products',
      'Fake reviews',
      'Refund fraud'
    ]
  },
  {
    id: 'identity-theft',
    name: 'Identity Theft & Impersonation',
    description: 'Crimes involving stealing or misusing someone\'s identity',
    examples: ['Aadhaar fraud', 'PAN card misuse', 'Fake documents', 'Impersonation'],
    subcategories: [
      'Aadhaar/PAN fraud',
      'Document forgery',
      'Impersonation',
      'Identity cloning',
      'Fake certificates'
    ]
  },
  {
    id: 'cyber-stalking',
    name: 'Cyber Stalking & Harassment',
    description: 'Persistent harassment, stalking, or threatening behavior online',
    examples: ['Persistent messaging', 'Tracking', 'Threats', 'Blackmail'],
    subcategories: [
      'Online stalking',
      'Persistent harassment',
      'Threatening messages',
      'Blackmail/extortion',
      'Revenge sharing'
    ]
  },
  {
    id: 'hacking',
    name: 'Hacking & Unauthorized Access',
    description: 'Unauthorized access to computer systems, accounts, or data',
    examples: ['Email hacking', 'Social media hacking', 'Website defacement'],
    subcategories: [
      'Email/social media hacking',
      'Website defacement',
      'Data breach',
      'System intrusion',
      'Malware attacks'
    ]
  },
  {
    id: 'cryptocurrency-fraud',
    name: 'Cryptocurrency & Investment Fraud',
    description: 'Fraudulent schemes involving cryptocurrency or fake investments',
    examples: ['Fake crypto exchanges', 'Ponzi schemes', 'Fake ICOs'],
    subcategories: [
      'Fake cryptocurrency exchanges',
      'Ponzi/pyramid schemes',
      'Fake ICOs/tokens',
      'Mining scams',
      'Wallet fraud'
    ]
  },
  {
    id: 'romance-scam',
    name: 'Romance & Relationship Scam',
    description: 'Fraudulent romantic relationships created to exploit victims financially',
    examples: ['Fake dating profiles', 'Marriage scams', 'Emotional manipulation'],
    subcategories: [
      'Online dating fraud',
      'Marriage scams',
      'Fake relationships',
      'Emotional exploitation',
      'Matrimonial fraud'
    ]
  }
];

// Categorization scenarios for training
export const categorizationScenarios = [
  {
    id: 'scenario-1',
    title: 'Banking SMS Fraud',
    description: 'A 65-year-old retired teacher received an SMS claiming to be from her bank stating that her account would be blocked unless she updated her KYC details by clicking a link. She clicked the link, entered her net banking credentials, and lost ₹45,000 from her account within 2 hours.',
    context: 'The victim has limited technical knowledge and trusted the official-looking message.',
    categories: cybercrimeCategories,
    correctCategory: 'financial-fraud',
    explanation: 'This is a classic case of Financial Fraud, specifically banking fraud through phishing. The fraudster used a fake SMS to steal banking credentials and transfer money.',
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'scenario-2',
    title: 'Fake E-commerce Website',
    description: 'A software engineer ordered a laptop worth ₹80,000 from a website that offered a 70% discount. He paid through UPI but never received the product. The website became inaccessible after a week, and customer service numbers were fake.',
    context: 'The website looked professional with customer reviews and secure payment options.',
    categories: cybercrimeCategories,
    correctCategory: 'online-fraud',
    explanation: 'This falls under Online Shopping & E-commerce Fraud. The fake website was created specifically to defraud customers by taking payments without delivering goods.',
    points: 10,
    difficulty: 'easy'
  },
  {
    id: 'scenario-3',
    title: 'Social Media Impersonation',
    description: 'A college student discovered that someone had created multiple fake Instagram profiles using her photos and was sending inappropriate messages to her classmates and professors. The fake profiles also posted morphed intimate images claiming to be her.',
    context: 'The victim is worried about her reputation and academic career.',
    categories: cybercrimeCategories,
    correctCategory: 'social-media-crime',
    explanation: 'This is Social Media & Communication Crime involving fake profile creation, impersonation, and morphed images. It includes elements of harassment and defamation.',
    points: 15,
    difficulty: 'medium'
  },
  {
    id: 'scenario-4',
    title: 'Cryptocurrency Investment Scam',
    description: 'A businessman invested ₹5 lakhs in a cryptocurrency scheme promoted through WhatsApp groups. The scheme promised 300% returns in 3 months. After initial small returns, the website disappeared and the WhatsApp group was deleted.',
    context: 'The scheme was promoted by people claiming to be successful traders with fake testimonials.',
    categories: cybercrimeCategories,
    correctCategory: 'cryptocurrency-fraud',
    explanation: 'This is Cryptocurrency & Investment Fraud. The scheme used fake promises of high returns to defraud investors through a fraudulent cryptocurrency platform.',
    points: 15,
    difficulty: 'medium'
  },
  {
    id: 'scenario-5',
    title: 'Romance Scam with Financial Loss',
    description: 'A recently divorced woman met someone on a matrimonial website. After 6 months of online relationship, the person claimed to be stuck in another country due to medical emergency and asked for ₹2 lakhs. After sending money, all communication stopped.',
    context: 'The scammer had created an elaborate fake identity with photos and emotional manipulation over months.',
    categories: cybercrimeCategories,
    correctCategory: 'romance-scam',
    explanation: 'This is a Romance & Relationship Scam where the fraudster created a fake romantic relationship specifically to exploit the victim financially through emotional manipulation.',
    points: 20,
    difficulty: 'hard'
  },
  {
    id: 'scenario-6',
    title: 'Email Account Hacking',
    description: 'A company executive\'s email account was hacked. The hacker sent emails to the executive\'s contacts asking for urgent money transfers for a fake emergency. Several colleagues transferred money before realizing the account was compromised.',
    context: 'The hacker had access to the executive\'s email history and used personal information to make requests seem legitimate.',
    categories: cybercrimeCategories,
    correctCategory: 'hacking',
    explanation: 'This is Hacking & Unauthorized Access. The criminal gained unauthorized access to the email account and used it to commit fraud against the victim\'s contacts.',
    points: 15,
    difficulty: 'medium'
  },
  {
    id: 'scenario-7',
    title: 'Aadhaar Card Misuse',
    description: 'A person discovered that someone had used his Aadhaar card details to open multiple bank accounts and take loans. The fraudster had somehow obtained his Aadhaar number and other personal details to create fake documents.',
    context: 'The victim only discovered this when he was denied a loan due to poor credit history he never created.',
    categories: cybercrimeCategories,
    correctCategory: 'identity-theft',
    explanation: 'This is Identity Theft & Impersonation. The criminal stole and misused the victim\'s Aadhaar details to create fraudulent financial accounts and documents.',
    points: 15,
    difficulty: 'medium'
  },
  {
    id: 'scenario-8',
    title: 'Persistent Online Harassment',
    description: 'A working woman is receiving threatening messages on multiple platforms (WhatsApp, Instagram, email) from an unknown person who claims to know her daily routine. The messages contain personal details about her family and workplace, causing severe mental distress.',
    context: 'The harassment has been ongoing for 3 months and is escalating in frequency and severity.',
    categories: cybercrimeCategories,
    correctCategory: 'cyber-stalking',
    explanation: 'This is Cyber Stalking & Harassment. The persistent threatening behavior across multiple platforms with personal information constitutes cyberstalking.',
    points: 20,
    difficulty: 'hard'
  },
  {
    id: 'scenario-9',
    title: 'Complex Multi-Platform Fraud',
    description: 'A victim received a call claiming to be from a telecom company about KYC update. The caller then sent a link via SMS to update details. After clicking and entering information, the victim\'s social media accounts were hacked, fake posts were made, and money was transferred from linked payment apps.',
    context: 'This involved phone call, SMS, social media hacking, and financial fraud all in one coordinated attack.',
    categories: cybercrimeCategories,
    correctCategory: 'financial-fraud',
    explanation: 'While this involves multiple elements, the primary crime is Financial Fraud as the main motive was monetary theft. The other activities (hacking, fake posts) were means to achieve the financial fraud.',
    points: 25,
    difficulty: 'hard'
  },
  {
    id: 'scenario-10',
    title: 'Fake Job Offer Scam',
    description: 'A recent graduate received a job offer email from a reputed company asking for ₹25,000 as security deposit and processing fee. After payment, the company became unreachable and the job offer was fake.',
    context: 'The email looked official with company letterhead and the scammer used a domain name similar to the real company.',
    categories: cybercrimeCategories,
    correctCategory: 'online-fraud',
    explanation: 'This is Online Shopping & E-commerce Fraud. Although it involves a job offer, it\'s essentially a service fraud where payment was taken for a non-existent service (job placement).',
    points: 10,
    difficulty: 'easy'
  }
];

// Helper function to get scenarios by difficulty
export const getScenariosByDifficulty = (difficulty) => {
  return categorizationScenarios.filter(scenario => scenario.difficulty === difficulty);
};

// Helper function to get random scenarios
export const getRandomScenarios = (count = 5) => {
  const shuffled = [...categorizationScenarios].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default {
  cybercrimeCategories,
  categorizationScenarios,
  getScenariosByDifficulty,
  getRandomScenarios
};
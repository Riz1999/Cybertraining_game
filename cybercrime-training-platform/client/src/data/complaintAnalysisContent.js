/**
 * Complaint Analysis Activity Content
 * 
 * This file contains the content for the Complaint Analysis activity
 * in the Financial Fraud Investigation module.
 */

import React from 'react';

const complaintAnalysisContent = {
  title: "Complaint Analysis and Jurisdiction",
  description: "Analyze a financial fraud complaint and identify key information for investigation.",
  scenario: {
    title: "Investment App Fraud Case",
    description: "A victim reports a loss of Rs. 2.5 lakh from their bank account after clicking on a fraudulent link from a fake investment app.",
    details: (
      <div className="space-y-4">
        <p>
          Mr. Rajesh Kumar (42) from Pune, Maharashtra has filed a complaint on cybercrime.gov.in regarding an unauthorized
          transaction of Rs. 2,50,000 from his SBI account. The incident occurred on June 15, 2023, when he clicked on a link
          received via SMS that appeared to be from a legitimate investment app called &quot;QuickGrowth Investments&quot;.
        </p>
        <p>
          After clicking the link, he was directed to what looked like the official investment app login page. He entered his
          credentials, after which the page showed an error and redirected him to the actual app store. Within minutes, he
          received transaction alerts from his bank showing that Rs. 2,50,000 had been transferred via UPI to an unknown account.
        </p>
        <p>
          The victim has provided screenshots of the SMS, the fraudulent website, transaction alerts, and his bank statement.
          He has also shared the sender&#39;s phone number (9876543210) and the UPI ID (quickpay@ybl) used in the transaction.
        </p>
      </div>
    ),
    evidenceItems: [
      {
        id: "sms-screenshot",
        type: "image",
        title: "SMS Screenshot",
        description: "Screenshot of the fraudulent SMS with investment link",
        url: "/assets/modules/module5/sms-screenshot.jpg",
        hotspots: [
          {
            id: "sender-number",
            x: 20,
            y: 15,
            width: 30,
            height: 10,
            label: "Sender Number",
            info: "The fraudulent message was sent from 9876543210, which is not an official short code."
          },
          {
            id: "phishing-link",
            x: 25,
            y: 50,
            width: 50,
            height: 15,
            label: "Phishing Link",
            info: "The URL &apos;quickgrowth-invest.co.in&apos; is a fraudulent domain designed to mimic the legitimate service."
          },
          {
            id: "urgency-language",
            x: 15,
            y: 70,
            width: 70,
            height: 20,
            label: "Urgency Language",
            info: "The message creates false urgency to prompt immediate action without verification."
          }
        ]
      },
      {
        id: "website-screenshot",
        type: "image",
        title: "Fraudulent Website",
        description: "Screenshot of the fake investment app login page",
        url: "/assets/modules/module5/website-screenshot.jpg",
        hotspots: [
          {
            id: "url-discrepancy",
            x: 10,
            y: 5,
            width: 80,
            height: 10,
            label: "URL Discrepancy",
            info: "The URL shows &apos;quickgrowth-invest.co.in&apos; instead of the legitimate domain &apos;quickgrowth.com&apos;."
          },
          {
            id: "logo-difference",
            x: 40,
            y: 20,
            width: 20,
            height: 20,
            label: "Logo Difference",
            info: "The logo has subtle differences from the original, including different coloring and font."
          },
          {
            id: "security-missing",
            x: 5,
            y: 5,
            width: 10,
            height: 10,
            label: "Missing Security",
            info: "The site lacks HTTPS security indicators that would be present on a legitimate financial site."
          }
        ]
      },
      {
        id: "transaction-alert",
        type: "image",
        title: "Transaction Alert",
        description: "Bank SMS alert showing the unauthorized transaction",
        url: "/assets/modules/module5/transaction-alert.jpg",
        hotspots: [
          {
            id: "transaction-amount",
            x: 30,
            y: 40,
            width: 40,
            height: 15,
            label: "Transaction Amount",
            info: "Rs. 2,50,000 was debited in a single transaction, which is the total amount stolen."
          },
          {
            id: "transaction-time",
            x: 10,
            y: 20,
            width: 30,
            height: 10,
            label: "Transaction Time",
            info: "The transaction occurred at 15:42, just minutes after the victim clicked the phishing link."
          },
          {
            id: "recipient-info",
            x: 20,
            y: 60,
            width: 60,
            height: 15,
            label: "Recipient Information",
            info: "The UPI ID &apos;quickpay@ybl&apos; was used to receive the fraudulent transaction."
          }
        ]
      },
      {
        id: "bank-statement",
        type: "document",
        title: "Bank Statement",
        description: "Victim's bank statement showing the transaction details",
        url: "/assets/modules/module5/bank-statement.pdf",
        keyInfo: [
          "Account Number: XXXX5678",
          "Transaction Date: 15-06-2023",
          "Transaction Time: 15:42:37",
          "Amount: Rs. 2,50,000",
          "Transaction Type: UPI",
          "Recipient: quickpay@ybl",
          "Transaction Reference: UPI/23166543297"
        ]
      }
    ],
    complaintDetails: {
      complaintId: "CC-PUN-2023-06-16-005432",
      dateSubmitted: "16-06-2023",
      platform: "cybercrime.gov.in",
      victimLocation: "Pune, Maharashtra",
      incidentDate: "15-06-2023",
      crimeType: "Financial Fraud",
      subType: "UPI Fraud",
      amountLost: "Rs. 2,50,000"
    }
  },
  tasks: [
    {
      id: "jurisdiction-identification",
      title: "Identify Correct Jurisdiction",
      description: "Based on the complaint details, determine the correct jurisdiction for this case.",
      type: "multiple-choice",
      question: "Which police station has jurisdiction over this cybercrime case?",
      options: [
        {
          id: "option1",
          text: "Cyber Crime Police Station, Pune",
          correct: true,
          explanation: "Correct! Since the victim is located in Pune and the financial transaction originated from there, the Cyber Crime Police Station in Pune has primary jurisdiction."
        },
        {
          id: "option2",
          text: "The police station where the fraudster is located",
          correct: false,
          explanation: "Incorrect. The location of the fraudster is unknown at this stage and is not the determining factor for initial jurisdiction."
        },
        {
          id: "option3",
          text: "The nearest police station to the victim's residence",
          correct: false,
          explanation: "Not necessarily correct. While a regular police station can register a Zero FIR, cybercrime cases are typically handled by specialized cyber cells."
        },
        {
          id: "option4",
          text: "The police station where the bank's headquarters is located",
          correct: false,
          explanation: "Incorrect. The location of the bank's headquarters is not relevant for determining jurisdiction in this case."
        }
      ]
    },
    {
      id: "evidence-extraction",
      title: "Extract Key Evidence",
      description: "Identify and extract the key pieces of evidence from the complaint that will be crucial for investigation.",
      type: "drag-drop",
      instructions: "Drag each piece of evidence to the correct category for investigation.",
      items: [
        {
          id: "item1",
          text: "Phone number 9876543210",
          category: "suspect-identifiers"
        },
        {
          id: "item2",
          text: "UPI ID quickpay@ybl",
          category: "financial-trail"
        },
        {
          id: "item3",
          text: "Website URL quickgrowth-invest.co.in",
          category: "digital-evidence"
        },
        {
          id: "item4",
          text: "Transaction Reference UPI/23166543297",
          category: "financial-trail"
        },
        {
          id: "item5",
          text: "SMS received by victim",
          category: "digital-evidence"
        },
        {
          id: "item6",
          text: "Victim's bank account number",
          category: "victim-information"
        },
        {
          id: "item7",
          text: "Transaction timestamp 15:42:37",
          category: "timeline"
        },
        {
          id: "item8",
          text: "Victim clicked link at approximately 15:40",
          category: "timeline"
        }
      ],
      categories: [
        {
          id: "suspect-identifiers",
          title: "Suspect Identifiers",
          description: "Information that can help identify the suspect"
        },
        {
          id: "financial-trail",
          title: "Financial Trail",
          description: "Information related to the money movement"
        },
        {
          id: "digital-evidence",
          title: "Digital Evidence",
          description: "Digital artifacts related to the crime"
        },
        {
          id: "victim-information",
          title: "Victim Information",
          description: "Details about the victim"
        },
        {
          id: "timeline",
          title: "Timeline",
          description: "Time-related information to establish sequence of events"
        }
      ]
    },
    {
      id: "fir-fields",
      title: "FIR Documentation",
      description: "Match the correct information from the complaint to the appropriate FIR fields.",
      type: "match-pairs",
      instructions: "Match each FIR field with the correct information from the case.",
      pairs: [
        {
          id: "pair1",
          left: "Nature of Crime",
          right: "Financial Fraud (UPI-based)"
        },
        {
          id: "pair2",
          left: "Date of Occurrence",
          right: "15-06-2023"
        },
        {
          id: "pair3",
          left: "Place of Occurrence",
          right: "Victim's location in Pune"
        },
        {
          id: "pair4",
          left: "Applicable IT Act Section",
          right: "Section 66D - Cheating by personation"
        },
        {
          id: "pair5",
          left: "Applicable IPC Section",
          right: "Section 420 - Cheating and dishonestly inducing delivery of property"
        },
        {
          id: "pair6",
          left: "Mode of Operation",
          right: "Phishing through SMS with fraudulent website"
        },
        {
          id: "pair7",
          left: "Loss Amount",
          right: "Rs. 2,50,000"
        },
        {
          id: "pair8",
          left: "Evidence Collected",
          right: "SMS screenshot, website screenshot, transaction alerts, bank statement"
        }
      ]
    },
    {
      id: "hotspot-identification",
      title: "Identify Suspicious Elements",
      description: "Examine the evidence and identify suspicious elements that indicate fraud.",
      type: "hotspot",
      instructions: "Click on the suspicious elements in the images to identify red flags.",
      image: "/assets/modules/module5/combined-evidence.jpg",
      hotspots: [
        {
          id: "hotspot1",
          x: 15,
          y: 25,
          width: 20,
          height: 10,
          label: "Suspicious Sender",
          info: "The SMS was sent from a regular 10-digit number rather than an official short code used by legitimate financial services."
        },
        {
          id: "hotspot2",
          x: 40,
          y: 30,
          width: 25,
          height: 15,
          label: "Fraudulent Domain",
          info: "The domain &apos;quickgrowth-invest.co.in&apos; is a lookalike domain, not the official domain of the investment company."
        },
        {
          id: "hotspot3",
          x: 65,
          y: 45,
          width: 20,
          height: 10,
          label: "Missing HTTPS",
          info: "The website lacks secure HTTPS protocol, indicated by the missing padlock icon in the address bar."
        },
        {
          id: "hotspot4",
          x: 30,
          y: 60,
          width: 30,
          height: 15,
          label: "Suspicious UPI ID",
          info: "The UPI ID &apos;quickpay@ybl&apos; is not officially associated with the investment company."
        },
        {
          id: "hotspot5",
          x: 10,
          y: 75,
          width: 25,
          height: 10,
          label: "Urgency Tactics",
          info: "The message creates false urgency with phrases like &apos;limited time offer&apos; and &apos;act now&apos; to prevent the victim from verifying legitimacy."
        }
      ]
    }
  ],
  quiz: {
    title: "Knowledge Check: Complaint Analysis",
    description: "Test your understanding of complaint analysis and jurisdiction in cybercrime cases.",
    questions: [
      {
        id: "q1",
        text: "Which of the following is the most important first step after receiving a cybercrime complaint?",
        options: [
          {
            id: "q1a",
            text: "Immediately arrest the suspect"
          },
          {
            id: "q1b",
            text: "Verify the complaint details and establish jurisdiction",
            correct: true
          },
          {
            id: "q1c",
            text: "Contact the bank to reverse the transaction"
          },
          {
            id: "q1d",
            text: "File charges under the IT Act"
          }
        ],
        explanation: "Verifying complaint details and establishing jurisdiction is crucial before proceeding with any investigation. This ensures the case is handled by the appropriate authorities and prevents jurisdictional challenges later."
      },
      {
        id: "q2",
        text: "Under which section of the IT Act would 'creating a fake investment app website to steal credentials' primarily fall?",
        options: [
          {
            id: "q2a",
            text: "Section 43 - Unauthorized access to computer system"
          },
          {
            id: "q2b",
            text: "Section 66 - Computer related offenses"
          },
          {
            id: "q2c",
            text: "Section 66C - Identity theft"
          },
          {
            id: "q2d",
            text: "Section 66D - Cheating by personation",
            correct: true
          }
        ],
        explanation: "Section 66D of the IT Act specifically addresses 'Cheating by personation using computer resource,' which applies when someone pretends to be another person or entity (like a legitimate investment app) to cheat others."
      },
      {
        id: "q3",
        text: "What is a 'Zero FIR' in the context of cybercrime reporting?",
        options: [
          {
            id: "q3a",
            text: "An FIR with no suspects identified"
          },
          {
            id: "q3b",
            text: "An FIR filed when zero evidence is available"
          },
          {
            id: "q3c",
            text: "An FIR that can be filed at any police station regardless of jurisdiction",
            correct: true
          },
          {
            id: "q3d",
            text: "An FIR for cases with zero financial loss"
          }
        ],
        explanation: "A Zero FIR can be filed at any police station regardless of jurisdiction. It is then transferred to the appropriate police station with jurisdiction. This ensures victims can report crimes without delay or jurisdictional concerns."
      },
      {
        id: "q4",
        text: "Which of these is NOT typically considered key evidence in a UPI fraud case?",
        options: [
          {
            id: "q4a",
            text: "Transaction reference number"
          },
          {
            id: "q4b",
            text: "UPI ID used for the transaction"
          },
          {
            id: "q4c",
            text: "Victim's educational qualifications",
            correct: true
          },
          {
            id: "q4d",
            text: "Screenshots of fraudulent messages"
          }
        ],
        explanation: "While personal details of the victim are collected, educational qualifications are not typically relevant to investigating a UPI fraud case. The other options are all critical pieces of evidence for tracing the fraud."
      },
      {
        id: "q5",
        text: "What is the time limit for filing a complaint on the cybercrime.gov.in portal after a financial fraud incident?",
        options: [
          {
            id: "q5a",
            text: "24 hours"
          },
          {
            id: "q5b",
            text: "7 days"
          },
          {
            id: "q5c",
            text: "There is no time limit, but reporting within 24-48 hours increases chances of fund recovery",
            correct: true
          },
          {
            id: "q5d",
            text: "30 days"
          }
        ],
        explanation: "There is no strict time limit for filing complaints on cybercrime.gov.in, but reporting financial fraud within 24-48 hours significantly increases the chances of freezing and recovering the stolen funds before they're withdrawn or transferred further."
      }
    ]
  },
  summary: {
    title: "Key Learnings: Complaint Analysis",
    points: [
      "Proper jurisdiction determination is essential for effective cybercrime investigation",
      "Critical evidence in financial fraud cases includes transaction details, communication records, and digital artifacts",
      "Identifying suspicious elements in digital communications helps establish the fraud methodology",
      "Appropriate sections of IT Act and IPC must be applied based on the specific nature of the cybercrime",
      "Timely reporting and analysis significantly increases chances of fund recovery in financial fraud cases"
    ],
    nextSteps: "In the next activity, you will learn about first response procedures and proper evidence collection techniques for digital fraud cases."
  }
};

export default complaintAnalysisContent;
/**
 * Evidence Collection Activity Content
 * 
 * This file contains the content for the First Response and Evidence Collection activity
 * in the Financial Fraud Investigation module.
 */

import React from 'react';

const evidenceCollectionContent = {
  title: "First Response and Evidence Collection",
  description: "Learn proper procedures for securing digital evidence and initiating the investigation.",
  scenario: {
    title: "Securing Evidence in the Investment App Fraud Case",
    description: "The victim has arrived at the police station with their mobile device and additional evidence.",
    details: (
      <div className="space-y-4">
        <p>
          Following the initial complaint analysis, Mr. Rajesh Kumar has arrived at the Cyber Crime Police Station in Pune
          with his mobile phone, laptop, and additional documentation. He has provided access to his device, which contains
          the original SMS, screenshots of the fraudulent website, and the transaction notifications.
        </p>
        <p>
          The investigation team needs to properly secure this digital evidence, document the chain of custody, and take
          immediate steps to attempt recovery of the stolen funds. The team must also draft appropriate notices to the bank
          and payment service providers to freeze the recipient account and trace the transaction trail.
        </p>
        <p>
          Time is critical, as financial fraud investigations require quick action to prevent further movement of funds.
          All evidence collection must follow proper legal procedures to ensure admissibility in court under Section 65B
          of the Indian Evidence Act.
        </p>
      </div>
    ),
    evidenceItems: [
      {
        id: "mobile-phone",
        type: "device",
        title: "Victim&apos;s Mobile Phone",
        description: "Samsung Galaxy S21 containing original SMS and banking app with transaction history",
        securityMeasures: [
          "Enable airplane mode to prevent remote wiping",
          "Document device state (battery level, visible damage, etc.)",
          "Photograph device before handling",
          "Use write blocker for data extraction"
        ]
      },
      {
        id: "laptop",
        type: "device",
        title: "Victim&apos;s Laptop",
        description: "Dell XPS 13 used to access banking services and check account after fraud notification",
        securityMeasures: [
          "Disconnect from internet before examination",
          "Document running processes and open applications",
          "Create forensic image before analysis",
          "Preserve browser history and cache"
        ]
      },
      {
        id: "bank-statements",
        type: "document",
        title: "Physical Bank Statements",
        description: "Three months of bank statements showing normal transaction patterns and the fraudulent transaction",
        securityMeasures: [
          "Scan documents with proper chain of custody documentation",
          "Store originals in evidence locker",
          "Create certified copies for investigation file",
          "Document who handled the evidence and when"
        ]
      },
      {
        id: "email-correspondence",
        type: "digital",
        title: "Email Correspondence with Bank",
        description: "Emails between victim and bank regarding the unauthorized transaction",
        securityMeasures: [
          "Preserve full email headers",
          "Export emails in forensically sound format",
          "Verify email timestamps and sender information",
          "Document email acquisition method"
        ]
      }
    ]
  },
  tasks: [
    {
      id: "evidence-securing",
      title: "Secure Digital Evidence",
      description: "Select the correct tools and procedures for securing each type of digital evidence.",
      type: "tool-selection",
      instructions: "For each evidence item, select the appropriate tools and procedures to secure it properly.",
      evidenceItems: [
        {
          id: "mobile-evidence",
          name: "Mobile Phone Evidence",
          description: "The victim&apos;s mobile phone containing SMS, app data, and transaction notifications",
          tools: [
            {
              id: "tool1",
              name: "Faraday Bag",
              correct: true,
              explanation: "Prevents remote connection and potential evidence tampering"
            },
            {
              id: "tool2",
              name: "Mobile Forensic Extraction Tool",
              correct: true,
              explanation: "Allows proper extraction of data while maintaining integrity"
            },
            {
              id: "tool3",
              name: "Evidence Marker Tags",
              correct: true,
              explanation: "Properly labels and identifies the evidence"
            },
            {
              id: "tool4",
              name: "Regular USB Cable",
              correct: false,
              explanation: "May alter data on the device; use write-blockers instead"
            },
            {
              id: "tool5",
              name: "Cloud Backup Service",
              correct: false,
              explanation: "Not forensically sound; may alter metadata and compromise chain of custody"
            }
          ]
        },
        {
          id: "browser-evidence",
          name: "Browser History Evidence",
          description: "Web browser history showing access to the fraudulent website",
          tools: [
            {
              id: "tool6",
              name: "Forensic Browser Analyzer",
              correct: true,
              explanation: "Extracts browser artifacts without altering them"
            },
            {
              id: "tool7",
              name: "Write Blocker",
              correct: true,
              explanation: "Prevents accidental modification of data during examination"
            },
            {
              id: "tool8",
              name: "Screenshot Tool",
              correct: true,
              explanation: "Documents visual evidence of browser history"
            },
            {
              id: "tool9",
              name: "Browser&apos;s Export Function",
              correct: false,
              explanation: "May not capture all forensic artifacts and could alter timestamps"
            },
            {
              id: "tool10",
              name: "System Restore",
              correct: false,
              explanation: "Would destroy evidence rather than preserve it"
            }
          ]
        }
      ]
    }
  ]
};

// Add the remaining evidence items and tasks
const additionalContent = {
  tasks: [
    {
      id: "notice-drafting",
      title: "Draft Legal Notices",
      description: "Complete the template notices to banks and payment providers to freeze accounts and preserve evidence.",
      type: "fill-in-blanks",
      instructions: "Fill in the blanks to complete the legal notice templates with the correct information.",
      templates: [
        {
          id: "bank-notice",
          title: "Notice to Bank for Account Freezing",
          text: "To,\\nThe Branch Manager,\\n[BLANK-1] Bank, [BLANK-2] Branch\\n\\nSubject: Request for Freezing Account No. [BLANK-3] under Section [BLANK-4] of the Information Technology Act, 2000\\n\\nDear Sir/Madam,\\n\\nThis is to inform you that a cybercrime investigation has been initiated based on FIR No. [BLANK-5] dated [BLANK-6] at [BLANK-7] Police Station regarding a fraudulent transaction of Rs. [BLANK-8].\\n\\nAs per the investigation, the proceeds of crime have been transferred to Account No. [BLANK-3] held at your bank. To prevent further dissipation of these funds and in the interest of investigation, you are hereby directed to:\\n\\n1. Immediately freeze Account No. [BLANK-3] and stop all outward transactions\\n2. Provide complete KYC details of the account holder within [BLANK-9] hours\\n3. Furnish transaction statements of this account for the period [BLANK-10] to [BLANK-11]\\n4. Preserve all records related to this account for investigation purposes\\n\\nThis notice is issued under Section [BLANK-4] of the Information Technology Act, 2000, and Section [BLANK-12] of the Code of Criminal Procedure. Non-compliance may attract legal consequences.\\n\\nYours faithfully,\\n[BLANK-13]\\nInvestigating Officer",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "SBI",
              hint: "The victim&apos;s bank as mentioned in the case"
            },
            {
              id: "blank2",
              correctAnswer: "Pune",
              hint: "Location of the bank branch"
            },
            {
              id: "blank3",
              correctAnswer: "XXXX5678",
              hint: "The victim&apos;s account number from the bank statement"
            },
            {
              id: "blank4",
              correctAnswer: "43A",
              hint: "IT Act section for compensation for failure to protect data"
            },
            {
              id: "blank5",
              correctAnswer: "CC-PUN-2023-06-16-005432",
              hint: "The complaint ID from the case details"
            },
            {
              id: "blank6",
              correctAnswer: "16-06-2023",
              hint: "Date when the complaint was filed"
            },
            {
              id: "blank7",
              correctAnswer: "Cyber Crime",
              hint: "Type of police station handling the case"
            },
            {
              id: "blank8",
              correctAnswer: "2,50,000",
              hint: "Amount lost in the fraud"
            },
            {
              id: "blank9",
              correctAnswer: "24",
              hint: "Standard timeframe for KYC details in urgent cases"
            },
            {
              id: "blank10",
              correctAnswer: "15-05-2023",
              hint: "One month before the incident"
            },
            {
              id: "blank11",
              correctAnswer: "16-06-2023",
              hint: "Date of the complaint"
            },
            {
              id: "blank12",
              correctAnswer: "91",
              hint: "CrPC section for summons to produce document or other thing"
            },
            {
              id: "blank13",
              correctAnswer: "Inspector",
              hint: "Rank of the investigating officer"
            }
          ]
        }
      ]
    },
    {
      id: "evidence-chain",
      title: "Create Evidence Chain of Custody",
      description: "Establish a proper chain of custody for the digital evidence collected in this case.",
      type: "sequence",
      instructions: "Arrange the following steps in the correct order to establish a proper chain of custody for digital evidence.",
      steps: [
        {
          id: "step1",
          text: "Document the initial state of the evidence (take photographs, note visible characteristics)",
          correctPosition: 1
        },
        {
          id: "step2",
          text: "Assign a unique case identifier and evidence number to each item",
          correctPosition: 2
        },
        {
          id: "step3",
          text: "Use appropriate tools to create forensic images or copies of digital evidence",
          correctPosition: 3
        },
        {
          id: "step4",
          text: "Generate and document hash values for digital evidence to verify integrity",
          correctPosition: 4
        },
        {
          id: "step5",
          text: "Complete evidence collection forms with detailed descriptions and timestamps",
          correctPosition: 5
        },
        {
          id: "step6",
          text: "Secure original evidence in appropriate storage with access controls",
          correctPosition: 6
        },
        {
          id: "step7",
          text: "Log each transfer or access to the evidence with date, time, and purpose",
          correctPosition: 7
        },
        {
          id: "step8",
          text: "Prepare Section 65B certificate for electronic evidence admissibility",
          correctPosition: 8
        }
      ]
    },
    {
      id: "section-65b",
      title: "Section 65B Certificate",
      description: "Prepare a Section 65B certificate for the electronic evidence collected in this case.",
      type: "form-completion",
      instructions: "Complete the Section 65B certificate form with the appropriate information for this case.",
      formFields: [
        {
          id: "field1",
          label: "Certificate Issuer Name and Designation",
          type: "text",
          correctAnswer: "Inspector, Cyber Crime Police Station, Pune",
          hint: "The investigating officer&apos;s rank and station"
        },
        {
          id: "field2",
          label: "Case Reference Number",
          type: "text",
          correctAnswer: "CC-PUN-2023-06-16-005432",
          hint: "The complaint ID from the case details"
        },
        {
          id: "field3",
          label: "Description of Computer Output",
          type: "textarea",
          correctAnswer: "SMS message received on victim&apos;s Samsung Galaxy S21 mobile phone on 15-06-2023 containing fraudulent investment link, screenshots of fraudulent website &apos;quickgrowth-invest.co.in&apos;, and UPI transaction notifications from SBI banking app showing unauthorized transaction of Rs. 2,50,000",
          hint: "Detailed description of the electronic evidence being certified"
        },
        {
          id: "field4",
          label: "Device Information",
          type: "textarea",
          correctAnswer: "Samsung Galaxy S21, IMEI: 352698741256987, belonging to Mr. Rajesh Kumar, containing SBI banking app and SMS messages related to the fraudulent transaction",
          hint: "Information about the device from which evidence was collected"
        },
        {
          id: "field5",
          label: "Method of Evidence Collection",
          type: "textarea",
          correctAnswer: "Forensic image created using Cellebrite UFED Touch 2 with write-blocker protection. MD5 hash value generated and verified for evidence integrity. Original device secured in Faraday bag and stored in evidence locker.",
          hint: "Technical details of how the evidence was collected and preserved"
        },
        {
          id: "field6",
          label: "Declaration of Compliance",
          type: "textarea",
          correctAnswer: "I hereby certify that the computer output mentioned above was produced during the regular use of the computer system, which was operating properly during the relevant period. The information contained in the electronic record was regularly fed into the computer in the ordinary course of activities. The computer output is derived from such information fed into the computer in the ordinary course of activities.",
          hint: "Standard declaration required for Section 65B certificate"
        },
        {
          id: "field7",
          label: "Date of Certificate Issuance",
          type: "text",
          correctAnswer: "16-06-2023",
          hint: "Date when the certificate is being issued"
        }
      ]
    }
  ],
  quiz: {
    title: "Knowledge Check: Evidence Collection",
    description: "Test your understanding of digital evidence collection and legal requirements.",
    questions: [
      {
        id: "q1",
        text: "Why is Section 65B of the Indian Evidence Act important in cybercrime cases?",
        options: [
          {
            id: "q1a",
            text: "It allows for arrest without warrant in cybercrime cases"
          },
          {
            id: "q1b",
            text: "It provides for higher penalties in financial fraud cases"
          },
          {
            id: "q1c",
            text: "It establishes the admissibility of electronic records as evidence in court",
            correct: true
          },
          {
            id: "q1d",
            text: "It grants special powers to cyber police stations"
          }
        ],
        explanation: "Section 65B of the Indian Evidence Act establishes the conditions under which electronic records can be admitted as evidence in court proceedings. It requires a certificate that authenticates the electronic evidence and confirms it was produced by a computer that was functioning properly."
      },
      {
        id: "q2",
        text: "What is the primary purpose of using a Faraday bag when collecting mobile phone evidence?",
        options: [
          {
            id: "q2a",
            text: "To prevent physical damage to the device"
          },
          {
            id: "q2b",
            text: "To block network signals and prevent remote wiping or alteration of evidence",
            correct: true
          },
          {
            id: "q2c",
            text: "To extract data faster from the device"
          },
          {
            id: "q2d",
            text: "To comply with Section 65B requirements"
          }
        ],
        explanation: "A Faraday bag blocks all network signals (cellular, WiFi, Bluetooth) to and from the device, preventing remote wiping, data alteration, or communication with external servers. This preserves the integrity of the evidence in its current state."
      },
      {
        id: "q3",
        text: "Which of the following is NOT a required element in a chain of custody documentation?",
        options: [
          {
            id: "q3a",
            text: "Names of all individuals who handled the evidence"
          },
          {
            id: "q3b",
            text: "Dates and times of evidence transfers"
          },
          {
            id: "q3c",
            text: "Educational qualifications of the investigating officer",
            correct: true
          },
          {
            id: "q3d",
            text: "Purpose for accessing the evidence"
          }
        ],
        explanation: "While the investigating officer&apos;s credentials may be relevant in court testimony, the educational qualifications are not a required element in chain of custody documentation. The chain of custody must document who handled the evidence, when, where, and for what purpose to establish that evidence was not tampered with."
      },
      {
        id: "q4",
        text: "Under which section of the Code of Criminal Procedure can a police officer request banking transaction details in a cybercrime case?",
        options: [
          {
            id: "q4a",
            text: "Section 41"
          },
          {
            id: "q4b",
            text: "Section 91",
            correct: true
          },
          {
            id: "q4c",
            text: "Section 102"
          },
          {
            id: "q4d",
            text: "Section 166"
          }
        ],
        explanation: "Section 91 of the CrPC empowers a police officer to issue a written order requiring the production of any document or other thing necessary for investigation. This is the appropriate section to cite when requesting banking transaction details."
      },
      {
        id: "q5",
        text: "What is a hash value in the context of digital evidence, and why is it important?",
        options: [
          {
            id: "q5a",
            text: "It&apos;s a password to access encrypted evidence"
          },
          {
            id: "q5b",
            text: "It&apos;s a unique identifier for the investigating officer"
          },
          {
            id: "q5c",
            text: "It&apos;s a unique digital fingerprint that verifies the integrity of the evidence",
            correct: true
          },
          {
            id: "q5d",
            text: "It&apos;s a classification code for different types of cybercrimes"
          }
        ],
        explanation: "A hash value is a unique digital fingerprint (a fixed-length string of characters) generated from a file or data. Any change to the data, no matter how small, will produce a completely different hash value. By documenting the hash value at the time of collection and verifying it later, investigators can prove the evidence has not been altered."
      }
    ]
  },
  summary: {
    title: "Key Learnings: Evidence Collection",
    points: [
      "Proper digital evidence collection requires specialized tools and procedures to maintain integrity",
      "Section 65B certificates are essential for ensuring electronic evidence is admissible in court",
      "Chain of custody documentation must be meticulous and account for all evidence handling",
      "Legal notices to financial institutions must cite appropriate sections of IT Act and CrPC",
      "Timely evidence collection and account freezing significantly increases chances of fund recovery"
    ],
    nextSteps: "In the next activity, you will learn how to trace complex transaction trails across multiple accounts and payment systems."
  }
};

// Merge the additional content with the existing evidenceCollectionContent
evidenceCollectionContent.tasks = [...evidenceCollectionContent.tasks, ...additionalContent.tasks];
evidenceCollectionContent.quiz = additionalContent.quiz;
evidenceCollectionContent.summary = additionalContent.summary;

export default evidenceCollectionContent;
/**
 * Legal Case Building Content
 * 
 * This file contains the content for the Legal Case Building level (Level 4)
 * of the Financial Fraud Investigation module.
 */
import React from 'react';

const legalCaseBuildingContent = {
  title: "Legal Case Building",
  description: "Learn how to build a strong legal case with appropriate IPC and IT Act sections.",
  
  scenario: {
    title: "Building the Legal Case",
    description: "Now that you've traced the transaction trail and identified the mule accounts, it's time to build a strong legal case against the perpetrators.",
    details: (
      <div className="space-y-4">
        <p>
          Based on your investigation so far, you have gathered substantial evidence about the Rs. 2.5 lakh fraud case. 
          The victim, Mr. Sharma, was deceived through a fake banking website, and the funds were transferred through 
          multiple accounts before being withdrawn.
        </p>
        <p>
          Your task now is to build a legal case that will stand in court. This involves:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Assigning appropriate legal sections from IPC and IT Act</li>
          <li>Organizing evidence in chronological order</li>
          <li>Drafting a comprehensive case report</li>
          <li>Ensuring all evidence is admissible in court</li>
        </ul>
        <p>
          Remember, a well-built legal case significantly increases the chances of successful prosecution.
        </p>
      </div>
    )
  },
  
  tasks: [
    {
      title: "Legal Section Assignment",
      description: "Match the appropriate legal sections from IPC and IT Act to the offenses committed in this case.",
      instructions: "Review the case details and match each offense with the appropriate legal section. Select the correct legal section for each offense described.",
      legalSections: [
        {
          id: "section1",
          offense: "Creating a fake banking website to deceive users",
          correctSection: "Section 66D of IT Act",
          options: [
            "Section 66D of IT Act",
            "Section 420 of IPC",
            "Section 468 of IPC",
            "Section 66C of IT Act"
          ],
          explanation: "Section 66D of IT Act deals with cheating by personation using computer resource."
        },
        {
          id: "section2",
          offense: "Dishonestly inducing the victim to transfer money",
          correctSection: "Section 420 of IPC",
          options: [
            "Section 420 of IPC",
            "Section 66 of IT Act",
            "Section 467 of IPC",
            "Section 66B of IT Act"
          ],
          explanation: "Section 420 of IPC covers cheating and dishonestly inducing delivery of property."
        },
        {
          id: "section3",
          offense: "Using forged electronic records to commit fraud",
          correctSection: "Section 468 of IPC",
          options: [
            "Section 468 of IPC",
            "Section 66C of IT Act",
            "Section 471 of IPC",
            "Section 66F of IT Act"
          ],
          explanation: "Section 468 of IPC deals with forgery for the purpose of cheating."
        },
        {
          id: "section4",
          offense: "Stealing victim's identity information for fraud",
          correctSection: "Section 66C of IT Act",
          options: [
            "Section 66C of IT Act",
            "Section 419 of IPC",
            "Section 465 of IPC",
            "Section 66B of IT Act"
          ],
          explanation: "Section 66C of IT Act covers identity theft using computer resource."
        },
        {
          id: "section5",
          offense: "Concealing money through multiple accounts",
          correctSection: "Section 411 of IPC",
          options: [
            "Section 411 of IPC",
            "Section 66E of IT Act",
            "Section 415 of IPC",
            "Section 66 of IT Act"
          ],
          explanation: "Section 411 of IPC deals with dishonestly receiving stolen property."
        }
      ]
    },
    {
      title: "Evidence Chronological Organization",
      description: "Organize the collected evidence in chronological order to establish the sequence of events.",
      instructions: "Arrange the evidence items in chronological order by using the up and down arrows. The correct sequence will help establish the timeline of the crime.",
      evidenceItems: [
        {
          id: "evidence1",
          description: "Victim received phishing email with fake bank link",
          timestamp: "2023-05-10 09:15:22",
          correctPosition: 1
        },
        {
          id: "evidence2",
          description: "Victim accessed fake banking website",
          timestamp: "2023-05-10 10:30:45",
          correctPosition: 2
        },
        {
          id: "evidence3",
          description: "Victim entered credentials on fake website",
          timestamp: "2023-05-10 10:32:18",
          correctPosition: 3
        },
        {
          id: "evidence4",
          description: "Fraudulent transaction initiated",
          timestamp: "2023-05-10 10:35:07",
          correctPosition: 4
        },
        {
          id: "evidence5",
          description: "Money transferred to first mule account",
          timestamp: "2023-05-10 10:36:12",
          correctPosition: 5
        },
        {
          id: "evidence6",
          description: "Money split and transferred to secondary accounts",
          timestamp: "2023-05-10 14:22:36",
          correctPosition: 6
        },
        {
          id: "evidence7",
          description: "Cash withdrawal from ATM in Delhi",
          timestamp: "2023-05-11 09:45:30",
          correctPosition: 7
        },
        {
          id: "evidence8",
          description: "Victim filed complaint with cyber cell",
          timestamp: "2023-05-12 11:20:15",
          correctPosition: 8
        }
      ]
    },
    {
      title: "Case Report Drafting",
      description: "Draft a comprehensive case report that includes all essential elements required for prosecution.",
      instructions: "Complete the case report by filling in the missing information. Select the most appropriate option for each blank field.",
      reportTemplate: {
        title: "Cybercrime Financial Fraud Investigation Report",
        sections: [
          {
            id: "section1",
            title: "Case Summary",
            content: "This report details the investigation of a cybercrime financial fraud case where the victim, Mr. Sharma, was defrauded of Rs. 2.5 lakh through a [BLANK1] attack.",
            blanks: {
              "BLANK1": {
                options: ["phishing", "ransomware", "malware", "DDoS"],
                correctAnswer: "phishing"
              }
            }
          },
          {
            id: "section2",
            title: "Victim Information",
            content: "The victim, Mr. Sharma, is a [BLANK1] year old resident of Mumbai who reported the incident on [BLANK2].",
            blanks: {
              "BLANK1": {
                options: ["45", "52", "38", "61"],
                correctAnswer: "52"
              },
              "BLANK2": {
                options: ["May 11, 2023", "May 12, 2023", "May 13, 2023", "May 14, 2023"],
                correctAnswer: "May 12, 2023"
              }
            }
          },
          {
            id: "section3",
            title: "Modus Operandi",
            content: "The perpetrators created a [BLANK1] of the victim's bank website and sent a deceptive email claiming [BLANK2], which led the victim to enter his credentials.",
            blanks: {
              "BLANK1": {
                options: ["replica", "virus", "trojan", "backdoor"],
                correctAnswer: "replica"
              },
              "BLANK2": {
                options: ["account suspension", "security update required", "unauthorized access detected", "bonus reward available"],
                correctAnswer: "security update required"
              }
            }
          },
          {
            id: "section4",
            title: "Technical Evidence",
            content: "The investigation revealed that the phishing website was hosted on a server in [BLANK1] with IP address [BLANK2].",
            blanks: {
              "BLANK1": {
                options: ["Russia", "China", "Ukraine", "Romania"],
                correctAnswer: "Romania"
              },
              "BLANK2": {
                options: ["192.168.1.1", "103.45.67.89", "10.0.0.1", "172.16.254.1"],
                correctAnswer: "103.45.67.89"
              }
            }
          },
          {
            id: "section5",
            title: "Financial Trail",
            content: "The defrauded amount of Rs. 2.5 lakh was transferred through [BLANK1] different accounts before being withdrawn as cash from ATMs in [BLANK2].",
            blanks: {
              "BLANK1": {
                options: ["three", "four", "five", "six"],
                correctAnswer: "five"
              },
              "BLANK2": {
                options: ["Mumbai", "Delhi", "Bangalore", "Hyderabad"],
                correctAnswer: "Delhi"
              }
            }
          }
        ]
      }
    },
    {
      title: "Evidence Admissibility Assessment",
      description: "Assess which evidence is admissible in court and understand the legal requirements for digital evidence.",
      instructions: "For each piece of evidence, determine whether it is admissible in court and select the correct reason.",
      evidenceItems: [
        {
          id: "evidence1",
          description: "Screenshot of phishing email taken by victim",
          isAdmissible: false,
          correctReason: "Not collected through proper chain of custody",
          options: [
            "Not collected through proper chain of custody",
            "Not relevant to the case",
            "Violates privacy laws",
            "Exceeds statute of limitations"
          ]
        },
        {
          id: "evidence2",
          description: "Bank transaction records obtained through official request",
          isAdmissible: true,
          correctReason: "Obtained through legal channels with proper documentation",
          options: [
            "Obtained through legal channels with proper documentation",
            "Self-authenticating under Evidence Act",
            "Victim consent makes it admissible",
            "Public records exception applies"
          ]
        },
        {
          id: "evidence3",
          description: "IP logs from ISP obtained with court order",
          isAdmissible: true,
          correctReason: "Obtained with proper legal authorization",
          options: [
            "Obtained with proper legal authorization",
            "Technical evidence is always admissible",
            "ISP data is public information",
            "Cybercrime cases have relaxed evidence rules"
          ]
        },
        {
          id: "evidence4",
          description: "CCTV footage of ATM withdrawal obtained 45 days after incident",
          isAdmissible: false,
          correctReason: "Footage retention period expired, chain of custody broken",
          options: [
            "Footage retention period expired, chain of custody broken",
            "CCTV footage is never admissible without consent",
            "Image quality too poor for identification",
            "ATM location outside jurisdiction"
          ]
        },
        {
          id: "evidence5",
          description: "Digital forensic analysis of phishing website",
          isAdmissible: true,
          correctReason: "Conducted by certified examiner following standard procedures",
          options: [
            "Conducted by certified examiner following standard procedures",
            "All digital forensic reports are automatically admissible",
            "Website content is in public domain",
            "Phishing is a strict liability offense"
          ]
        },
        {
          id: "evidence6",
          description: "Call recordings between victim and fraudster",
          isAdmissible: false,
          correctReason: "Recorded without proper consent or authorization",
          options: [
            "Recorded without proper consent or authorization",
            "Audio quality too poor for voice identification",
            "Telephone evidence is not admissible in cybercrime cases",
            "Exceeds permitted evidence collection timeframe"
          ]
        }
      ]
    }
  ],
  
  summary: {
    title: "Legal Case Building Summary",
    points: [
      "You've learned how to assign appropriate legal sections from IPC and IT Act to specific cybercrimes",
      "You've practiced organizing digital evidence in chronological order to establish the timeline of events",
      "You've developed skills in drafting comprehensive cybercrime case reports with all essential elements",
      "You've gained understanding of evidence admissibility requirements in cybercrime cases",
      "You now know how to build a legally sound case that can withstand scrutiny in court"
    ],
    nextSteps: "In the next level, you will learn about interstate coordination for cybercrime cases, suspect interrogation techniques, and post-arrest procedures."
  }
};

export default legalCaseBuildingContent;
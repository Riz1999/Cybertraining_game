/**
 * FIR Documentation Requirements Content
 * 
 * This file contains the content for the FIR Documentation Requirements activity
 * in the Escalation to FIR and CCTNS module.
 */

import React from 'react';

const firDocumentationContent = {
  title: "FIR Documentation Requirements",
  description: "Learn about the essential documentation requirements for filing cybercrime FIRs in the CCTNS system.",
  sections: [
    {
      title: "Introduction to FIR Documentation",
      content: (
        <div>
          <p className="mb-4">
            First Information Reports (FIRs) for cybercrime cases require specific documentation to ensure proper investigation and prosecution. 
            This documentation serves as the foundation for the entire case and must be comprehensive, accurate, and properly formatted.
          </p>
          <p className="mb-4">
            When escalating a cybercrime complaint to an FIR, officers must ensure all required documentation is collected and properly organized 
            before filing in the Crime and Criminal Tracking Network & Systems (CCTNS).
          </p>
          <p>
            This activity will guide you through the essential documentation requirements for cybercrime FIRs, focusing on financial fraud cases.
          </p>
        </div>
      ),
      highlights: [
        "FIR documentation is the foundation for cybercrime investigation",
        "Proper documentation increases chances of successful prosecution",
        "CCTNS requires specific formats and information fields"
      ]
    },
    {
      title: "Core Documentation Requirements",
      content: (
        <div>
          <h4 className="font-medium text-lg mb-3">Essential Documents for Cybercrime FIRs</h4>
          
          <ol className="list-decimal pl-5 space-y-4 mb-6">
            <li>
              <strong>Victim Statement</strong>
              <p className="text-sm text-gray-600 mt-1">
                Detailed account of the incident including dates, times, and sequence of events. Must be signed by the victim 
                and include contact information.
              </p>
            </li>
            <li>
              <strong>Transaction Evidence</strong>
              <p className="text-sm text-gray-600 mt-1">
                Bank statements, screenshots of transactions, payment receipts, or any other evidence of financial transactions 
                related to the crime.
              </p>
            </li>
            <li>
              <strong>Digital Evidence</strong>
              <p className="text-sm text-gray-600 mt-1">
                Screenshots of websites, emails, messages, or other digital communications related to the fraud. 
                Must include timestamps and source information.
              </p>
            </li>
            <li>
              <strong>Preliminary Investigation Report</strong>
              <p className="text-sm text-gray-600 mt-1">
                Summary of initial findings, including verification steps taken, bank responses, and timeline of complaint handling.
              </p>
            </li>
            <li>
              <strong>Technical Details Form</strong>
              <p className="text-sm text-gray-600 mt-1">
                Documentation of IP addresses, phone numbers, email addresses, website URLs, and other technical identifiers 
                related to the case.
              </p>
            </li>
          </ol>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-2">Documentation Quality Standards</h5>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>All documents must be clearly legible and properly dated</li>
              <li>Digital evidence must include source information and timestamps</li>
              <li>Statements must be signed by the relevant parties</li>
              <li>Technical details must be verified when possible</li>
              <li>Chain of custody must be maintained for all evidence</li>
            </ul>
          </div>
        </div>
      ),
      highlights: [
        "Five essential document types: Victim Statement, Transaction Evidence, Digital Evidence, Investigation Report, Technical Details",
        "All documents must meet quality standards for admissibility",
        "Chain of custody documentation is critical for digital evidence"
      ]
    },
    {
      title: "CCTNS-Specific Requirements",
      content: (
        <div>
          <p className="mb-4">
            When filing a cybercrime FIR in the CCTNS system, additional documentation requirements must be met to ensure 
            proper integration with the national database.
          </p>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CCTNS Format
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Required Fields
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">FIR Cover Sheet</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Form CCTNS-FIR-01</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Case number, police station code, IPC/IT Act sections, officer details
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Victim Details</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Form CCTNS-VIC-02</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Full identification, contact information, ID proof numbers
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Digital Evidence Log</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Form CCTNS-DE-03</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Evidence type, source, timestamp, hash values, custody chain
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Details</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Form CCTNS-TECH-04</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    IP addresses, device information, platform details, account information
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Case Classification</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Form CCTNS-CLASS-05</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Cybercrime type, financial impact, jurisdiction details, priority level
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="mb-4">
            All forms must be completed in full before submission to the CCTNS system. Incomplete forms will be rejected 
            and may delay the investigation process.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> CCTNS forms must be completed within 24 hours of the decision to file an FIR. 
                  Delays beyond this timeframe require additional justification documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      highlights: [
        "CCTNS requires specific standardized forms for cybercrime cases",
        "All forms must be completed in full - incomplete submissions are rejected",
        "24-hour timeline for CCTNS submission after FIR decision"
      ]
    },
    {
      title: "Legal Requirements and Sections",
      content: (
        <div>
          <p className="mb-4">
            Proper documentation of applicable legal sections is critical for cybercrime FIRs. The following sections 
            are commonly applied in financial cybercrime cases:
          </p>
          
          <div className="mb-6">
            <h4 className="font-medium mb-3">Information Technology Act Sections</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Section 66 -</strong> Computer Related Offences
                <p className="text-sm text-gray-600 mt-1">
                  Applies to unauthorized access and data theft cases.
                </p>
              </li>
              <li>
                <strong>Section 66C -</strong> Identity Theft
                <p className="text-sm text-gray-600 mt-1">
                  Applies when fraudster impersonates another person online.
                </p>
              </li>
              <li>
                <strong>Section 66D -</strong> Cheating by Personation
                <p className="text-sm text-gray-600 mt-1">
                  Applies to cases where fraudster pretends to be someone else to cheat victims.
                </p>
              </li>
              <li>
                <strong>Section 43 -</strong> Penalty for Damage to Computer System
                <p className="text-sm text-gray-600 mt-1">
                  Applies to unauthorized access and data manipulation cases.
                </p>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-3">Indian Penal Code Sections</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Section 420 -</strong> Cheating and Dishonestly Inducing Delivery of Property
                <p className="text-sm text-gray-600 mt-1">
                  Primary section for financial fraud cases.
                </p>
              </li>
              <li>
                <strong>Section 468 -</strong> Forgery for Purpose of Cheating
                <p className="text-sm text-gray-600 mt-1">
                  Applies when fraudulent documents are created.
                </p>
              </li>
              <li>
                <strong>Section 471 -</strong> Using as Genuine a Forged Document
                <p className="text-sm text-gray-600 mt-1">
                  Applies when fraudulent documents are used to commit fraud.
                </p>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">Documentation Best Practice</h5>
            <p className="text-green-700 mb-2">
              When documenting applicable sections in the FIR, always include:
            </p>
            <ol className="list-decimal pl-5 text-green-700 space-y-1">
              <li>Complete section number and title</li>
              <li>Brief explanation of how the section applies to the specific case</li>
              <li>Supporting evidence that establishes elements of the offense</li>
              <li>Correlation between digital evidence and legal requirements of the section</li>
            </ol>
          </div>
        </div>
      ),
      highlights: [
        "Both IT Act and IPC sections must be properly documented",
        "Each section requires specific supporting evidence",
        "Documentation must establish all elements of the offense"
      ]
    }
  ],
  attachments: [
    {
      title: "CCTNS Form Templates",
      description: "Standard templates for all required CCTNS forms",
      url: "#"
    },
    {
      title: "Cybercrime Documentation Checklist",
      description: "Comprehensive checklist for ensuring complete documentation",
      url: "#"
    },
    {
      title: "Digital Evidence Handling Guidelines",
      description: "Standard operating procedures for digital evidence",
      url: "#"
    }
  ],
  quizQuestions: [
    {
      id: "q1",
      text: "Which of the following is NOT a required document for filing a cybercrime FIR?",
      answers: [
        {
          id: "q1a1",
          text: "Victim Statement"
        },
        {
          id: "q1a2",
          text: "Transaction Evidence"
        },
        {
          id: "q1a3",
          text: "Character Certificate of the Victim",
          explanation: "Character certificates are not required documentation for cybercrime FIRs. The essential documents include victim statements, transaction evidence, digital evidence, preliminary investigation reports, and technical details forms."
        },
        {
          id: "q1a4",
          text: "Technical Details Form"
        }
      ],
      correctAnswerId: "q1a3"
    },
    {
      id: "q2",
      text: "Within what timeframe must CCTNS forms be completed after the decision to file an FIR?",
      answers: [
        {
          id: "q2a1",
          text: "12 hours"
        },
        {
          id: "q2a2",
          text: "24 hours",
          explanation: "CCTNS forms must be completed within 24 hours of the decision to file an FIR. Delays beyond this timeframe require additional justification documentation."
        },
        {
          id: "q2a3",
          text: "48 hours"
        },
        {
          id: "q2a4",
          text: "72 hours"
        }
      ],
      correctAnswerId: "q2a2"
    },
    {
      id: "q3",
      text: "Which IT Act section applies specifically to cases where a fraudster pretends to be someone else to cheat victims?",
      answers: [
        {
          id: "q3a1",
          text: "Section 66"
        },
        {
          id: "q3a2",
          text: "Section 66C"
        },
        {
          id: "q3a3",
          text: "Section 66D",
          explanation: "Section 66D of the IT Act specifically addresses 'Cheating by Personation' which applies to cases where a fraudster pretends to be someone else to cheat victims."
        },
        {
          id: "q3a4",
          text: "Section 43"
        }
      ],
      correctAnswerId: "q3a3"
    },
    {
      id: "q4",
      text: "What is the CCTNS form number for documenting Digital Evidence Log?",
      answers: [
        {
          id: "q4a1",
          text: "CCTNS-FIR-01"
        },
        {
          id: "q4a2",
          text: "CCTNS-VIC-02"
        },
        {
          id: "q4a3",
          text: "CCTNS-DE-03",
          explanation: "Form CCTNS-DE-03 is specifically for the Digital Evidence Log, which includes evidence type, source, timestamp, hash values, and custody chain information."
        },
        {
          id: "q4a4",
          text: "CCTNS-TECH-04"
        }
      ],
      correctAnswerId: "q4a3"
    },
    {
      id: "q5",
      text: "Which of the following is a critical quality standard for documentation in cybercrime FIRs?",
      answers: [
        {
          id: "q5a1",
          text: "All documents must be notarized"
        },
        {
          id: "q5a2",
          text: "Chain of custody must be maintained for all evidence",
          explanation: "Maintaining chain of custody for all evidence is a critical quality standard for documentation in cybercrime FIRs. This ensures that evidence integrity is preserved and can be verified in court."
        },
        {
          id: "q5a3",
          text: "All documents must be translated into Hindi"
        },
        {
          id: "q5a4",
          text: "Evidence must be collected only by technical experts"
        }
      ],
      correctAnswerId: "q5a2"
    }
  ]
};

export default firDocumentationContent;
/**
 * Transaction Tracing Activity Content
 * 
 * This file contains the content for the Transaction Tracing activity
 * in the Financial Fraud Investigation module.
 */

import React from 'react';

const transactionTracingContent = {
  title: "Tracing the Transaction Trail",
  description: "Follow the money through complex transaction networks to identify perpetrators.",
  scenario: {
    title: "Following the Money Trail in the Investment App Fraud Case",
    description: "Track the flow of funds from the victim's account through multiple intermediaries to identify mule accounts and final destinations.",
    details: (
      <div className="space-y-4">
        <p>
          After securing the evidence and obtaining the necessary legal notices, the investigation team has received
          transaction details from the victim&apos;s bank and the recipient accounts. The Rs. 2.5 lakh fraudulent transaction
          appears to have been routed through multiple accounts to obscure the money trail.
        </p>
        <p>
          Your task is to trace the complete transaction path, identify potential mule accounts used in the fraud,
          and gather intelligence on the digital infrastructure used by the perpetrators. This will involve mapping
          the transaction flow, analyzing WHOIS and IP data for the fraudulent website, and identifying characteristics
          of mule accounts in the transaction chain.
        </p>
        <p>
          Once the transaction trail is mapped and mule accounts are identified, you will need to understand the legal
          steps required for freezing accounts across the transaction chain to maximize fund recovery chances.
        </p>
      </div>
    )
  },
  tasks: [
    {
      id: "transaction-map",
      title: "Map the Transaction Flow",
      description: "Create a visual map of how the funds flowed from the victim's account through multiple intermediaries.",
      type: "transaction-map",
      instructions: "Click on accounts to create connections that show how the money flowed through the system. Your goal is to trace the complete path of the Rs. 2.5 lakh from the victim's account to the final destinations.",
      transactionData: {
        nodes: [
          {
            id: "victim",
            label: "Victim's Account",
            type: "source",
            x: 100,
            y: 250,
            accountNumber: "XXXX5678",
            bank: "SBI",
            location: "Pune"
          },
          {
            id: "primary",
            label: "Primary Recipient",
            type: "intermediate",
            x: 250,
            y: 150,
            accountNumber: "XXXX3456",
            bank: "HDFC Bank",
            location: "Mumbai"
          },
          {
            id: "secondary1",
            label: "Secondary Account 1",
            type: "intermediate",
            x: 400,
            y: 100,
            accountNumber: "XXXX7890",
            bank: "Axis Bank",
            location: "Delhi"
          },
          {
            id: "secondary2",
            label: "Secondary Account 2",
            type: "intermediate",
            x: 400,
            y: 200,
            accountNumber: "XXXX2345",
            bank: "ICICI Bank",
            location: "Bangalore"
          },
          {
            id: "mule1",
            label: "Mule Account 1",
            type: "mule",
            x: 550,
            y: 50,
            accountNumber: "XXXX6789",
            bank: "Yes Bank",
            location: "Hyderabad"
          },
          {
            id: "mule2",
            label: "Mule Account 2",
            type: "mule",
            x: 550,
            y: 150,
            accountNumber: "XXXX1234",
            bank: "Kotak Bank",
            location: "Chennai"
          },
          {
            id: "mule3",
            label: "Mule Account 3",
            type: "mule",
            x: 550,
            y: 250,
            accountNumber: "XXXX8901",
            bank: "IndusInd Bank",
            location: "Kolkata"
          },
          {
            id: "crypto",
            label: "Crypto Exchange",
            type: "destination",
            x: 700,
            y: 150,
            accountNumber: "N/A",
            bank: "Binance",
            location: "International"
          }
        ],
        expectedConnections: [
          {
            from: "victim",
            to: "primary",
            amount: 250000,
            date: "15-06-2023"
          },
          {
            from: "primary",
            to: "secondary1",
            amount: 150000,
            date: "15-06-2023"
          },
          {
            from: "primary",
            to: "secondary2",
            amount: 100000,
            date: "15-06-2023"
          },
          {
            from: "secondary1",
            to: "mule1",
            amount: 75000,
            date: "15-06-2023"
          },
          {
            from: "secondary1",
            to: "mule2",
            amount: 75000,
            date: "15-06-2023"
          },
          {
            from: "secondary2",
            to: "mule2",
            amount: 50000,
            date: "15-06-2023"
          },
          {
            from: "secondary2",
            to: "mule3",
            amount: 50000,
            date: "15-06-2023"
          },
          {
            from: "mule1",
            to: "crypto",
            amount: 75000,
            date: "16-06-2023"
          },
          {
            from: "mule2",
            to: "crypto",
            amount: 125000,
            date: "16-06-2023"
          },
          {
            from: "mule3",
            to: "crypto",
            amount: 50000,
            date: "16-06-2023"
          }
        ],
        hint: "Start from the victim's account and follow the money. Notice how the primary recipient quickly splits the funds into smaller amounts across multiple accounts before they reach the final destination."
      }
    },
    {
      id: "whois-ip-tracing",
      title: "WHOIS and IP Tracing",
      description: "Investigate the digital infrastructure behind the fraudulent investment app website.",
      type: "whois-ip-tracing",
      instructions: "Use the WHOIS and IP lookup tools to investigate the domains and IP addresses associated with the fraud. Search for the fraudulent website domain and related IP addresses to identify key entities involved in the scam.",
      domainData: [
        {
          id: "domain1",
          name: "quickgrowth-invest.co.in",
          registrar: "GoDaddy.com, LLC",
          creationDate: "10-05-2023",
          expirationDate: "10-05-2024",
          status: "Active",
          registrant: {
            name: "John Smith",
            organization: "Quick Growth Investments",
            email: "admin@quickgrowth-invest.co.in",
            phone: "+91.9876543210",
            address: "123 Main St, Mumbai, Maharashtra, India"
          },
          nameServers: [
            "ns1.hostingservice.com",
            "ns2.hostingservice.com"
          ],
          ipAddresses: [
            "103.21.59.174",
            "103.21.59.175"
          ],
          isKeyEntity: true
        },
        {
          id: "domain2",
          name: "hostingservice.com",
          registrar: "NameCheap, Inc.",
          creationDate: "15-01-2020",
          expirationDate: "15-01-2025",
          status: "Active",
          registrant: {
            name: "Domain Admin",
            organization: "Privacy Protection Service",
            email: "admin@hostingservice.com",
            phone: "+1.5555555555",
            address: "Privacy Protected"
          },
          nameServers: [
            "ns1.hostingservice.com",
            "ns2.hostingservice.com"
          ],
          ipAddresses: [
            "103.21.59.100",
            "103.21.59.101"
          ],
          isKeyEntity: false
        },
        {
          id: "domain3",
          name: "secure-investments.net",
          registrar: "Tucows Domains Inc.",
          creationDate: "05-04-2023",
          expirationDate: "05-04-2024",
          status: "Active",
          registrant: {
            name: "John Smith",
            organization: "Secure Investment Solutions",
            email: "admin@secure-investments.net",
            phone: "+91.9876543210",
            address: "456 Business Park, Delhi, India"
          },
          nameServers: [
            "ns1.hostingservice.com",
            "ns2.hostingservice.com"
          ],
          ipAddresses: [
            "103.21.59.174"
          ],
          isKeyEntity: true
        }
      ],
      ipData: [
        {
          id: "ip1",
          address: "103.21.59.174",
          location: "Riga, Latvia",
          isp: "SIA Cloudhosting",
          organization: "Anonymous Hosting Ltd",
          asn: "AS12345",
          hostingProvider: {
            name: "Anonymous Hosting Ltd",
            abuseContact: "abuse@anonymoushosting.com",
            address: "1 Server Street, Riga, Latvia"
          },
          domains: [
            "quickgrowth-invest.co.in",
            "secure-investments.net",
            "fast-returns.com"
          ],
          isKeyEntity: true
        },
        {
          id: "ip2",
          address: "103.21.59.175",
          location: "Riga, Latvia",
          isp: "SIA Cloudhosting",
          organization: "Anonymous Hosting Ltd",
          asn: "AS12345",
          hostingProvider: {
            name: "Anonymous Hosting Ltd",
            abuseContact: "abuse@anonymoushosting.com",
            address: "1 Server Street, Riga, Latvia"
          },
          domains: [
            "quickgrowth-invest.co.in"
          ],
          isKeyEntity: false
        },
        {
          id: "ip3",
          address: "45.132.192.55",
          location: "Moscow, Russia",
          isp: "LLC Baxet",
          organization: "Server Hosting LLC",
          asn: "AS56789",
          hostingProvider: {
            name: "Server Hosting LLC",
            abuseContact: "abuse@serverhosting.com",
            address: "2 Hosting Avenue, Moscow, Russia"
          },
          domains: [
            "fast-returns.com",
            "invest-quick.net"
          ],
          isKeyEntity: true
        }
      ]
    },
    {
      id: "mule-account-identification",
      title: "Mule Account Identification",
      description: "Analyze bank accounts in the transaction chain to identify potential mule accounts.",
      type: "mule-account-identification",
      instructions: "Review the bank account details and transaction patterns to identify which accounts are likely being used as 'mules' in the fraud scheme. Select all accounts that show characteristics of mule accounts.",
      accountData: [
        {
          id: "account1",
          accountNumber: "XXXX3456",
          accountHolder: "Rajiv Sharma",
          bank: "HDFC Bank",
          branch: "Mumbai Main",
          accountType: "Savings",
          openingDate: "15-01-2020",
          kycStatus: "Full KYC",
          transactionPattern: "Regular salary credits and normal spending patterns until June 2023, when a large incoming transaction was immediately split and transferred out.",
          flags: ["Unusual transaction pattern"],
          isMule: false
        },
        {
          id: "account2",
          accountNumber: "XXXX7890",
          accountHolder: "Priya Patel",
          bank: "Axis Bank",
          branch: "Delhi Central",
          accountType: "Savings",
          openingDate: "10-03-2022",
          kycStatus: "Full KYC",
          transactionPattern: "Moderate activity with occasional large transfers. Received Rs. 1,50,000 on June 15, 2023, and immediately transferred to two different accounts.",
          flags: ["Unusual transaction pattern"],
          isMule: false
        },
        {
          id: "account3",
          accountNumber: "XXXX6789",
          accountHolder: "Amit Kumar",
          bank: "Yes Bank",
          branch: "Hyderabad",
          accountType: "Savings",
          openingDate: "05-05-2023",
          kycStatus: "Minimal KYC",
          transactionPattern: "Account opened one month before the fraud. Minimal activity until receiving Rs. 75,000 on June 15, 2023, which was transferred to a crypto exchange the next day.",
          flags: ["Recently opened account", "Minimal KYC", "Immediate outward transfer"],
          isMule: true
        },
        {
          id: "account4",
          accountNumber: "XXXX1234",
          accountHolder: "Sneha Reddy",
          bank: "Kotak Bank",
          branch: "Chennai",
          accountType: "Savings",
          openingDate: "12-04-2023",
          kycStatus: "Minimal KYC",
          transactionPattern: "New account with limited activity. Received two transfers totaling Rs. 1,25,000 on June 15, 2023, and transferred the full amount to a crypto exchange the next day.",
          flags: ["Recently opened account", "Minimal KYC", "Immediate outward transfer", "Multiple incoming transfers"],
          isMule: true
        },
        {
          id: "account5",
          accountNumber: "XXXX8901",
          accountHolder: "Rahul Das",
          bank: "IndusInd Bank",
          branch: "Kolkata",
          accountType: "Savings",
          openingDate: "20-03-2023",
          kycStatus: "Minimal KYC",
          transactionPattern: "Account opened three months before the fraud. Minimal activity until receiving Rs. 50,000 on June 15, 2023, which was transferred to a crypto exchange the next day.",
          flags: ["Recently opened account", "Minimal KYC", "Immediate outward transfer"],
          isMule: true
        },
        {
          id: "account6",
          accountNumber: "XXXX2345",
          accountHolder: "Ananya Singh",
          bank: "ICICI Bank",
          branch: "Bangalore",
          accountType: "Savings",
          openingDate: "05-01-2021",
          kycStatus: "Full KYC",
          transactionPattern: "Regular activity for over two years. Received Rs. 1,00,000 on June 15, 2023, and immediately split and transferred to two different accounts.",
          flags: ["Unusual transaction pattern"],
          isMule: false
        }
      ]
    },
    {
      id: "legal-steps-quiz",
      title: "Legal Steps for Account Freezing",
      description: "Test your knowledge of the legal procedures required for freezing accounts in a financial fraud case.",
      type: "legal-steps-quiz",
      instructions: "Answer the following questions about the legal steps and procedures for freezing bank accounts and recovering funds in cybercrime cases.",
      questions: [
        {
          id: "q1",
          text: "Under which section of the Information Technology Act can a police officer request freezing of a bank account involved in cybercrime?",
          options: [
            {
              id: "q1a",
              text: "Section 66",
              isCorrect: false
            },
            {
              id: "q1b",
              text: "Section 69",
              isCorrect: false
            },
            {
              id: "q1c",
              text: "Section 78",
              isCorrect: false
            },
            {
              id: "q1d",
              text: "Section 43A",
              isCorrect: true
            }
          ],
          explanation: "Section 43A of the IT Act deals with compensation for failure to protect data, which includes financial data. This section is commonly cited when requesting banks to freeze accounts involved in financial fraud."
        },
        {
          id: "q2",
          text: "What is the maximum time period within which banks are required to respond to an account freezing request in a cybercrime case?",
          options: [
            {
              id: "q2a",
              text: "12 hours",
              isCorrect: false
            },
            {
              id: "q2b",
              text: "24 hours",
              isCorrect: true
            },
            {
              id: "q2c",
              text: "48 hours",
              isCorrect: false
            },
            {
              id: "q2d",
              text: "72 hours",
              isCorrect: false
            }
          ],
          explanation: "As per RBI guidelines and standard operating procedures for cybercrime cases, banks are required to respond to account freezing requests within 24 hours to prevent further dissipation of funds."
        },
        {
          id: "q3",
          text: "Which of the following is NOT required in a legal notice to freeze a bank account?",
          options: [
            {
              id: "q3a",
              text: "FIR number and date",
              isCorrect: false
            },
            {
              id: "q3b",
              text: "Account number to be frozen",
              isCorrect: false
            },
            {
              id: "q3c",
              text: "Aadhaar number of the account holder",
              isCorrect: true
            },
            {
              id: "q3d",
              text: "Relevant sections of applicable laws",
              isCorrect: false
            }
          ],
          explanation: "While FIR details, account numbers, and legal sections are required in a freezing notice, the Aadhaar number of the account holder is not a mandatory requirement. The bank can identify the account based on the account number provided."
        },
        {
          id: "q4",
          text: "When freezing multiple accounts in a transaction chain, what is the recommended order of freezing?",
          options: [
            {
              id: "q4a",
              text: "Start with the source account and proceed sequentially",
              isCorrect: false
            },
            {
              id: "q4b",
              text: "Start with the final destination accounts and work backwards",
              isCorrect: false
            },
            {
              id: "q4c",
              text: "Freeze all accounts simultaneously",
              isCorrect: true
            },
            {
              id: "q4d",
              text: "Freeze only mule accounts first, then others",
              isCorrect: false
            }
          ],
          explanation: "To prevent fund dissipation, all accounts in the transaction chain should be frozen simultaneously. This prevents account holders from being tipped off and moving funds before all accounts are secured."
        },
        {
          id: "q5",
          text: "What action should be taken regarding cryptocurrency exchanges identified in the transaction trail?",
          options: [
            {
              id: "q5a",
              text: "No action needed as cryptocurrencies cannot be frozen",
              isCorrect: false
            },
            {
              id: "q5b",
              text: "Send legal notices to the exchanges requesting transaction details and wallet freezing",
              isCorrect: true
            },
            {
              id: "q5c",
              text: "Only domestic cryptocurrency exchanges can be approached",
              isCorrect: false
            },
            {
              id: "q5d",
              text: "Wait for court orders before approaching cryptocurrency exchanges",
              isCorrect: false
            }
          ],
          explanation: "Cryptocurrency exchanges should be approached with legal notices requesting transaction details and wallet freezing. Many exchanges have law enforcement response teams that can assist in fraud cases, regardless of whether they are domestic or international."
        }
      ]
    }
  ],
  summary: {
    title: "Transaction Tracing Summary",
    points: [
      "Financial fraud investigations require meticulous transaction mapping to identify the complete money trail",
      "Digital infrastructure analysis (WHOIS, IP tracing) can reveal connections between seemingly unrelated entities",
      "Mule accounts typically show patterns like recent opening dates, minimal KYC, and rapid fund transfers",
      "Simultaneous freezing of all accounts in the transaction chain maximizes fund recovery chances",
      "Cryptocurrency exchanges can be approached with legal notices to assist in tracking and potentially recovering funds"
    ],
    nextSteps: "In the next activity, you will learn how to build a legal case using the evidence collected, applying appropriate sections of the IPC and IT Act."
  }
};

export default transactionTracingContent;
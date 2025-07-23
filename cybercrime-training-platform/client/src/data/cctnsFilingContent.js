/**
 * CCTNS Filing Procedure Content
 * 
 * This file contains the content for the CCTNS Filing Procedure activity
 * in the Escalation to FIR and CCTNS module.
 */

import React from 'react';

const cctnsFilingContent = {
  title: "CCTNS Filing Procedure",
  description: "Learn the step-by-step procedure for filing cybercrime cases in the Crime and Criminal Tracking Network & Systems (CCTNS).",
  systemName: "CCTNS Training System",
  steps: [
    {
      title: "Introduction to CCTNS Filing",
      content: (
        <div>
          <p className="mb-4">
            The Crime and Criminal Tracking Network & Systems (CCTNS) is a mission mode project under the National e-Governance Plan of the Government of India. 
            It is designed to create a comprehensive and integrated system for enhancing the efficiency and effectiveness of policing.
          </p>
          <p className="mb-4">
            For cybercrime cases, CCTNS filing is a critical step that follows the registration of an FIR. This process ensures that the case is properly 
            documented in the national database and can be tracked across jurisdictions.
          </p>
          <p>
            This activity will guide you through the step-by-step procedure for filing cybercrime cases in CCTNS, with a focus on financial fraud cases.
          </p>
        </div>
      ),
      image: "https://via.placeholder.com/800x400?text=CCTNS+Interface+Overview",
      imageCaption: "CCTNS System Interface Overview"
    },
    {
      title: "Pre-Filing Requirements",
      content: (
        <div>
          <p className="mb-4">
            Before beginning the CCTNS filing process, ensure you have the following information and documents ready:
          </p>
          
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>
              <strong>FIR Number and Date</strong>
              <p className="text-sm text-gray-600 mt-1">
                The registered FIR number from your police station records.
              </p>
            </li>
            <li>
              <strong>Complainant Details</strong>
              <p className="text-sm text-gray-600 mt-1">
                Complete personal information including name, address, contact details, and ID proof.
              </p>
            </li>
            <li>
              <strong>Incident Details</strong>
              <p className="text-sm text-gray-600 mt-1">
                Date, time, and nature of the cybercrime incident.
              </p>
            </li>
            <li>
              <strong>Applicable Sections</strong>
              <p className="text-sm text-gray-600 mt-1">
                IT Act and IPC sections that apply to the case.
              </p>
            </li>
            <li>
              <strong>Digital Evidence Summary</strong>
              <p className="text-sm text-gray-600 mt-1">
                List of all digital evidence collected with reference numbers.
              </p>
            </li>
            <li>
              <strong>Technical Details</strong>
              <p className="text-sm text-gray-600 mt-1">
                IP addresses, email addresses, phone numbers, and other technical identifiers.
              </p>
            </li>
          </ul>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> All information must be verified before entry into CCTNS. Incorrect information 
                  can lead to case rejection or complications in the investigation process.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "CCTNS Login and Navigation",
      content: (
        <div>
          <p className="mb-4">
            To access the CCTNS system, follow these steps:
          </p>
          
          <ol className="list-decimal pl-5 space-y-3 mb-6">
            <li>
              <strong>Access the CCTNS Portal</strong>
              <p className="text-sm text-gray-600 mt-1">
                Open your web browser and navigate to the official CCTNS portal for your state.
              </p>
            </li>
            <li>
              <strong>Login with Credentials</strong>
              <p className="text-sm text-gray-600 mt-1">
                Enter your unique CCTNS ID and password. Use your official police credentials.
              </p>
            </li>
            <li>
              <strong>Select Module</strong>
              <p className="text-sm text-gray-600 mt-1">
                From the dashboard, select the &quot;Investigation&quot; module.
              </p>
            </li>
            <li>
              <strong>Choose Case Registration</strong>
              <p className="text-sm text-gray-600 mt-1">
              Click on &quot;Register New Case&quot; or &quot;FIR Registration&quot; option.
              </p>
            </li>
          </ol>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-2">Security Best Practices</h5>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Never share your CCTNS login credentials with anyone</li>
              <li>Always log out when you finish your session</li>
              <li>Use secure networks when accessing CCTNS</li>
              <li>Report any suspicious activity in your account immediately</li>
            </ul>
          </div>
        </div>
      ),
      image: "https://via.placeholder.com/800x400?text=CCTNS+Login+Screen",
      imageCaption: "CCTNS Login Screen and Navigation Menu"
    },
    {
      title: "Case Information Entry",
      content: (
        <div>
          <p className="mb-4">
            Once you&#39;ve accessed the case registration form, you&#39;ll need to enter the following information systematically:
          </p>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form Section
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Required Information
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Special Instructions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Basic Details</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    FIR number, date, time, police station code
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Use 24-hour format for time
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Complainant Details</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Full name, address, contact information, ID proof details
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Verify ID proof numbers
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Incident Information</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Date, time, location, nature of cybercrime
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Use standard cybercrime categories
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Legal Sections</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Applicable IPC and IT Act sections
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Select from dropdown menus
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Details</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    IP addresses, URLs, phone numbers, email addresses
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Validate format before entry
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="mb-4">
            Each section must be completed accurately. The system will validate entries and highlight any errors or missing information.
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">Pro Tips for Efficient Entry</h5>
            <ul className="list-disc pl-5 text-green-700 space-y-1">
              <li>Save your progress frequently using the &quot;Save Draft&quot; button</li>
              <li>Use the &quot;Validate&quot; button to check for errors before final submission</li>
              <li>Keep all reference documents open in separate tabs for quick access</li>
              <li>Double-check all numerical entries (phone numbers, amounts, dates)</li>
            </ul>
          </div>
        </div>
      )
    }
  ],
  formFields: [
    {
      id: "firNumber",
      label: "FIR Number",
      type: "text",
      required: true,
      placeholder: "Enter FIR number (e.g., 123/2024)",
      hint: "Format: Sequential number/Year (e.g., 123/2024)"
    },
    {
      id: "firDate",
      label: "FIR Date",
      type: "date",
      required: true,
      hint: "Date when the FIR was registered"
    },
    {
      id: "policeStation",
      label: "Police Station",
      type: "select",
      required: true,
      options: [
        { value: "cyber-cell-001", label: "Cyber Cell - Central District" },
        { value: "cyber-cell-002", label: "Cyber Cell - North District" },
        { value: "cyber-cell-003", label: "Cyber Cell - South District" },
        { value: "cyber-cell-004", label: "Cyber Cell - East District" },
        { value: "cyber-cell-005", label: "Cyber Cell - West District" }
      ],
      hint: "Select the police station where the FIR was registered"
    },
    {
      id: "complainantName",
      label: "Complainant Full Name",
      type: "text",
      required: true,
      placeholder: "Enter complainant's full name",
      hint: "Name as per official ID documents"
    },
    {
      id: "complainantPhone",
      label: "Complainant Phone Number",
      type: "text",
      required: true,
      placeholder: "Enter 10-digit mobile number",
      hint: "Primary contact number for the complainant"
    },
    {
      id: "complainantEmail",
      label: "Complainant Email",
      type: "text",
      required: false,
      placeholder: "Enter email address",
      hint: "Email address if available"
    },
    {
      id: "incidentDate",
      label: "Date of Incident",
      type: "date",
      required: true,
      hint: "Date when the cybercrime occurred"
    },
    {
      id: "crimeType",
      label: "Type of Cybercrime",
      type: "select",
      required: true,
      options: [
        { value: "financial-fraud", label: "Financial Fraud" },
        { value: "identity-theft", label: "Identity Theft" },
        { value: "phishing", label: "Phishing" },
        { value: "online-cheating", label: "Online Cheating" },
        { value: "upi-fraud", label: "UPI/Digital Payment Fraud" },
        { value: "investment-fraud", label: "Investment Fraud" },
        { value: "other", label: "Other" }
      ],
      hint: "Select the primary category of cybercrime"
    },
    {
      id: "financialLoss",
      label: "Financial Loss Amount (₹)",
      type: "text",
      required: true,
      placeholder: "Enter amount in rupees",
      hint: "Total financial loss reported by the victim"
    },
    {
      id: "itActSections",
      label: "IT Act Sections",
      type: "select",
      required: true,
      options: [
        { value: "66", label: "Section 66 - Computer Related Offences" },
        { value: "66c", label: "Section 66C - Identity Theft" },
        { value: "66d", label: "Section 66D - Cheating by Personation" },
        { value: "43", label: "Section 43 - Penalty for Damage to Computer System" }
      ],
      hint: "Select the most applicable IT Act section"
    },
    {
      id: "ipcSections",
      label: "IPC Sections",
      type: "select",
      required: true,
      options: [
        { value: "420", label: "Section 420 - Cheating and Dishonestly Inducing Delivery of Property" },
        { value: "468", label: "Section 468 - Forgery for Purpose of Cheating" },
        { value: "471", label: "Section 471 - Using as Genuine a Forged Document" },
        { value: "406", label: "Section 406 - Criminal Breach of Trust" }
      ],
      hint: "Select the most applicable IPC section"
    },
    {
      id: "suspectPhone",
      label: "Suspect Phone Number",
      type: "text",
      required: false,
      placeholder: "Enter suspect's phone number if known",
      hint: "Phone number used by the suspect (if available)"
    },
    {
      id: "suspectEmail",
      label: "Suspect Email",
      type: "text",
      required: false,
      placeholder: "Enter suspect's email if known",
      hint: "Email address used by the suspect (if available)"
    },
    {
      id: "digitalEvidence",
      label: "Digital Evidence Summary",
      type: "textarea",
      required: true,
      placeholder: "Describe the digital evidence collected...",
      hint: "Brief summary of screenshots, documents, and other digital evidence"
    },
    {
      id: "investigatingOfficer",
      label: "Investigating Officer",
      type: "text",
      required: true,
      placeholder: "Enter investigating officer's name",
      hint: "Name of the officer assigned to investigate this case"
    }
  ],
  sampleData: {
    firNumber: "456/2024",
    firDate: "2024-01-15",
    policeStation: "cyber-cell-001",
    complainantName: "Rajesh Kumar",
    complainantPhone: "9876543210",
    complainantEmail: "rajesh.kumar@email.com",
    incidentDate: "2024-01-10",
    crimeType: "upi-fraud",
    financialLoss: "25000",
    itActSections: "66d",
    ipcSections: "420",
    suspectPhone: "8765432109",
    suspectEmail: "",
    digitalEvidence: "Screenshots of fraudulent UPI transactions, bank statements showing unauthorized debits, WhatsApp conversation screenshots with the suspect",
    investigatingOfficer: "Inspector Priya Sharma"
  },
  validationRules: {
    firNumber: {
      required: true,
      pattern: "^\\d+/\\d{4}$",
      message: "FIR number must be in format: number/year (e.g., 123/2024)"
    },
    firDate: {
      required: true
    },
    policeStation: {
      required: true
    },
    complainantName: {
      required: true,
      minLength: 2,
      message: "Complainant name must be at least 2 characters"
    },
    complainantPhone: {
      required: true,
      pattern: "^[6-9]\\d{9}$",
      message: "Phone number must be a valid 10-digit Indian mobile number"
    },
    complainantEmail: {
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      message: "Please enter a valid email address"
    },
    incidentDate: {
      required: true
    },
    crimeType: {
      required: true
    },
    financialLoss: {
      required: true,
      pattern: "^\\d+$",
      message: "Financial loss must be a valid number"
    },
    itActSections: {
      required: true
    },
    ipcSections: {
      required: true
    },
    suspectPhone: {
      pattern: "^[6-9]\\d{9}$",
      message: "Phone number must be a valid 10-digit Indian mobile number"
    },
    suspectEmail: {
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      message: "Please enter a valid email address"
    },
    digitalEvidence: {
      required: true,
      minLength: 20,
      message: "Please provide a detailed summary of digital evidence (at least 20 characters)"
    },
    investigatingOfficer: {
      required: true,
      minLength: 2,
      message: "Investigating officer name must be at least 2 characters"
    }
  }
};

export default cctnsFilingContent;
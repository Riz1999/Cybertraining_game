/**
 * NCRP Form Data and Scenarios
 * Contains form templates and drag-and-drop scenarios for NCRP form training
 */

// NCRP Form Scenarios
export const ncrpFormScenarios = {
  // Banking Fraud Scenario
  bankingFraudForm: {
    id: 'banking-fraud-form',
    title: 'NCRP Form - Banking Fraud Case',
    description: 'Complete the NCRP form for Mrs. Sharma\'s banking fraud case',
    scenario: {
      title: 'Banking Fraud Case',
      description: 'Mrs. Sunita Sharma (68) lost ₹50,000 through a phishing SMS that appeared to be from her bank. She clicked a link and entered her banking credentials on a fake website.',
      victimDetails: {
        name: 'Mrs. Sunita Sharma',
        age: 68,
        phone: '9876543210',
        email: 'sunita.sharma@email.com',
        address: 'B-123, Sector 15, Noida, UP - 201301',
        occupation: 'Retired Teacher'
      },
      incidentDetails: {
        dateTime: '2024-01-15 14:30',
        location: 'Noida, Uttar Pradesh',
        crimeType: 'Financial Fraud - Phishing',
        amountLost: '50000',
        bankName: 'State Bank of India',
        accountNumber: 'XXXX-XXXX-1234',
        transactionId: 'TXN123456789',
        suspiciousNumber: '+91-9999888777'
      }
    },
    formTemplate: {
      title: 'NCRP Complaint Registration Form',
      sections: [
        {
          id: 'complainant-details',
          title: 'Complainant Details',
          fields: [
            {
              id: 'complainant-name',
              label: 'Full Name',
              type: 'text',
              isRequired: true,
              correctValue: 'Mrs. Sunita Sharma',
              hint: 'Enter the full name of the person filing the complaint'
            },
            {
              id: 'complainant-age',
              label: 'Age',
              type: 'number',
              isRequired: true,
              correctValue: '68',
              hint: 'Age of the complainant'
            },
            {
              id: 'complainant-phone',
              label: 'Mobile Number',
              type: 'phone',
              isRequired: true,
              correctValue: '9876543210',
              hint: 'Primary contact number'
            },
            {
              id: 'complainant-email',
              label: 'Email Address',
              type: 'email',
              isRequired: false,
              correctValue: 'sunita.sharma@email.com',
              hint: 'Email address for communication'
            }
          ]
        },
        {
          id: 'incident-details',
    
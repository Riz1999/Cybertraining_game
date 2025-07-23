/**
 * BankLookupService
 * 
 * Service for handling bank information and UTR lookup functionality
 * for the transaction freeze simulation.
 */

// Mock database of banks and their APIs
const bankDatabase = [
  { 
    id: 'sbi', 
    name: 'State Bank of India', 
    apiEndpoint: 'api.sbi.co.in/freeze', 
    icon: '🏦',
    accountFormats: ['SBIN0000XXXX', '11-digit number']
  },
  { 
    id: 'hdfc', 
    name: 'HDFC Bank', 
    apiEndpoint: 'api.hdfcbank.com/transaction/hold', 
    icon: '🏦',
    accountFormats: ['HDFC0000XXXX', '14-digit number']
  },
  { 
    id: 'icici', 
    name: 'ICICI Bank', 
    apiEndpoint: 'api.icicibank.com/freeze-transaction', 
    icon: '🏦',
    accountFormats: ['ICIC0000XXXX', '12-digit number']
  },
  { 
    id: 'axis', 
    name: 'Axis Bank', 
    apiEndpoint: 'api.axisbank.com/freeze', 
    icon: '🏦',
    accountFormats: ['UTIB0000XXXX', '13-digit number']
  },
  { 
    id: 'pnb', 
    name: 'Punjab National Bank', 
    apiEndpoint: 'api.pnb.co.in/transaction/freeze', 
    icon: '🏦',
    accountFormats: ['PUNB0000XXXX', '11-digit number']
  },
  { 
    id: 'bob', 
    name: 'Bank of Baroda', 
    apiEndpoint: 'api.bankofbaroda.co.in/freeze-request', 
    icon: '🏦',
    accountFormats: ['BARB0000XXX', '14-digit number']
  },
  { 
    id: 'canara', 
    name: 'Canara Bank', 
    apiEndpoint: 'api.canarabank.in/transaction/hold', 
    icon: '🏦',
    accountFormats: ['CNRB0000XXX', '12-digit number']
  },
  { 
    id: 'union', 
    name: 'Union Bank of India', 
    apiEndpoint: 'api.unionbankofindia.co.in/freeze', 
    icon: '🏦',
    accountFormats: ['UBIN0000XXX', '15-digit number']
  },
  { 
    id: 'kotak', 
    name: 'Kotak Mahindra Bank', 
    apiEndpoint: 'api.kotak.com/freeze-transaction', 
    icon: '🏦',
    accountFormats: ['KKBK0000XXX', '16-digit number']
  },
  { 
    id: 'idbi', 
    name: 'IDBI Bank', 
    apiEndpoint: 'api.idbibank.in/transaction/freeze', 
    icon: '🏦',
    accountFormats: ['IBKL0000XXX', '14-digit number']
  }
];

/**
 * Search for banks based on a search term
 * 
 * @param {string} searchTerm - The search term to look for
 * @returns {Promise<Array>} - Promise resolving to an array of matching banks
 */
const searchBanks = (searchTerm) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const results = bankDatabase.filter(bank => 
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      resolve(results);
    }, 800);
  });
};

/**
 * Search for transactions/UTRs based on a search term
 * 
 * @param {Array} transactions - Array of transactions to search through
 * @param {string} searchTerm - The search term to look for
 * @returns {Promise<Array>} - Promise resolving to an array of matching transactions
 */
const searchTransactions = (transactions, searchTerm) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const results = transactions.filter(transaction => 
        (transaction.utr && transaction.utr.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.id && transaction.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.sender && transaction.sender.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.recipient && transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      resolve(results);
    }, 800);
  });
};

/**
 * Get bank information by ID
 * 
 * @param {string} bankId - The bank ID to look up
 * @returns {Object|null} - The bank information or null if not found
 */
const getBankById = (bankId) => {
  return bankDatabase.find(bank => bank.id === bankId) || null;
};

/**
 * Submit a transaction freeze request
 * 
 * @param {Object} params - Parameters for the freeze request
 * @param {Object} params.bank - The bank information
 * @param {Object} params.transaction - The transaction information
 * @param {number} params.timeRemaining - Time remaining in seconds
 * @returns {Promise<Object>} - Promise resolving to the result of the freeze request
 */
const submitFreezeRequest = ({ bank, transaction, timeRemaining }) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Check if correct bank was selected
      const isCorrectBank = bank.id === transaction.bank;
      
      // Calculate success probability based on time remaining and correctness
      const timeFactor = Math.min(1, timeRemaining / 60); // Higher time remaining = higher chance
      const successProbability = isCorrectBank ? (0.7 + (timeFactor * 0.3)) : 0.2;
      
      // Determine if the freeze was successful
      const isSuccessful = Math.random() < successProbability;
      
      resolve({
        success: isSuccessful,
        bankCorrect: isCorrectBank,
        timeRemaining,
        message: isSuccessful 
          ? 'Transaction freeze successful. Funds have been secured.'
          : 'Transaction freeze failed. Please check the bank and transaction details.'
      });
    }, 1500);
  });
};

/**
 * Generate a mock complaint with transaction details
 * 
 * @returns {Object} - A mock complaint with transaction details
 */
const generateMockComplaint = () => {
  const banks = bankDatabase.map(bank => bank.id);
  const randomBank = banks[Math.floor(Math.random() * banks.length)];
  
  const victimNames = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Verma', 'Vikram Singh'];
  const victimName = victimNames[Math.floor(Math.random() * victimNames.length)];
  
  const fraudsterNames = ['John Smith', 'Alex Wilson', 'Michael Brown', 'David Jones', 'Robert Taylor'];
  const fraudsterName = fraudsterNames[Math.floor(Math.random() * fraudsterNames.length)];
  
  const amount = Math.floor(10000 + Math.random() * 90000);
  const utrNumber = `UTR${Math.floor(Math.random() * 1000000000)}`;
  const currentDate = new Date();
  const transactionDate = currentDate.toISOString().split('T')[0];
  
  return {
    id: `COMP${Math.floor(Math.random() * 10000)}`,
    title: 'Online Banking Fraud Report',
    description: `I, ${victimName}, would like to report a fraudulent transaction from my bank account. I received a call from someone claiming to be from my bank's security team. They convinced me to share my OTP for "verification purposes". Shortly after, I noticed a transaction of ₹${amount.toLocaleString('en-IN')} was made from my account without my authorization.`,
    victim: {
      name: victimName,
      phone: `+91 ${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
      email: `${victimName.toLowerCase().replace(' ', '.')}@email.com`,
      emotionalState: 'distressed'
    },
    transactions: [
      {
        id: `TXN${Math.floor(Math.random() * 10000)}`,
        utr: utrNumber,
        amount: amount,
        date: transactionDate,
        sender: victimName,
        recipient: fraudsterName,
        bank: randomBank
      }
    ]
  };
};

export default {
  searchBanks,
  searchTransactions,
  getBankById,
  submitFreezeRequest,
  generateMockComplaint,
  bankDatabase
};
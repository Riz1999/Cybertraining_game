import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Spinner from '../../ui/Spinner';

/**
 * BankInfoLookup component
 * 
 * This component provides an interface for looking up bank information and UTR numbers
 * as part of the transaction freeze simulation.
 */
const BankInfoLookup = ({ 
  complaintData, 
  onInfoFound, 
  timeRemaining,
  isActive = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('bank'); // 'bank' or 'utr'
  const [searchResults, setSearchResults] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  
  // Reset state when complaint data changes
  useEffect(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedInfo(null);
    setError(null);
  }, [complaintData]);

  // Mock database of banks and their APIs
  const bankDatabase = [
    { 
      id: 'sbi', 
      name: 'State Bank of India', 
      apiEndpoint: 'api.sbi.co.in/freeze', 
      icon: '🏦',
      accountFormats: ['SBIN0000XXXX', '11-digit number'],
      contactInfo: 'Toll-free: 1800 1234',
      freezeWindow: '48 hours',
      requiredInfo: ['UTR Number', 'Account Number', 'Transaction Date']
    },
    { 
      id: 'hdfc', 
      name: 'HDFC Bank', 
      apiEndpoint: 'api.hdfcbank.com/transaction/hold', 
      icon: '🏦',
      accountFormats: ['HDFC0000XXXX', '14-digit number'],
      contactInfo: 'Toll-free: 1800 2020',
      freezeWindow: '24 hours',
      requiredInfo: ['UTR Number', 'Transaction ID', 'Account Number']
    },
    { 
      id: 'icici', 
      name: 'ICICI Bank', 
      apiEndpoint: 'api.icicibank.com/freeze-transaction', 
      icon: '🏦',
      accountFormats: ['ICIC0000XXXX', '12-digit number'],
      contactInfo: 'Toll-free: 1800 3030',
      freezeWindow: '36 hours',
      requiredInfo: ['UTR Number', 'Transaction Date', 'Amount']
    },
    { 
      id: 'axis', 
      name: 'Axis Bank', 
      apiEndpoint: 'api.axisbank.com/freeze', 
      icon: '🏦',
      accountFormats: ['UTIB0000XXXX', '13-digit number'],
      contactInfo: 'Toll-free: 1800 4040',
      freezeWindow: '24 hours',
      requiredInfo: ['UTR Number', 'Account Number', 'Beneficiary Details']
    },
    { 
      id: 'pnb', 
      name: 'Punjab National Bank', 
      apiEndpoint: 'api.pnb.co.in/transaction/freeze', 
      icon: '🏦',
      accountFormats: ['PUNB0000XXXX', '11-digit number'],
      contactInfo: 'Toll-free: 1800 5050',
      freezeWindow: '48 hours',
      requiredInfo: ['UTR Number', 'Transaction Date', 'Amount']
    },
    {
      id: 'bob',
      name: 'Bank of Baroda',
      apiEndpoint: 'api.bankofbaroda.co.in/transaction/freeze',
      icon: '🏦',
      accountFormats: ['BARB0000XXXX', '12-digit number'],
      contactInfo: 'Toll-free: 1800 6060',
      freezeWindow: '36 hours',
      requiredInfo: ['UTR Number', 'Account Number', 'Transaction Date']
    },
    {
      id: 'canara',
      name: 'Canara Bank',
      apiEndpoint: 'api.canarabank.in/freeze-request',
      icon: '🏦',
      accountFormats: ['CNRB0000XXXX', '11-digit number'],
      contactInfo: 'Toll-free: 1800 7070',
      freezeWindow: '48 hours',
      requiredInfo: ['UTR Number', 'Transaction ID', 'Amount']
    }
  ];

  // Mock UTR database
  const utrDatabase = complaintData?.transactions?.map(transaction => ({
    id: transaction.utr || `UTR${Math.floor(Math.random() * 1000000000)}`,
    amount: transaction.amount,
    date: transaction.date,
    sender: transaction.sender,
    recipient: transaction.recipient,
    bank: transaction.bank
  })) || [];

  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setError(null);
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        if (searchType === 'bank') {
          // Enhanced search to include bank ID and other fields
          const results = bankDatabase.filter(bank => 
            bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bank.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bank.apiEndpoint.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(results);
          if (results.length === 0) {
            setError('No banks found matching your search');
          }
        } else {
          // Enhanced search for UTR/transactions
          const results = utrDatabase.filter(utr => 
            utr.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (utr.sender && utr.sender.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (utr.recipient && utr.recipient.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (utr.date && utr.date.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (utr.amount && utr.amount.toString().includes(searchTerm))
          );
          setSearchResults(results);
          if (results.length === 0) {
            setError('No transactions found matching your search');
          }
        }
      } catch (err) {
        setError('An error occurred during search');
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 800); // Simulate network delay
  };

  // Handle selection of a bank or UTR
  const handleSelect = (item) => {
    setSelectedInfo(item);
    
    // If we have both bank and UTR info, notify parent component
    if (searchType === 'bank' && complaintData?.transactions?.length > 0) {
      onInfoFound({
        bank: item,
        transaction: complaintData.transactions[0]
      });
    } else if (searchType === 'utr' && item.bank) {
      const bankInfo = bankDatabase.find(bank => bank.id === item.bank);
      if (bankInfo) {
        onInfoFound({
          bank: bankInfo,
          transaction: item
        });
      }
    }
  };

  // Handle search type change
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedInfo(null);
    setError(null);
  };

  return (
    <div className="bank-info-lookup">
      <Card className="mb-4">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Information Lookup</h2>
          
          {/* Search type selector */}
          <div className="flex mb-4 space-x-2">
            <Button 
              variant={searchType === 'bank' ? 'primary' : 'outline'}
              onClick={() => handleSearchTypeChange('bank')}
              disabled={!isActive}
            >
              Bank Information
            </Button>
            <Button 
              variant={searchType === 'utr' ? 'primary' : 'outline'}
              onClick={() => handleSearchTypeChange('utr')}
              disabled={!isActive}
            >
              Transaction/UTR
            </Button>
          </div>
          
          {/* Search input */}
          <div className="flex mb-4">
            <input
              type="text"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={searchType === 'bank' ? "Search for bank name, code..." : "Search for UTR, sender, recipient..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={!isActive}
              autoFocus
            />
            <Button
              variant="primary"
              className="rounded-l-none"
              onClick={handleSearch}
              disabled={!isActive || isSearching}
            >
              {isSearching ? <Spinner size="sm" /> : 'Search'}
            </Button>
          </div>
          
          {/* Search tips */}
          <div className="text-xs text-gray-500 mb-4">
            <p>
              {searchType === 'bank' 
                ? 'Tip: Search by bank name, code, or API endpoint. Press Enter to search.' 
                : 'Tip: Search by UTR number, transaction date, sender or recipient name. Press Enter to search.'}
            </p>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          
          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Search Results: <span className="text-gray-500 text-sm">({searchResults.length} found)</span></h3>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      selectedInfo?.id === item.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    {searchType === 'bank' ? (
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <div className="flex-grow">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">API: {item.apiEndpoint}</div>
                          <div className="text-xs text-gray-500">Freeze Window: {item.freezeWindow}</div>
                        </div>
                        <div className="text-blue-500 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="flex-grow">
                          <div className="font-medium">{item.id}</div>
                          <div className="text-sm text-gray-500">
                            Amount: ₹{item.amount.toLocaleString('en-IN')} • Date: {item.date}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.sender} → {item.recipient}
                          </div>
                        </div>
                        <div className="text-blue-500 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Selected information */}
          {selectedInfo && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <h3 className="font-medium text-green-800 mb-2">Selected Information:</h3>
              {searchType === 'bank' ? (
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">{selectedInfo.icon}</span>
                    <span className="font-bold text-lg">{selectedInfo.name}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <p><strong>API Endpoint:</strong> {selectedInfo.apiEndpoint}</p>
                    <p><strong>Contact:</strong> {selectedInfo.contactInfo}</p>
                  </div>
                  <p><strong>Account Formats:</strong> {selectedInfo.accountFormats.join(', ')}</p>
                  <p><strong>Freeze Window:</strong> {selectedInfo.freezeWindow}</p>
                  <div className="mt-2">
                    <p className="font-medium">Required Information for Freeze Request:</p>
                    <ul className="list-disc list-inside pl-2">
                      {selectedInfo.requiredInfo.map((info, index) => (
                        <li key={index} className="text-sm">{info}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-lg mb-2">{selectedInfo.id}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p><strong>Amount:</strong> ₹{selectedInfo.amount.toLocaleString('en-IN')}</p>
                    <p><strong>Date:</strong> {selectedInfo.date}</p>
                    <p><strong>Sender:</strong> {selectedInfo.sender}</p>
                    <p><strong>Recipient:</strong> {selectedInfo.recipient}</p>
                  </div>
                  <div className="mt-3 bg-blue-50 p-2 rounded border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> This transaction was reported within the last 24 hours and may still be recoverable.
                      Quick action is required to freeze the funds.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Time remaining indicator */}
          {timeRemaining !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Time Remaining:</span>
                <span className={`font-bold ${timeRemaining < 30 ? 'text-red-500' : 'text-gray-700'}`}>
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className={`h-2.5 rounded-full ${timeRemaining < 30 ? 'bg-red-500' : 'bg-blue-500'}`} 
                  style={{ width: `${(timeRemaining / 180) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

BankInfoLookup.propTypes = {
  complaintData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        utr: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        date: PropTypes.string,
        sender: PropTypes.string,
        recipient: PropTypes.string,
        bank: PropTypes.string
      })
    )
  }),
  onInfoFound: PropTypes.func.isRequired,
  timeRemaining: PropTypes.number,
  isActive: PropTypes.bool
};

export default BankInfoLookup;
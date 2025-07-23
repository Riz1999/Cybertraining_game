import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import Card from '../ui/Card';

const WhoisIPTracingSimulation = ({ domainData, ipData, instructions, onComplete, disabled = false }) => {
  const [activeTab, setActiveTab] = useState('domain');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [foundEntities, setFoundEntities] = useState([]);

  // Reset state when new data is loaded
  useEffect(() => {
    if (disabled) return;
    
    setActiveTab('domain');
    setSearchQuery('');
    setSearchResults(null);
    setSearchHistory([]);
    setLoading(false);
    setCompleted(false);
    setScore(0);
    setFeedback('');
    setFoundEntities([]);
  }, [domainData, ipData, disabled]);

  // Handle search submission
  const handleSearch = () => {
    if (!searchQuery.trim() || loading) return;
    
    setLoading(true);
    setFeedback('');
    
    // Simulate API delay
    setTimeout(() => {
      let result = null;
      
      if (activeTab === 'domain') {
        // Search in domain data
        result = domainData.find(domain => 
          domain.name.toLowerCase() === searchQuery.toLowerCase() ||
          domain.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        // Search in IP data
        result = ipData.find(ip => 
          ip.address === searchQuery ||
          ip.address.includes(searchQuery)
        );
      }
      
      setSearchResults(result);
      
      if (result) {
        // Add to search history if not already there
        if (!searchHistory.some(item => 
          item.query === searchQuery && item.type === activeTab
        )) {
          setSearchHistory([
            ...searchHistory, 
            { 
              query: searchQuery, 
              type: activeTab, 
              result: result.name || result.address,
              timestamp: new Date().toLocaleTimeString()
            }
          ]);
        }
        
        // Check if this is a key entity to find
        const isKeyEntity = activeTab === 'domain' 
          ? domainData.some(d => d.name === result.name && d.isKeyEntity)
          : ipData.some(ip => ip.address === result.address && ip.isKeyEntity);
        
        if (isKeyEntity && !foundEntities.includes(result.id)) {
          setFoundEntities([...foundEntities, result.id]);
          setFeedback(`Important information found! This ${activeTab} is linked to the fraud case.`);
        }
      } else {
        setFeedback(`No results found for "${searchQuery}"`);
      }
      
      setLoading(false);
    }, 800);
  };

  // Check if all key entities are found
  useEffect(() => {
    if (disabled || completed) return;
    
    const totalKeyEntities = [
      ...domainData.filter(d => d.isKeyEntity),
      ...ipData.filter(ip => ip.isKeyEntity)
    ].length;
    
    if (foundEntities.length === totalKeyEntities && totalKeyEntities > 0) {
      // Calculate score
      const maxScore = 25; // Maximum score for this activity
      setScore(maxScore);
      setCompleted(true);
      setFeedback('Great job! You have identified all key entities related to the fraud case.');
      
      // Notify parent component
      if (onComplete) {
        onComplete(maxScore);
      }
    }
  }, [foundEntities, domainData, ipData, disabled, completed, onComplete]);

  // Handle key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search results
  const handleClear = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  // Render WHOIS result details
  const renderWhoisDetails = (data) => {
    if (!data) return null;
    
    if (activeTab === 'domain') {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium mb-2">{data.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Registrar</p>
                <p className="font-medium">{data.registrar}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Creation Date</p>
                <p className="font-medium">{data.creationDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiration Date</p>
                <p className="font-medium">{data.expirationDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{data.status}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium mb-2">Registrant Information</h5>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p>{data.registrant.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organization</p>
                  <p>{data.registrant.organization || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{data.registrant.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{data.registrant.phone || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{data.registrant.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium mb-2">Name Servers</h5>
            <ul className="list-disc pl-5">
              {data.nameServers.map((ns, index) => (
                <li key={index}>{ns}</li>
              ))}
            </ul>
          </div>
          
          {data.ipAddresses && data.ipAddresses.length > 0 && (
            <div>
              <h5 className="font-medium mb-2">Associated IP Addresses</h5>
              <ul className="list-disc pl-5">
                {data.ipAddresses.map((ip, index) => (
                  <li key={index} className="cursor-pointer text-blue-600 hover:underline" 
                    onClick={() => {
                      setActiveTab('ip');
                      setSearchQuery(ip);
                      setSearchResults(null);
                    }}>
                    {ip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium mb-2">IP: {data.address}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{data.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ISP</p>
                <p className="font-medium">{data.isp}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium">{data.organization}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ASN</p>
                <p className="font-medium">{data.asn}</p>
              </div>
            </div>
          </div>
          
          {data.hostingProvider && (
            <div>
              <h5 className="font-medium mb-2">Hosting Information</h5>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Provider</p>
                    <p>{data.hostingProvider.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Abuse Contact</p>
                    <p>{data.hostingProvider.abuseContact}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{data.hostingProvider.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {data.domains && data.domains.length > 0 && (
            <div>
              <h5 className="font-medium mb-2">Associated Domains</h5>
              <ul className="list-disc pl-5">
                {data.domains.map((domain, index) => (
                  <li key={index} className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => {
                      setActiveTab('domain');
                      setSearchQuery(domain);
                      setSearchResults(null);
                    }}>
                    {domain}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-2">WHOIS & IP Tracing Simulation</h3>
        <p className="text-gray-600 mb-6">{instructions}</p>
        
        <div className="flex mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm rounded-l-md ${
              activeTab === 'domain'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('domain')}
            disabled={disabled || completed}
          >
            Domain Lookup
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm rounded-r-md ${
              activeTab === 'ip'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('ip')}
            disabled={disabled || completed}
          >
            IP Lookup
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex">
            <input
              type="text"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={activeTab === 'domain' ? "Enter domain name (e.g., example.com)" : "Enter IP address (e.g., 192.168.1.1)"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled || completed || loading}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={handleSearch}
              disabled={disabled || completed || loading || !searchQuery.trim()}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Search'
              )}
            </button>
          </div>
          
          {feedback && (
            <div className={`mt-2 p-2 text-sm rounded ${
              feedback.includes('Important') || feedback.includes('Great job')
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-700'
            }`}>
              {feedback}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Search Results</h4>
                  {searchResults && (
                    <Button
                      variant="text"
                      size="sm"
                      onClick={handleClear}
                      disabled={disabled || completed}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                
                {searchResults ? (
                  renderWhoisDetails(searchResults)
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p>Searching...</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <p>Enter a {activeTab === 'domain' ? 'domain name' : 'IP address'} to search</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <div className="p-4">
                <h4 className="font-medium mb-4">Search History</h4>
                
                {searchHistory.length > 0 ? (
                  <div className="space-y-3">
                    {searchHistory.map((item, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded-md text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{item.query}</span>
                          <span className="text-xs text-gray-500">{item.timestamp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{item.result}</span>
                          <span className={`text-xs ${
                            item.type === 'domain' ? 'text-blue-600' : 'text-green-600'
                          }`}>
                            {item.type === 'domain' ? 'Domain' : 'IP'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-sm">
                    <p>No search history yet</p>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-sm mb-2">Progress</h5>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Key entities found:</span>
                    <span className="font-medium">
                      {foundEntities.length} / {[
                        ...domainData.filter(d => d.isKeyEntity),
                        ...ipData.filter(ip => ip.isKeyEntity)
                      ].length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(foundEntities.length / [
                          ...domainData.filter(d => d.isKeyEntity),
                          ...ipData.filter(ip => ip.isKeyEntity)
                        ].length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {completed && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Activity Completed!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>You&apos;ve successfully identified all key entities related to the fraud case.</p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-green-800">Score:</span>
                    <span className="ml-2 text-sm text-green-800">{score}/25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

WhoisIPTracingSimulation.propTypes = {
  domainData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      registrar: PropTypes.string.isRequired,
      creationDate: PropTypes.string.isRequired,
      expirationDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      registrant: PropTypes.shape({
        name: PropTypes.string.isRequired,
        organization: PropTypes.string,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string,
        address: PropTypes.string
      }).isRequired,
      nameServers: PropTypes.arrayOf(PropTypes.string).isRequired,
      ipAddresses: PropTypes.arrayOf(PropTypes.string),
      isKeyEntity: PropTypes.bool
    })
  ).isRequired,
  ipData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      isp: PropTypes.string.isRequired,
      organization: PropTypes.string.isRequired,
      asn: PropTypes.string.isRequired,
      hostingProvider: PropTypes.shape({
        name: PropTypes.string.isRequired,
        abuseContact: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired
      }),
      domains: PropTypes.arrayOf(PropTypes.string),
      isKeyEntity: PropTypes.bool
    })
  ).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default WhoisIPTracingSimulation;
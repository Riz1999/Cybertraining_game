import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';

const TransactionMapComponent = ({ transactionData, instructions, onComplete, disabled = false }) => {
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const canvasRef = useRef(null);

  // Initialize the transaction map
  useEffect(() => {
    if (disabled || completed) return;
    
    // Reset state when new data is loaded
    setConnections([]);
    setSelectedNode(null);
    setCompleted(false);
    setScore(0);
    setFeedback('');
    setShowHint(false);
  }, [transactionData, disabled, completed]);

  // Draw the transaction map on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size with device pixel ratio for sharp rendering
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw nodes
    transactionData.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.type === 'source' ? 15 : 12, 0, Math.PI * 2);
      
      // Different colors for different node types
      if (node.type === 'source') {
        ctx.fillStyle = '#3B82F6'; // Blue for source
      } else if (node.type === 'mule') {
        ctx.fillStyle = '#EF4444'; // Red for mule accounts
      } else if (node.type === 'destination') {
        ctx.fillStyle = '#10B981'; // Green for final destination
      } else {
        ctx.fillStyle = '#6B7280'; // Gray for intermediate nodes
      }
      
      // Highlight selected node
      if (selectedNode && selectedNode.id === node.id) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FCD34D'; // Yellow highlight
        ctx.stroke();
      }
      
      ctx.fill();
      
      // Add node label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#1F2937';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 30);
    });
    
    // Draw connections
    connections.forEach(conn => {
      const fromNode = transactionData.nodes.find(n => n.id === conn.from);
      const toNode = transactionData.nodes.find(n => n.id === conn.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw arrow
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const arrowLength = 10;
        
        ctx.beginPath();
        ctx.moveTo(
          toNode.x - Math.cos(angle) * 15,
          toNode.y - Math.sin(angle) * 15
        );
        ctx.lineTo(
          toNode.x - Math.cos(angle) * 15 - Math.cos(angle - Math.PI / 6) * arrowLength,
          toNode.y - Math.sin(angle) * 15 - Math.sin(angle - Math.PI / 6) * arrowLength
        );
        ctx.lineTo(
          toNode.x - Math.cos(angle) * 15 - Math.cos(angle + Math.PI / 6) * arrowLength,
          toNode.y - Math.sin(angle) * 15 - Math.sin(angle + Math.PI / 6) * arrowLength
        );
        ctx.closePath();
        ctx.fillStyle = '#4B5563';
        ctx.fill();
        
        // Draw transaction amount
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        ctx.font = '11px Arial';
        ctx.fillStyle = '#1F2937';
        ctx.textAlign = 'center';
        ctx.fillText(`₹${conn.amount.toLocaleString()}`, midX, midY - 5);
        ctx.fillText(conn.date, midX, midY + 10);
      }
    });
  }, [transactionData, connections, selectedNode]);

  // Handle canvas click to select nodes
  const handleCanvasClick = (e) => {
    if (disabled || completed) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if a node was clicked
    const clickedNode = transactionData.nodes.find(node => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      return distance <= (node.type === 'source' ? 15 : 12);
    });
    
    if (clickedNode) {
      // If no node is selected, select this one
      if (!selectedNode) {
        setSelectedNode(clickedNode);
      } 
      // If a node is already selected, create a connection
      else if (selectedNode.id !== clickedNode.id) {
        // Check if connection already exists
        const connectionExists = connections.some(
          conn => conn.from === selectedNode.id && conn.to === clickedNode.id
        );
        
        if (!connectionExists) {
          // Find the correct connection from the expected connections
          const expectedConnection = transactionData.expectedConnections.find(
            conn => conn.from === selectedNode.id && conn.to === clickedNode.id
          );
          
          if (expectedConnection) {
            // Add the connection with the expected data
            setConnections([...connections, {
              from: selectedNode.id,
              to: clickedNode.id,
              amount: expectedConnection.amount,
              date: expectedConnection.date
            }]);
            
            setFeedback('Connection added correctly!');
            setTimeout(() => setFeedback(''), 2000);
          } else {
            setFeedback('This connection is not valid. Try another one.');
            setTimeout(() => setFeedback(''), 2000);
          }
        } else {
          setFeedback('This connection already exists.');
          setTimeout(() => setFeedback(''), 2000);
        }
        
        // Reset selection
        setSelectedNode(null);
      } else {
        // Clicking the same node deselects it
        setSelectedNode(null);
      }
    }
  };

  // Check if all expected connections are made
  useEffect(() => {
    if (disabled || completed) return;
    
    const allConnectionsMade = transactionData.expectedConnections.every(expected => 
      connections.some(conn => 
        conn.from === expected.from && 
        conn.to === expected.to
      )
    );
    
    if (allConnectionsMade && connections.length === transactionData.expectedConnections.length) {
      // Calculate score based on correct connections
      const maxScore = 25; // Maximum score for this activity
      setScore(maxScore);
      setCompleted(true);
      setFeedback('Great job! You have successfully mapped all transactions.');
      
      // Notify parent component
      if (onComplete) {
        onComplete(maxScore);
      }
    }
  }, [connections, transactionData.expectedConnections, disabled, completed, onComplete]);

  // Reset the transaction map
  const handleReset = () => {
    setConnections([]);
    setSelectedNode(null);
    setFeedback('Transaction map has been reset.');
    setTimeout(() => setFeedback(''), 2000);
  };

  // Toggle hint visibility
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-medium mb-2">Transaction Map Activity</h3>
      <p className="text-gray-600 mb-6">{instructions}</p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleReset}
              disabled={disabled || completed || connections.length === 0}
            >
              Reset Map
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={toggleHint}
              disabled={disabled || completed}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            {connections.length} of {transactionData.expectedConnections.length} connections mapped
          </div>
        </div>
        
        {feedback && (
          <div className={`p-2 mb-4 text-sm rounded ${
            feedback.includes('correctly') || feedback.includes('Great job') 
              ? 'bg-green-50 text-green-700' 
              : 'bg-yellow-50 text-yellow-700'
          }`}>
            {feedback}
          </div>
        )}
        
        {showHint && (
          <div className="p-3 mb-4 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="font-medium text-blue-800 mb-1">Hint</h4>
            <p className="text-blue-700 text-sm">{transactionData.hint}</p>
          </div>
        )}
      </div>
      
      <div className="relative border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <canvas 
          ref={canvasRef}
          id="transaction-map-canvas" 
          className="absolute top-0 left-0 w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
          style={{ pointerEvents: disabled || completed ? 'none' : 'auto' }}
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-md shadow-md border border-gray-200">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs">Source Account</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
              <span className="text-xs">Intermediate Account</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-xs">Mule Account</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs">Final Destination</span>
            </div>
          </div>
        </div>
        
        {/* Instructions overlay */}
        {!disabled && !completed && connections.length === 0 && showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-8 text-center">
            <div>
              <h3 className="text-xl font-bold mb-2">How to Map Transactions</h3>
              <p className="mb-4">Click on a source account, then click on the destination account to create a connection.</p>
              <Button variant="primary" onClick={() => setShowOverlay(false)}>
                Start Mapping
              </Button>
            </div>
          </div>
        )}
        
        {/* Completion overlay */}
        {completed && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-900 bg-opacity-70 text-white p-8 text-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Transaction Map Complete!</h3>
              <p className="mb-4">You&apos;ve successfully mapped all the transaction flows.</p>
              <p className="text-xl font-semibold">Score: {score}/25</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Node details panel */}
      {selectedNode && (
        <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Selected: {selectedNode.label}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Account Type</p>
              <p className="font-medium">{selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Number</p>
              <p className="font-medium">{selectedNode.accountNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bank</p>
              <p className="font-medium">{selectedNode.bank || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium">{selectedNode.location || 'N/A'}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-blue-700">Click another node to create a connection, or click this node again to deselect.</p>
        </div>
      )}
    </div>
  );
};

TransactionMapComponent.propTypes = {
  transactionData: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        accountNumber: PropTypes.string,
        bank: PropTypes.string,
        location: PropTypes.string
      })
    ).isRequired,
    expectedConnections: PropTypes.arrayOf(
      PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired
      })
    ).isRequired,
    hint: PropTypes.string
  }).isRequired,
  instructions: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default TransactionMapComponent;
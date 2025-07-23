import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const HotspotActivity = ({ instructions, image, hotspots, onComplete, disabled = false }) => {
  const [foundHotspots, setFoundHotspots] = useState([]);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);

  // Initialize the component
  useEffect(() => {
    // Set default dimensions and mark as loaded
    setImageDimensions({ width: 800, height: 384 });
    setImageLoaded(true);
  }, []);

  // Check if all hotspots are found
  useEffect(() => {
    if (foundHotspots.length === hotspots.length && !completed && foundHotspots.length > 0) {
      setCompleted(true);
      
      // Calculate score (10 points for finding all hotspots)
      const score = 10;
      
      // Notify parent component
      if (onComplete) {
        onComplete(score);
      }
    }
  }, [foundHotspots, hotspots, completed, onComplete]);

  // Handle click on image
  const handleImageClick = (e) => {
    if (disabled || completed) return;
    
    // Get click coordinates relative to image
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Check if click is within any hotspot
    hotspots.forEach(hotspot => {
      if (
        !foundHotspots.includes(hotspot.id) &&
        x >= hotspot.x && 
        x <= hotspot.x + hotspot.width &&
        y >= hotspot.y && 
        y <= hotspot.y + hotspot.height
      ) {
        setFoundHotspots([...foundHotspots, hotspot.id]);
        setActiveHotspot(hotspot);
      }
    });
  };

  // Close active hotspot info
  const closeHotspotInfo = () => {
    setActiveHotspot(null);
  };

  // Get hotspot by ID
  const getHotspotById = (id) => {
    return hotspots.find(hotspot => hotspot.id === id);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-medium mb-2">Hotspot Activity</h3>
      <p className="text-gray-600 mb-6">{instructions}</p>
      
      {/* Image container */}
      <div className="relative mb-6 border border-gray-200 rounded-lg overflow-hidden">
        {/* Placeholder while image loads */}
        {!imageLoaded && (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Actual image or fallback */}
        <div
          ref={imageRef}
          className="w-full h-96 bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative"
          onClick={handleImageClick}
          style={{ cursor: disabled || completed ? 'default' : 'pointer' }}
        >
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Evidence Analysis</h3>
            <p className="text-gray-600 mb-4">Click on different areas to identify suspicious elements</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium">SMS Screenshot</div>
                <div>Fraudulent message</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium">Website Screenshot</div>
                <div>Fake login page</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium">Transaction Alert</div>
                <div>Bank notification</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium">Bank Statement</div>
                <div>Transaction details</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Render found hotspots */}
        {imageLoaded && foundHotspots.map(hotspotId => {
          const hotspot = getHotspotById(hotspotId);
          if (!hotspot) return null;
          
          return (
            <div
              key={hotspot.id}
              className="absolute border-2 border-green-500 bg-green-200 bg-opacity-30 rounded-md"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`
              }}
            ></div>
          );
        })}
      </div>
      
      {/* Hotspot info popup */}
      {activeHotspot && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-blue-800">{activeHotspot.label}</h4>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={closeHotspotInfo}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-blue-700">{activeHotspot.info}</p>
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">Progress</p>
          <p className="text-sm">{foundHotspots.length} of {hotspots.length} found</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(foundHotspots.length / hotspots.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Found hotspots list */}
      <div>
        <h4 className="font-medium mb-3">Found Elements</h4>
        {foundHotspots.length === 0 ? (
          <p className="text-gray-500">No suspicious elements found yet. Click on the image to identify them.</p>
        ) : (
          <div className="space-y-2">
            {foundHotspots.map(hotspotId => {
              const hotspot = getHotspotById(hotspotId);
              return (
                <div 
                  key={hotspot.id}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="font-medium text-green-800">{hotspot.label}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Completion message */}
      {completed && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">All suspicious elements found!</h4>
          <p className="text-green-700">
          Great job! You&#39;ve successfully identified all the suspicious elements in the evidence.
        </p>
        </div>
      )}
    </div>
  );
};

HotspotActivity.propTypes = {
  instructions: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  hotspots: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired
    })
  ).isRequired,
  onComplete: PropTypes.func,
  disabled: PropTypes.bool
};

export default HotspotActivity;
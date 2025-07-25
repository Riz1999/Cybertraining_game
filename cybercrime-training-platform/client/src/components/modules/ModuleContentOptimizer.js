import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { LazyImage } from '../ui';

/**
 * ModuleContentOptimizer component for optimizing module content based on network conditions
 * @param {Object} props - Component props
 * @param {Object} props.module - Module object
 * @param {React.ReactNode} props.children - Child components (original content)
 * @param {boolean} props.isActive - Whether the module is currently active
 * @returns {React.ReactElement} ModuleContentOptimizer component
 */
const ModuleContentOptimizer = ({ module, children, isActive = true }) => {
  const { isOnline, isLowBandwidth } = useNetworkStatus();
  const [optimizationLevel, setOptimizationLevel] = useState('none'); // none, low, medium, high
  const [showOptimizationBanner, setShowOptimizationBanner] = useState(false);

  // Determine optimization level based on network conditions
  useEffect(() => {
    if (!isOnline) {
      setOptimizationLevel('high');
      setShowOptimizationBanner(true);
    } else if (isLowBandwidth) {
      setOptimizationLevel('medium');
      setShowOptimizationBanner(true);
    } else {
      setOptimizationLevel('none');
      setShowOptimizationBanner(false);
    }
  }, [isOnline, isLowBandwidth]);

  // Hide optimization banner after 5 seconds
  useEffect(() => {
    if (showOptimizationBanner) {
      const timer = setTimeout(() => {
        setShowOptimizationBanner(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showOptimizationBanner]);

  // Function to optimize a single child element
  const optimizeChildElement = (child) => {
    // Skip null or primitive children
    if (!React.isValidElement(child)) {
      return child;
    }

    // Handle different element types
    if (child.type === 'img' || child.props.src) {
      // Replace regular images with LazyImage
      return (
        <LazyImage
          src={child.props.src}
          alt={child.props.alt || 'Module image'}
          className={child.props.className}
          width={child.props.width}
          height={child.props.height}
          quality={optimizationLevel === 'high' ? 30 : optimizationLevel === 'medium' ? 50 : 80}
          critical={isActive && child.props.critical}
        />
      );
    }

    // Handle video elements
    if (child.type === 'video') {
      // For high optimization, replace videos with a placeholder
      if (optimizationLevel === 'high') {
        return (
          <div className="relative bg-gray-100 rounded-md p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">Video content is available in normal bandwidth mode</p>
            <button
              className="mt-2 px-4 py-2 bg-police-blue text-white rounded-md hover:bg-blue-700"
              onClick={() => setOptimizationLevel('none')}
            >
              Load Video Anyway
            </button>
          </div>
        );
      }

      // For medium optimization, use lower quality video
      if (optimizationLevel === 'medium') {
        // Find a lower quality source if available
        const sources = React.Children.toArray(child.props.children)
          .filter(source => React.isValidElement(source) && source.type === 'source');

        // If there are multiple sources, try to find a lower quality one
        if (sources.length > 1) {
          // Sort sources by quality (assuming they have data-quality attribute)
          const sortedSources = [...sources].sort((a, b) => {
            const qualityA = a.props['data-quality'] || 720;
            const qualityB = b.props['data-quality'] || 720;
            return qualityA - qualityB;
          });

          // Use the lowest quality source
          const lowestQualitySource = sortedSources[0];

          // Clone the video element with only the lowest quality source
          return React.cloneElement(child, {
            ...child.props,
            children: lowestQualitySource,
            preload: 'metadata', // Only load metadata initially
            controls: true, // Ensure controls are visible
          });
        }
      }
    }

    // Handle iframes (embedded content)
    if (child.type === 'iframe') {
      // For high optimization, replace iframes with a placeholder
      if (optimizationLevel === 'high') {
        return (
          <div className="relative bg-gray-100 rounded-md p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600">External content is available in normal bandwidth mode</p>
            <button
              className="mt-2 px-4 py-2 bg-police-blue text-white rounded-md hover:bg-blue-700"
              onClick={() => setOptimizationLevel('none')}
            >
              Load Content Anyway
            </button>
          </div>
        );
      }
    }

    // Return unchanged element if no optimization needed
    return child;
  };

  // Function to optimize content based on optimization level
  const optimizeContent = () => {
    // If no optimization needed, return children as is
    if (optimizationLevel === 'none') {
      return children;
    }

    // Clone children to modify them
    return React.Children.map(children, child => optimizeChildElement(child));
  };

  return (
    <div className="relative">
      {/* Optimization banner */}
      {showOptimizationBanner && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {!isOnline ? (
                  'You are offline. Content has been optimized for offline use.'
                ) : isLowBandwidth ? (
                  'Low bandwidth detected. Content has been optimized for data saving.'
                ) : (
                  'Content optimization active.'
                )}
              </p>
              <div className="mt-2 flex space-x-4">
                <button
                  className="text-xs text-yellow-700 hover:text-yellow-600 font-medium underline"
                  onClick={() => setOptimizationLevel('none')}
                >
                  Disable Optimization
                </button>
                <button
                  className="text-xs text-yellow-700 hover:text-yellow-600 font-medium"
                  onClick={() => setShowOptimizationBanner(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimized content */}
      {optimizeContent()}
    </div>
  );
};

export default ModuleContentOptimizer;
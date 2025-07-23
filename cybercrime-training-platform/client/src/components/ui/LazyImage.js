import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';

/**
 * LazyImage component for lazy loading images with optimization
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.className - Additional CSS classes for the image
 * @param {string} props.placeholderClassName - Additional CSS classes for the placeholder
 * @param {string} props.width - Image width
 * @param {string} props.height - Image height
 * @param {number} props.quality - Image quality (1-100)
 * @param {boolean} props.critical - Whether this is a critical image that should be loaded with priority
 * @param {Object} props.style - Additional inline styles
 * @returns {React.ReactElement} LazyImage component
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  width,
  height,
  quality,
  critical = false,
  style = {},
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(critical); // Critical images are immediately visible
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  
  // Get network status from context
  const { isOnline, isLowBandwidth } = useNetworkStatus();

  // Optimize image URL based on network conditions
  const optimizedSrc = getOptimizedImageUrl(src, isLowBandwidth, {
    width: width ? parseInt(width, 10) : undefined,
    height: height ? parseInt(height, 10) : undefined,
    quality: quality || (isLowBandwidth ? 40 : 80),
  });

  // Set up Intersection Observer to detect when the image is about to enter the viewport
  useEffect(() => {
    // Skip for critical images or if already visible
    if (critical || isVisible) return;
    
    // Use Intersection Observer API if available
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observerRef.current.disconnect();
          }
        },
        { 
          threshold: 0.1, // Start loading when 10% of the image is visible
          rootMargin: '200px' // Start loading when image is 200px from viewport
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    } else {
      // Fallback for browsers that don't support Intersection Observer
      setIsVisible(true);
    }
  }, [critical, isVisible]);

  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error event
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Placeholder styles
  const placeholderStyle = {
    width: width || '100%',
    height: height || '100%',
    ...style,
  };

  // Use blur-up technique for low bandwidth
  const blurUpStyle = isLowBandwidth && !isLoaded ? {
    filter: 'blur(10px)',
    transform: 'scale(1.05)',
  } : {};

  return (
    <div
      ref={imgRef}
      className={`relative ${placeholderClassName}`}
      style={placeholderStyle}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Spinner size="md" color="primary" />
        </div>
      )}

      {isVisible && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          width={width}
          height={height}
          style={{
            ...style,
            ...blurUpStyle,
            display: isLoaded ? 'block' : 'none',
          }}
          loading={critical ? 'eager' : 'lazy'}
          fetchPriority={critical ? 'high' : 'auto'}
          {...rest}
        />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Failed to load image</span>
            {!isOnline && (
              <p className="text-sm mt-1">You are currently offline.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
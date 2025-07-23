/**
 * Image optimization utilities
 */

/**
 * Get optimized image URL based on network conditions
 * @param {string} imageUrl - Original image URL
 * @param {boolean} isLowBandwidth - Whether the user is on a low bandwidth connection
 * @param {Object} options - Options for image optimization
 * @param {number} options.width - Desired image width
 * @param {number} options.height - Desired image height
 * @param {number} options.quality - Image quality (1-100)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, isLowBandwidth, options = {}) => {
  // If the URL is already a data URL or SVG, return as is
  if (imageUrl.startsWith('data:') || imageUrl.endsWith('.svg')) {
    return imageUrl;
  }

  // If the URL is a relative path, make it absolute
  const absoluteUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;

  // If using Cloudinary, Imgix, or similar service, use their optimization parameters
  if (absoluteUrl.includes('cloudinary.com')) {
    const baseUrl = absoluteUrl.split('/upload/')[0];
    const imagePath = absoluteUrl.split('/upload/')[1];
    
    // Set quality based on bandwidth
    const quality = isLowBandwidth ? 'q_auto:low' : 'q_auto:good';
    
    // Set format based on browser support
    const format = supportsWebP() ? 'f_webp' : 'f_auto';
    
    // Set width if provided
    const width = options.width ? `w_${options.width}` : '';
    
    // Combine transformation parameters
    const transformations = [quality, format, width].filter(Boolean).join(',');
    
    return `${baseUrl}/upload/${transformations}/${imagePath}`;
  }

  // If using Imgix
  if (absoluteUrl.includes('imgix.net')) {
    const quality = isLowBandwidth ? 40 : 75;
    const format = supportsWebP() ? 'webp' : 'auto';
    const width = options.width || '';
    
    // Add query parameters
    const params = new URLSearchParams();
    params.append('q', quality);
    params.append('fm', format);
    if (width) params.append('w', width);
    
    return `${absoluteUrl}${absoluteUrl.includes('?') ? '&' : '?'}${params.toString()}`;
  }

  // For local images or other services, use a simple approach
  // This assumes you have a simple image optimization endpoint
  if (isLowBandwidth) {
    // For low bandwidth, use a lower quality version
    return `${absoluteUrl}${absoluteUrl.includes('?') ? '&' : '?'}quality=low`;
  }

  return absoluteUrl;
};

/**
 * Check if the browser supports WebP format
 * @returns {boolean} Whether WebP is supported
 */
export const supportsWebP = () => {
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    // Was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Preload critical images
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 */
export const preloadCriticalImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};
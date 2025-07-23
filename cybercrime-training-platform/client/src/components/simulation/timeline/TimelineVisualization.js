import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../../simulation/utils/helpers';

/**
 * TimelineVisualization Component
 * 
 * Displays a vertical timeline of events with icons, dates, and descriptions.
 * Used in the complaint delay scenario system.
 */
const TimelineVisualization = ({ events, activeEventId, onEventClick }) => {
  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  // Get icon component based on icon name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'file-text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'check-circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'search':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        );
      case 'building':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
        );
      case 'mail':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        );
      case 'alert-circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'alert-triangle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'help-circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
      case 'clock':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Get color class based on event type
  const getEventColorClass = (eventType) => {
    switch (eventType) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'decision':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'standard':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get icon color class based on event type
  const getIconColorClass = (eventType) => {
    switch (eventType) {
      case 'critical':
        return 'bg-red-500';
      case 'decision':
        return 'bg-yellow-500';
      case 'standard':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedEvents.map((event, eventIdx) => (
          <li key={event.id} className="relative pb-8">
            {eventIdx !== sortedEvents.length - 1 ? (
              <span
                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />
            ) : null}
            <div 
              className={`relative flex space-x-3 ${activeEventId === event.id ? 'opacity-100' : 'opacity-80'}`}
              onClick={() => onEventClick && onEventClick(event)}
            >
              <div>
                <span
                  className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getIconColorClass(event.type)}`}
                >
                  <span className="text-white">
                    {getIconComponent(event.icon)}
                  </span>
                </span>
              </div>
              <div className={`min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 ${activeEventId === event.id ? 'border-l-4 border-blue-500 pl-2' : ''}`}>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                  <time dateTime={event.timestamp}>
                    {formatDate(event.timestamp, { includeTime: false })}
                  </time>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

TimelineVisualization.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      type: PropTypes.string,
      icon: PropTypes.string
    })
  ).isRequired,
  activeEventId: PropTypes.string,
  onEventClick: PropTypes.func
};

export default TimelineVisualization;
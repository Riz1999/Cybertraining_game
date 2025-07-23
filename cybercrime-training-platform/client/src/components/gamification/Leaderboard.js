import React from 'react';
import { Card, Avatar } from '../ui';

/**
 * Leaderboard component for displaying top users
 * @param {Object} props - Component props
 * @param {Array} props.users - Array of user objects with rank, name, level, xp, and avatar
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.title - Leaderboard title
 * @param {number} props.currentUserId - ID of the current user
 * @returns {React.ReactElement} Leaderboard component
 */
const Leaderboard = ({ 
  users = [], 
  className = '',
  title = 'Leaderboard',
  currentUserId = null,
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="bg-police-blue text-white py-3 px-4">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <div 
            key={user.id} 
            className={`flex items-center py-3 px-4 ${user.id === currentUserId ? 'bg-blue-50' : ''}`}
          >
            <div className="w-8 text-center font-medium text-gray-700">
              {user.rank}
            </div>
            
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="sm"
              className="mx-3"
              initials={user.name.split(' ').map(n => n[0]).join('')}
            />
            
            <div className="flex-grow">
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">Level {user.level}</div>
            </div>
            
            <div className="text-right">
              <div className="font-medium text-gray-900">{user.xp} XP</div>
              {user.id === currentUserId && (
                <div className="text-xs text-blue-600">You</div>
              )}
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </Card>
  );
};

export default Leaderboard;
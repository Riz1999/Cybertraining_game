import React, { useState } from 'react';
import { Card, Badge, Button } from '../ui';
import BadgeService from '../../services/BadgeService';

/**
 * Badge Showcase Component
 * Displays user's earned badges and available badges to earn
 */
const BadgeShowcase = ({ userBadges = [], className = '' }) => {
  const [activeTab, setActiveTab] = useState('earned');
  const badgeService = new BadgeService();

  // Get all available badge definitions
  const getAllBadgeDefinitions = () => {
    return [
      badgeService.getCyberAwarenessStarterBadge(),
      badgeService.getFirstResponderBadge(),
      badgeService.getDigitalDefenderBadge()
    ];
  };

  // Get badges not yet earned
  const getAvailableBadges = () => {
    const allBadges = getAllBadgeDefinitions();
    const earnedBadgeIds = userBadges.map(badge => badge.id);
    return allBadges.filter(badge => !earnedBadgeIds.includes(badge.id));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get rarity color
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-green-600 bg-green-100';
      case 'uncommon': return 'text-blue-600 bg-blue-100';
      case 'rare': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const availableBadges = getAvailableBadges();

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Badge Collection</h3>
            <p className="text-gray-600">Track your achievements and progress</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="info">{userBadges.length} Earned</Badge>
            <Badge variant="outline">{availableBadges.length} Available</Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('earned')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'earned'
                ? 'bg-white text-police-blue shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Earned Badges ({userBadges.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'available'
                ? 'bg-white text-police-blue shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available ({availableBadges.length})
          </button>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === 'earned' ? (
            userBadges.length > 0 ? (
              userBadges.map(badge => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Badge Image */}
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">
                      <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className="w-12 h-12"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <svg
                        className="w-8 h-8 text-yellow-600 hidden"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>

                  {/* Badge Info */}
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                    
                    {/* Earned Date */}
                    <div className="text-xs text-gray-500">
                      Earned on {formatDate(badge.earnedAt)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Badges Yet</h4>
                <p className="text-gray-600">Complete modules to earn your first badge!</p>
              </div>
            )
          ) : (
            availableBadges.map(badge => (
              <div
                key={badge.id}
                className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow opacity-75"
              >
                {/* Badge Image (Grayed Out) */}
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>

                {/* Badge Info */}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-700 mb-1">{badge.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">{badge.description}</p>
                  
                  {/* Rarity and Points */}
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Badge variant="outline" className={`text-xs ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </Badge>
                    <span className="text-xs text-gray-500">{badge.points} XP</span>
                  </div>
                  
                  {/* Criteria */}
                  <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                    {badge.criteria}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-police-blue">{userBadges.length}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {userBadges.reduce((sum, badge) => {
                  const definition = getAllBadgeDefinitions().find(def => def.id === badge.id);
                  return sum + (definition?.points || 0);
                }, 0)}
              </div>
              <div className="text-sm text-gray-600">Badge Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round((userBadges.length / getAllBadgeDefinitions().length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Collection Complete</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BadgeShowcase;
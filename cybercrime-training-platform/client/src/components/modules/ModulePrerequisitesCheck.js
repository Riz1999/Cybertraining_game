import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ModulePrerequisites from './ModulePrerequisites';
import BadgeService from '../../services/BadgeService';

/**
 * Module Prerequisites Check Component
 * Checks if user meets prerequisites for a module and displays appropriate UI
 */
const ModulePrerequisitesCheck = ({ moduleId, children }) => {
  const [prerequisites, setPrerequisites] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);
  const { progress, statistics } = useSelector(state => state.progress);
  const badgeService = new BadgeService();

  useEffect(() => {
    // Check prerequisites when component mounts or dependencies change
    checkPrerequisites();
  }, [moduleId, user, progress]);

  const checkPrerequisites = () => {
    setLoading(true);
    
    // Default to meeting prerequisites
    let meetsPrerequisites = true;
    const missingPrerequisites = [];
    
    // Check module-specific prerequisites
    if (moduleId === 'module-2-complaint-categorization') {
      const module1Completed = progress?.modules?.some(m => 
        m.moduleId === 'module-1-intro-cybercrime' && m.status === 'completed'
      );
      
      if (!module1Completed) {
        meetsPrerequisites = false;
        
        // Add missing module prerequisite
        missingPrerequisites.push({
          type: 'module',
          moduleId: 'module-1-intro-cybercrime',
          moduleNumber: 1,
          title: 'Introduction to Cybercrime Investigation',
          description: 'Complete this module first'
        });
      }
    } else if (moduleId === 'module-3-time-critical-response') {
      const module2Completed = progress?.modules?.some(m => 
        m.moduleId === 'module-2-complaint-categorization' && m.status === 'completed'
      );
      
      if (!module2Completed) {
        meetsPrerequisites = false;
        
        // Add missing module prerequisite
        missingPrerequisites.push({
          type: 'module',
          moduleId: 'module-2-complaint-categorization',
          moduleNumber: 2,
          title: 'Complaint Categorization and Intake',
          description: 'Complete this module first'
        });
      }
    }
    
    // Set prerequisites state
    setPrerequisites({
      meetsPrerequisites,
      missingPrerequisites
    });
    
    setLoading(false);
  };

  // If loading, show nothing yet
  if (loading) {
    return null;
  }

  // If prerequisites are met or it's Module 1, render children
  if (!prerequisites || prerequisites.meetsPrerequisites || moduleId === 'module-1-intro-cybercrime') {
    return children;
  }

  // Otherwise, show prerequisites component
  return (
    <ModulePrerequisites 
      prerequisites={prerequisites}
      userXP={statistics?.totalXP || 0}
    />
  );
};

export default ModulePrerequisitesCheck;
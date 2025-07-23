import React, { useState, useRef } from 'react';
import { Card, Button, Badge } from '../ui';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Certificate Generator Component
 * Generates printable certificates based on user achievements
 */
const CertificateGenerator = ({ user, userBadges, progress, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef();

  // Calculate completion statistics
  const getCompletionStats = () => {
    if (!progress?.modules) return { completedModules: 0, averageScore: 0, totalTime: 0 };

    const completedModules = progress.modules.filter(m => m.status === 'completed');
    const totalScore = completedModules.reduce((sum, m) => sum + (m.currentScore || 0), 0);
    const averageScore = completedModules.length > 0 ? Math.round(totalScore / completedModules.length) : 0;
    const totalTime = progress.modules.reduce((sum, m) => sum + (m.timeSpent || 0), 0);

    return {
      completedModules: completedModules.length,
      averageScore,
      totalTime: Math.round(totalTime / 60) // Convert to minutes
    };
  };

  // Check if user is eligible for certification
  const isCertificationEligible = () => {
    const requiredBadges = ['cyber-awareness-starter', 'first-responder'];
    const earnedBadgeIds = userBadges.map(badge => badge.id);
    const hasRequiredBadges = requiredBadges.every(badgeId => earnedBadgeIds.includes(badgeId));
    
    const stats = getCompletionStats();
    return hasRequiredBadges && stats.averageScore >= 80 && stats.completedModules >= 2;
  };

  // Generate PDF certificate
  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${user.name}_Cybercrime_Training_Certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const stats = getCompletionStats();
  const isEligible = isCertificationEligible();

  if (!isEligible) {
    return (
      <Card>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate Not Available</h3>
          <p className="text-gray-600 mb-4">
            To earn your certificate, you need to:
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-1 mb-6">
            <li>✓ Complete Module 1 and earn "Cyber Awareness Starter" badge</li>
            <li>✓ Complete Module 2 and earn "First Responder" badge</li>
            <li>✓ Maintain an average score of 80% or higher</li>
          </ul>
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          ref={certificateRef}
          className="w-full bg-white p-12"
          style={{ aspectRatio: '297/210' }} // A4 landscape ratio
        >
          {/* Certificate Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-police-blue rounded-full flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-police-blue">CERTIFICATE OF COMPLETION</h1>
                <p className="text-lg text-gray-600">Cybercrime Investigation Training Program</p>
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 border-b-2 border-police-blue pb-2 inline-block">
              {user.name}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              has successfully completed the Cybercrime Investigation Training Program
              <br />
              and demonstrated proficiency in cybercrime investigation procedures
            </p>
          </div>

          {/* Achievement Details */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-police-blue">{stats.completedModules}</div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userBadges.length}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Badges Earned</h3>
            <div className="flex justify-center space-x-6">
              {userBadges.map(badge => (
                <div key={badge.id} className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-gray-700">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end">
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 w-48">
                <p className="text-sm font-medium text-gray-700">Training Coordinator</p>
                <p className="text-xs text-gray-500">Cybercrime Training Division</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600">
                <p>Certificate ID: CYBT-{user.id}-{new Date().getFullYear()}</p>
                <p>Issued on: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 w-48">
                <p className="text-sm font-medium text-gray-700">Program Director</p>
                <p className="text-xs text-gray-500">Police Training Academy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          variant="primary"
        >
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </Button>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    </div>
  );
};

export default CertificateGenerator;
import React from 'react';
import PropTypes from 'prop-types';

/**
 * CommunicationScoring component
 * 
 * This component analyzes and scores communication quality based on tone,
 * patience, clarity, and empathy.
 */
class CommunicationScoring {
  /**
   * Score a text response based on communication quality metrics
   * @param {string} text - The text to analyze
   * @param {Object} context - Additional context for scoring
   * @returns {Object} - Scoring results
   */
  static scoreText(text, context = {}) {
    if (!text) {
      return {
        overall: 0,
        tone: 0,
        patience: 0,
        clarity: 0,
        empathy: 0,
        feedback: 'No response provided.'
      };
    }
    
    // Convert to lowercase for analysis
    const lowerText = text.toLowerCase();
    
    // Score tone (politeness, professionalism)
    const toneScore = this.scoreTone(lowerText);
    
    // Score patience (taking time to explain, not rushing)
    const patienceScore = this.scorePatience(lowerText, context);
    
    // Score clarity (clear explanations, avoiding jargon)
    const clarityScore = this.scoreClarity(lowerText);
    
    // Score empathy (understanding victim's situation)
    const empathyScore = this.scoreEmpathy(lowerText, context);
    
    // Calculate overall score (weighted average)
    const overall = Math.round(
      (toneScore * 0.25) + 
      (patienceScore * 0.25) + 
      (clarityScore * 0.25) + 
      (empathyScore * 0.25)
    );
    
    // Generate feedback
    const feedback = this.generateFeedback(toneScore, patienceScore, clarityScore, empathyScore);
    
    return {
      overall,
      tone: toneScore,
      patience: patienceScore,
      clarity: clarityScore,
      empathy: empathyScore,
      feedback
    };
  }
  
  /**
   * Score the tone of a response
   * @param {string} text - The text to analyze
   * @returns {number} - Score from 0-10
   */
  static scoreTone(text) {
    let score = 5; // Start with neutral score
    
    // Positive tone indicators
    const positiveIndicators = [
      'please', 'thank you', 'appreciate', 'understand', 
      'help', 'assist', 'support', 'sir', 'madam', 'respect'
    ];
    
    // Negative tone indicators
    const negativeIndicators = [
      'just', 'simply', 'obviously', 'clearly', 'whatever',
      'hurry', 'quick', 'fast', 'now', 'immediately'
    ];
    
    // Check for positive indicators
    positiveIndicators.forEach(word => {
      if (text.includes(word)) {
        score += 1;
      }
    });
    
    // Check for negative indicators
    negativeIndicators.forEach(word => {
      if (text.includes(word)) {
        score -= 1;
      }
    });
    
    // Cap score between 0-10
    return Math.max(0, Math.min(10, score));
  }
  
  /**
   * Score the patience of a response
   * @param {string} text - The text to analyze
   * @param {Object} context - Additional context for scoring
   * @returns {number} - Score from 0-10
   */
  static scorePatience(text, context) {
    let score = 5; // Start with neutral score
    
    // Length-based scoring (longer responses often show more patience)
    const wordCount = text.split(/\s+/).length;
    
    if (wordCount < 5) {
      score -= 2; // Too brief
    } else if (wordCount > 20) {
      score += 2; // Detailed explanation
    }
    
    // Check for explanations
    if (text.includes('because') || text.includes('reason') || text.includes('explain')) {
      score += 1;
    }
    
    // Check for rushing indicators
    if (text.includes('hurry') || text.includes('quick') || text.includes('fast')) {
      score -= 2;
    }
    
    // Check for follow-up questions
    if (text.includes('?')) {
      score += 1;
    }
    
    // Cap score between 0-10
    return Math.max(0, Math.min(10, score));
  }
  
  /**
   * Score the clarity of a response
   * @param {string} text - The text to analyze
   * @returns {number} - Score from 0-10
   */
  static scoreClarity(text) {
    let score = 5; // Start with neutral score
    
    // Check sentence structure
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length > 1) {
      score += 1; // Multiple sentences often provide more clarity
    }
    
    // Check for jargon (simplified for demo)
    const jargonTerms = [
      'pursuant to', 'aforementioned', 'heretofore', 'notwithstanding',
      'in accordance with', 'expedite', 'facilitate'
    ];
    
    jargonTerms.forEach(term => {
      if (text.includes(term)) {
        score -= 1;
      }
    });
    
    // Check for explanatory phrases
    const explanatoryPhrases = [
      'this means', 'in other words', 'to explain', 'for example',
      'such as', 'in simple terms'
    ];
    
    explanatoryPhrases.forEach(phrase => {
      if (text.includes(phrase)) {
        score += 1;
      }
    });
    
    // Cap score between 0-10
    return Math.max(0, Math.min(10, score));
  }
  
  /**
   * Score the empathy of a response
   * @param {string} text - The text to analyze
   * @param {Object} context - Additional context for scoring
   * @returns {number} - Score from 0-10
   */
  static scoreEmpathy(text, context) {
    let score = 5; // Start with neutral score
    
    // Check for empathetic phrases
    const empatheticPhrases = [
      'understand', 'feel', 'difficult', 'challenging', 'sorry',
      'unfortunate', 'concern', 'worry', 'help', 'support'
    ];
    
    empatheticPhrases.forEach(phrase => {
      if (text.includes(phrase)) {
        score += 1;
      }
    });
    
    // Check for acknowledgment of emotions
    if (context.emotionalState) {
      const emotionWords = {
        distressed: ['distress', 'upset', 'worried', 'anxious'],
        angry: ['anger', 'frustration', 'upset', 'annoyed'],
        sad: ['sad', 'sorry', 'unfortunate', 'regret'],
        confused: ['confusion', 'unclear', 'understand', 'explain']
      };
      
      const relevantEmotions = emotionWords[context.emotionalState] || [];
      
      relevantEmotions.forEach(word => {
        if (text.includes(word)) {
          score += 1;
        }
      });
    }
    
    // Cap score between 0-10
    return Math.max(0, Math.min(10, score));
  }
  
  /**
   * Generate feedback based on scores
   * @param {number} toneScore - Tone score
   * @param {number} patienceScore - Patience score
   * @param {number} clarityScore - Clarity score
   * @param {number} empathyScore - Empathy score
   * @returns {string} - Feedback message
   */
  static generateFeedback(toneScore, patienceScore, clarityScore, empathyScore) {
    const feedback = [];
    
    // Tone feedback
    if (toneScore >= 8) {
      feedback.push('Your tone is excellent - professional and respectful.');
    } else if (toneScore >= 5) {
      feedback.push('Your tone is appropriate, but could be more professional.');
    } else {
      feedback.push('Your tone needs improvement. Try to be more respectful and professional.');
    }
    
    // Patience feedback
    if (patienceScore >= 8) {
      feedback.push('You showed great patience in your response.');
    } else if (patienceScore >= 5) {
      feedback.push('You showed adequate patience, but could take more time to explain.');
    } else {
      feedback.push('Try to be more patient and take time to explain things thoroughly.');
    }
    
    // Clarity feedback
    if (clarityScore >= 8) {
      feedback.push('Your explanation was very clear and easy to understand.');
    } else if (clarityScore >= 5) {
      feedback.push('Your explanation was reasonably clear, but could be improved.');
    } else {
      feedback.push('Try to be clearer in your explanations and avoid jargon.');
    }
    
    // Empathy feedback
    if (empathyScore >= 8) {
      feedback.push('You showed excellent empathy for the victim\'s situation.');
    } else if (empathyScore >= 5) {
      feedback.push('You showed some empathy, but could connect more with the victim\'s feelings.');
    } else {
      feedback.push('Try to show more empathy and acknowledge the victim\'s emotions.');
    }
    
    return feedback.join(' ');
  }
}

/**
 * CommunicationScoreDisplay component
 * 
 * This component displays communication scores and feedback.
 */
const CommunicationScoreDisplay = ({ scores }) => {
  if (!scores) {
    return null;
  }
  
  const { overall, tone, patience, clarity, empathy, feedback } = scores;
  
  // Helper function to get color class based on score
  const getScoreColorClass = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="communication-score bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Communication Quality</h3>
      
      <div className="overall-score flex items-center mb-4">
        <div className="score-label mr-2">Overall:</div>
        <div className={`score-value font-bold text-xl ${getScoreColorClass(overall)}`}>
          {overall}/10
        </div>
      </div>
      
      <div className="score-breakdown grid grid-cols-2 gap-2 mb-4">
        <div className="score-item">
          <div className="score-label text-sm text-gray-600">Tone:</div>
          <div className={`score-value font-semibold ${getScoreColorClass(tone)}`}>
            {tone}/10
          </div>
        </div>
        
        <div className="score-item">
          <div className="score-label text-sm text-gray-600">Patience:</div>
          <div className={`score-value font-semibold ${getScoreColorClass(patience)}`}>
            {patience}/10
          </div>
        </div>
        
        <div className="score-item">
          <div className="score-label text-sm text-gray-600">Clarity:</div>
          <div className={`score-value font-semibold ${getScoreColorClass(clarity)}`}>
            {clarity}/10
          </div>
        </div>
        
        <div className="score-item">
          <div className="score-label text-sm text-gray-600">Empathy:</div>
          <div className={`score-value font-semibold ${getScoreColorClass(empathy)}`}>
            {empathy}/10
          </div>
        </div>
      </div>
      
      <div className="feedback p-3 bg-gray-50 rounded border border-gray-200">
        <div className="feedback-label text-sm font-semibold mb-1">Feedback:</div>
        <div className="feedback-text text-sm">{feedback}</div>
      </div>
    </div>
  );
};

CommunicationScoreDisplay.propTypes = {
  scores: PropTypes.shape({
    overall: PropTypes.number.isRequired,
    tone: PropTypes.number.isRequired,
    patience: PropTypes.number.isRequired,
    clarity: PropTypes.number.isRequired,
    empathy: PropTypes.number.isRequired,
    feedback: PropTypes.string.isRequired
  })
};

export { CommunicationScoring, CommunicationScoreDisplay };
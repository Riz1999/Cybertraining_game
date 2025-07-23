/**
 * Badge Service Tests
 */
const badgeService = require('../services/badge.service');

describe('Badge Service', () => {
  describe('getBadgeDefinition', () => {
    test('should return cyber-awareness-starter badge definition', () => {
      const badge = badgeService.getBadgeDefinition('cyber-awareness-starter');
      
      expect(badge).toBeDefined();
      expect(badge.id).toBe('cyber-awareness-starter');
      expect(badge.name).toBe('Cyber Awareness Starter');
      expect(badge.moduleId).toBe('module-1-intro-cybercrime');
      expect(badge.xpReward).toBe(100);
    });

    test('should return first-responder badge definition', () => {
      const badge = badgeService.getBadgeDefinition('first-responder');
      
      expect(badge).toBeDefined();
      expect(badge.id).toBe('first-responder');
      expect(badge.name).toBe('First Responder');
      expect(badge.moduleId).toBe('module-2-complaint-categorization');
      expect(badge.xpReward).toBe(150);
    });

    test('should return digital-defender badge definition', () => {
      const badge = badgeService.getBadgeDefinition('digital-defender');
      
      expect(badge).toBeDefined();
      expect(badge.id).toBe('digital-defender');
      expect(badge.name).toBe('Digital Defender');
      expect(badge.moduleId).toBe('module-3-time-critical-response');
      expect(badge.xpReward).toBe(200);
    });

    test('should return null for non-existent badge', () => {
      const badge = badgeService.getBadgeDefinition('non-existent-badge');
      expect(badge).toBeNull();
    });
  });

  describe('BADGE_DEFINITIONS', () => {
    test('should contain all expected badges', () => {
      const definitions = badgeService.BADGE_DEFINITIONS;
      
      expect(definitions).toHaveProperty('cyber-awareness-starter');
      expect(definitions).toHaveProperty('first-responder');
      expect(definitions).toHaveProperty('digital-defender');
      
      // Verify First Responder badge specifically
      const firstResponder = definitions['first-responder'];
      expect(firstResponder.name).toBe('First Responder');
      expect(firstResponder.description).toContain('complaint categorization');
      expect(firstResponder.moduleId).toBe('module-2-complaint-categorization');
      expect(firstResponder.xpReward).toBe(150);
    });
  });
});
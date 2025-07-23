/**
 * Decision Tree System Tests
 * 
 * Tests for the decision-based scenario system components and services.
 */
import { DecisionTree, DecisionPoint, DecisionOption, DecisionTreeProgress } from '../../../simulation/models/DecisionTreeModels';
import { DecisionTreeService } from '../../../simulation/services/DecisionTreeService';

describe('Decision Tree Models', () => {
  describe('DecisionOption', () => {
    test('should create a decision option with default values', () => {
      const option = new DecisionOption({
        id: 'test-option',
        text: 'Test Option',
        points: 10
      });

      expect(option.id).toBe('test-option');
      expect(option.text).toBe('Test Option');
      expect(option.points).toBe(10);
      expect(option.isOptimal).toBe(false);
      expect(option.consequences).toEqual([]);
    });

    test('should serialize to JSON correctly', () => {
      const option = new DecisionOption({
        id: 'test-option',
        text: 'Test Option',
        points: 10,
        isOptimal: true
      });

      const json = option.toJSON();
      expect(json.id).toBe('test-option');
      expect(json.text).toBe('Test Option');
      expect(json.points).toBe(10);
      expect(json.isOptimal).toBe(true);
    });
  });

  describe('DecisionPoint', () => {
    test('should create a decision point with options', () => {
      const options = [
        new DecisionOption({ id: 'opt1', text: 'Option 1', points: 10 }),
        new DecisionOption({ id: 'opt2', text: 'Option 2', points: 5 })
      ];

      const decisionPoint = new DecisionPoint({
        id: 'test-decision',
        title: 'Test Decision',
        scenario: 'Test scenario',
        options
      });

      expect(decisionPoint.id).toBe('test-decision');
      expect(decisionPoint.title).toBe('Test Decision');
      expect(decisionPoint.options).toHaveLength(2);
    });

    test('should evaluate decisions correctly', () => {
      const options = [
        new DecisionOption({ 
          id: 'opt1', 
          text: 'Option 1', 
          points: 10, 
          feedback: 'Good choice!',
          isOptimal: true 
        }),
        new DecisionOption({ 
          id: 'opt2', 
          text: 'Option 2', 
          points: 5, 
          feedback: 'Could be better',
          isOptimal: false 
        })
      ];

      const decisionPoint = new DecisionPoint({
        id: 'test-decision',
        title: 'Test Decision',
        scenario: 'Test scenario',
        options
      });

      const evaluation = decisionPoint.evaluateDecision('opt1');
      expect(evaluation.points).toBe(10);
      expect(evaluation.feedback).toBe('Good choice!');
      expect(evaluation.isOptimal).toBe(true);

      const invalidEvaluation = decisionPoint.evaluateDecision('invalid');
      expect(invalidEvaluation.points).toBe(0);
      expect(invalidEvaluation.isOptimal).toBe(false);
    });
  });

  describe('DecisionTree', () => {
    test('should create a decision tree with decision points', () => {
      const decisionPoints = [
        new DecisionPoint({
          id: 'decision1',
          title: 'First Decision',
          scenario: 'First scenario',
          options: [
            new DecisionOption({ id: 'opt1', text: 'Option 1', points: 10 })
          ]
        }),
        new DecisionPoint({
          id: 'decision2',
          title: 'Second Decision',
          scenario: 'Second scenario',
          options: [
            new DecisionOption({ id: 'opt2', text: 'Option 2', points: 15 })
          ]
        })
      ];

      const tree = new DecisionTree({
        id: 'test-tree',
        title: 'Test Tree',
        decisionPoints,
        startDecisionId: 'decision1'
      });

      expect(tree.id).toBe('test-tree');
      expect(tree.decisionPoints).toHaveLength(2);
      expect(tree.startDecisionId).toBe('decision1');
    });

    test('should calculate max score correctly', () => {
      const decisionPoints = [
        new DecisionPoint({
          id: 'decision1',
          title: 'First Decision',
          scenario: 'First scenario',
          options: [
            new DecisionOption({ id: 'opt1', text: 'Option 1', points: 10 }),
            new DecisionOption({ id: 'opt2', text: 'Option 2', points: 15 })
          ]
        }),
        new DecisionPoint({
          id: 'decision2',
          title: 'Second Decision',
          scenario: 'Second scenario',
          options: [
            new DecisionOption({ id: 'opt3', text: 'Option 3', points: 20 })
          ]
        })
      ];

      const tree = new DecisionTree({
        id: 'test-tree',
        title: 'Test Tree',
        decisionPoints
      });

      // Max score should be 15 (from decision1) + 20 (from decision2) = 35
      expect(tree.calculateMaxScore()).toBe(35);
    });

    test('should validate tree structure', () => {
      const decisionPoints = [
        new DecisionPoint({
          id: 'decision1',
          title: 'First Decision',
          scenario: 'First scenario',
          options: [
            new DecisionOption({ 
              id: 'opt1', 
              text: 'Option 1', 
              points: 10,
              nextDecisionId: 'decision2' 
            })
          ]
        }),
        new DecisionPoint({
          id: 'decision2',
          title: 'Second Decision',
          scenario: 'Second scenario',
          options: [
            new DecisionOption({ id: 'opt2', text: 'Option 2', points: 15 })
          ]
        })
      ];

      const tree = new DecisionTree({
        id: 'test-tree',
        title: 'Test Tree',
        decisionPoints,
        startDecisionId: 'decision1'
      });

      const validation = tree.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should detect invalid references', () => {
      const decisionPoints = [
        new DecisionPoint({
          id: 'decision1',
          title: 'First Decision',
          scenario: 'First scenario',
          options: [
            new DecisionOption({ 
              id: 'opt1', 
              text: 'Option 1', 
              points: 10,
              nextDecisionId: 'nonexistent' 
            })
          ]
        })
      ];

      const tree = new DecisionTree({
        id: 'test-tree',
        title: 'Test Tree',
        decisionPoints,
        startDecisionId: 'decision1'
      });

      const validation = tree.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('DecisionTreeProgress', () => {
    test('should track decision progress correctly', () => {
      const progress = new DecisionTreeProgress({
        userId: 'user123',
        decisionTreeId: 'tree123',
        currentDecisionId: 'decision1'
      });

      expect(progress.userId).toBe('user123');
      expect(progress.decisionTreeId).toBe('tree123');
      expect(progress.totalScore).toBe(0);
      expect(progress.isCompleted).toBe(false);
    });

    test('should record decisions and update score', () => {
      const progress = new DecisionTreeProgress({
        userId: 'user123',
        decisionTreeId: 'tree123',
        currentDecisionId: 'decision1'
      });

      const evaluation = {
        points: 10,
        feedback: 'Good choice!',
        nextDecisionId: 'decision2',
        consequences: [],
        isOptimal: true
      };

      progress.recordDecision('decision1', 'opt1', evaluation);

      expect(progress.totalScore).toBe(10);
      expect(progress.currentDecisionId).toBe('decision2');
      expect(progress.decisions).toHaveLength(1);
      expect(progress.decisions[0].points).toBe(10);
      expect(progress.decisions[0].isOptimal).toBe(true);
    });

    test('should mark as completed when no next decision', () => {
      const progress = new DecisionTreeProgress({
        userId: 'user123',
        decisionTreeId: 'tree123',
        currentDecisionId: 'decision1'
      });

      const evaluation = {
        points: 10,
        feedback: 'Final choice!',
        nextDecisionId: null,
        consequences: [],
        isOptimal: true
      };

      progress.recordDecision('decision1', 'opt1', evaluation);

      expect(progress.isCompleted).toBe(true);
      expect(progress.endTime).toBeDefined();
    });

    test('should calculate performance metrics', () => {
      const progress = new DecisionTreeProgress({
        userId: 'user123',
        decisionTreeId: 'tree123',
        currentDecisionId: 'decision1'
      });

      // Record multiple decisions
      progress.recordDecision('decision1', 'opt1', {
        points: 10,
        feedback: 'Good',
        nextDecisionId: 'decision2',
        consequences: [],
        isOptimal: true
      });

      progress.recordDecision('decision2', 'opt2', {
        points: 5,
        feedback: 'Okay',
        nextDecisionId: null,
        consequences: [],
        isOptimal: false
      });

      const metrics = progress.getPerformanceMetrics();
      expect(metrics.totalDecisions).toBe(2);
      expect(metrics.optimalDecisions).toBe(1);
      expect(metrics.optimalDecisionRate).toBe(0.5);
      expect(metrics.totalScore).toBe(15);
      expect(metrics.isCompleted).toBe(true);
    });
  });
});

describe('DecisionTreeService', () => {
  let service;

  beforeEach(() => {
    service = new DecisionTreeService();
  });

  test('should initialize a decision tree', async () => {
    const treeData = {
      id: 'test-tree',
      title: 'Test Tree',
      decisionPoints: [
        {
          id: 'decision1',
          title: 'First Decision',
          scenario: 'Test scenario',
          options: [
            { id: 'opt1', text: 'Option 1', points: 10 }
          ]
        }
      ],
      startDecisionId: 'decision1'
    };

    const progress = await service.initializeTree(treeData, 'user123');

    expect(progress).toBeDefined();
    expect(progress.userId).toBe('user123');
    expect(progress.decisionTreeId).toBe('test-tree');
    expect(service.currentTree).toBeDefined();
    expect(service.currentProgress).toBeDefined();
  });

  test('should get current decision', async () => {
    const treeData = {
      id: 'test-tree',
      title: 'Test Tree',
      decisionPoints: [
        {
          id: 'decision1',
          title: 'First Decision',
          scenario: 'Test scenario',
          options: [
            { id: 'opt1', text: 'Option 1', points: 10 }
          ]
        }
      ],
      startDecisionId: 'decision1'
    };

    await service.initializeTree(treeData, 'user123');
    const currentDecision = service.getCurrentDecision();

    expect(currentDecision).toBeDefined();
    expect(currentDecision.id).toBe('decision1');
    expect(currentDecision.title).toBe('First Decision');
  });

  test('should make decisions and update progress', async () => {
    const treeData = {
      id: 'test-tree',
      title: 'Test Tree',
      decisionPoints: [
        {
          id: 'decision1',
          title: 'First Decision',
          scenario: 'Test scenario',
          options: [
            { 
              id: 'opt1', 
              text: 'Option 1', 
              points: 10,
              feedback: 'Good choice!',
              nextDecisionId: null,
              isOptimal: true
            }
          ]
        }
      ],
      startDecisionId: 'decision1'
    };

    await service.initializeTree(treeData, 'user123');
    const result = await service.makeDecision('opt1');

    expect(result.evaluation.points).toBe(10);
    expect(result.evaluation.feedback).toBe('Good choice!');
    expect(result.isCompleted).toBe(true);
    expect(service.currentProgress.totalScore).toBe(10);
  });

  test('should handle invalid decisions', async () => {
    const treeData = {
      id: 'test-tree',
      title: 'Test Tree',
      decisionPoints: [
        {
          id: 'decision1',
          title: 'First Decision',
          scenario: 'Test scenario',
          options: [
            { id: 'opt1', text: 'Option 1', points: 10 }
          ]
        }
      ],
      startDecisionId: 'decision1'
    };

    await service.initializeTree(treeData, 'user123');
    
    await expect(service.makeDecision('invalid-option')).resolves.toBeDefined();
    // The service should handle invalid options gracefully
    expect(service.currentProgress.totalScore).toBe(0);
  });

  test('should reset service state', async () => {
    const treeData = {
      id: 'test-tree',
      title: 'Test Tree',
      decisionPoints: [
        {
          id: 'decision1',
          title: 'First Decision',
          scenario: 'Test scenario',
          options: [
            { id: 'opt1', text: 'Option 1', points: 10 }
          ]
        }
      ],
      startDecisionId: 'decision1'
    };

    await service.initializeTree(treeData, 'user123');
    expect(service.currentTree).toBeDefined();
    expect(service.currentProgress).toBeDefined();

    service.reset();
    expect(service.currentTree).toBeNull();
    expect(service.currentProgress).toBeNull();
  });
});
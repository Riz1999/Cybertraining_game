/**
 * Content Schema Validator Service
 * 
 * This service handles validation of module content against defined schemas.
 */
import { ContentSchema } from '../models/ModuleModels';

/**
 * ContentSchemaValidator class
 * Handles content validation against predefined schemas
 */
export class ContentSchemaValidator {
  constructor() {
    this.schemas = new Map();
    this.validators = new Map();
    this.initializeDefaultSchemas();
  }

  /**
   * Initialize default schemas for common activity types
   */
  initializeDefaultSchemas() {
    // Quiz activity schema
    this.registerSchema('quiz', {
      name: 'Quiz Activity Schema',
      version: '1.0.0',
      activityType: 'quiz',
      schema: {
        type: 'object',
        required: ['questions', 'passingScore'],
        properties: {
          questions: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['id', 'question', 'type', 'options'],
              properties: {
                id: { type: 'string' },
                question: { type: 'string', minLength: 1 },
                type: { 
                  type: 'string', 
                  enum: ['multiple_choice', 'true_false', 'text_input', 'drag_drop'] 
                },
                options: { type: 'array', minItems: 2 },
                correctAnswer: { type: ['string', 'number', 'array'] },
                points: { type: 'number', minimum: 0 },
                explanation: { type: 'string' }
              }
            }
          },
          passingScore: { type: 'number', minimum: 0, maximum: 1 },
          timeLimit: { type: 'number', minimum: 0 },
          allowRetries: { type: 'boolean' },
          maxAttempts: { type: 'number', minimum: 1 }
        }
      }
    });

    // Simulation activity schema
    this.registerSchema('simulation', {
      name: 'Simulation Activity Schema',
      version: '1.0.0',
      activityType: 'simulation',
      schema: {
        type: 'object',
        required: ['type', 'scenario', 'interactions'],
        properties: {
          type: { 
            type: 'string', 
            enum: ['dialog', 'form', 'decision', 'timer', 'interactive'] 
          },
          scenario: {
            type: 'object',
            required: ['title', 'description'],
            properties: {
              title: { type: 'string', minLength: 1 },
              description: { type: 'string', minLength: 1 },
              context: { type: 'string' },
              characters: { type: 'array' }
            }
          },
          interactions: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['id', 'type', 'prompt'],
              properties: {
                id: { type: 'string' },
                type: { type: 'string' },
                prompt: { type: 'string', minLength: 1 },
                options: { type: 'array' },
                correctResponse: {},
                timeLimit: { type: 'number', minimum: 0 },
                points: { type: 'number', minimum: 0 }
              }
            }
          },
          assets: { type: 'array' },
          outcomes: { type: 'array' }
        }
      }
    });

    // Reading activity schema
    this.registerSchema('reading', {
      name: 'Reading Activity Schema',
      version: '1.0.0',
      activityType: 'reading',
      schema: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'object',
            required: ['sections'],
            properties: {
              sections: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['id', 'title', 'content'],
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string', minLength: 1 },
                    content: { type: 'string', minLength: 1 },
                    type: { 
                      type: 'string', 
                      enum: ['text', 'video', 'audio', 'image', 'interactive'] 
                    },
                    mediaUrl: { type: 'string' },
                    duration: { type: 'number', minimum: 0 }
                  }
                }
              },
              estimatedReadingTime: { type: 'number', minimum: 0 },
              knowledgeCheck: { type: 'object' }
            }
          }
        }
      }
    });

    // Interactive activity schema
    this.registerSchema('interactive', {
      name: 'Interactive Activity Schema',
      version: '1.0.0',
      activityType: 'interactive',
      schema: {
        type: 'object',
        required: ['components'],
        properties: {
          components: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['id', 'type'],
              properties: {
                id: { type: 'string' },
                type: { 
                  type: 'string', 
                  enum: ['map', 'timeline', 'diagram', 'calculator', 'form_builder'] 
                },
                config: { type: 'object' },
                interactions: { type: 'array' },
                validation: { type: 'object' }
              }
            }
          },
          layout: { type: 'string', enum: ['single', 'tabbed', 'stepped'] },
          navigation: { type: 'object' }
        }
      }
    });
  }

  /**
   * Register a content schema
   * @param {string} schemaId - Unique identifier for the schema
   * @param {Object} schemaData - The schema configuration
   */
  registerSchema(schemaId, schemaData) {
    const schema = new ContentSchema({
      id: schemaId,
      ...schemaData
    });
    this.schemas.set(schemaId, schema);
  }

  /**
   * Register a custom validator function
   * @param {string} validatorId - Unique identifier for the validator
   * @param {Function} validator - The validator function
   */
  registerValidator(validatorId, validator) {
    this.validators.set(validatorId, validator);
  }

  /**
   * Validate content against a schema
   * @param {Object} content - The content to validate
   * @param {string} schemaId - The schema ID to validate against
   * @param {Object} options - Additional validation options
   * @returns {Object} - Validation result with isValid and errors
   */
  validateContent(content, schemaId, options = {}) {
    const schema = this.schemas.get(schemaId);
    
    if (!schema) {
      return {
        isValid: false,
        errors: [`Schema '${schemaId}' not found`],
        warnings: []
      };
    }

    const errors = [];
    const warnings = [];

    try {
      // Perform basic schema validation
      const basicValidation = this.validateAgainstSchema(content, schema.schema);
      errors.push(...basicValidation.errors);
      warnings.push(...basicValidation.warnings);

      // Run custom validators if available
      const customValidator = this.validators.get(schemaId);
      if (customValidator) {
        const customValidation = customValidator(content, schema, options);
        if (customValidation.errors) {
          errors.push(...customValidation.errors);
        }
        if (customValidation.warnings) {
          warnings.push(...customValidation.warnings);
        }
      }

      // Activity-specific validation
      const activityValidation = this.validateActivitySpecific(content, schema.activityType);
      errors.push(...activityValidation.errors);
      warnings.push(...activityValidation.warnings);

    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      schemaId,
      schemaVersion: schema.version
    };
  }

  /**
   * Validate content against a JSON schema
   * @param {Object} content - The content to validate
   * @param {Object} schema - The JSON schema
   * @returns {Object} - Validation result
   */
  validateAgainstSchema(content, schema) {
    const errors = [];
    const warnings = [];

    // Basic type checking
    if (schema.type && typeof content !== schema.type && schema.type !== 'object') {
      errors.push(`Expected type '${schema.type}', got '${typeof content}'`);
      return { errors, warnings };
    }

    // Required properties check
    if (schema.required && Array.isArray(schema.required)) {
      schema.required.forEach(prop => {
        if (!(prop in content)) {
          errors.push(`Required property '${prop}' is missing`);
        }
      });
    }

    // Properties validation
    if (schema.properties) {
      Object.keys(schema.properties).forEach(prop => {
        if (prop in content) {
          const propSchema = schema.properties[prop];
          const propValidation = this.validateProperty(content[prop], propSchema, prop);
          errors.push(...propValidation.errors);
          warnings.push(...propValidation.warnings);
        }
      });
    }

    // Array validation
    if (schema.type === 'array' && Array.isArray(content)) {
      if (schema.minItems && content.length < schema.minItems) {
        errors.push(`Array must have at least ${schema.minItems} items, got ${content.length}`);
      }
      if (schema.maxItems && content.length > schema.maxItems) {
        errors.push(`Array must have at most ${schema.maxItems} items, got ${content.length}`);
      }
      
      if (schema.items) {
        content.forEach((item, index) => {
          const itemValidation = this.validateAgainstSchema(item, schema.items);
          itemValidation.errors.forEach(error => {
            errors.push(`Item ${index}: ${error}`);
          });
          itemValidation.warnings.forEach(warning => {
            warnings.push(`Item ${index}: ${warning}`);
          });
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate a single property
   * @param {*} value - The property value
   * @param {Object} schema - The property schema
   * @param {string} propName - The property name
   * @returns {Object} - Validation result
   */
  validateProperty(value, schema, propName) {
    const errors = [];
    const warnings = [];

    // Type validation
    if (schema.type && typeof value !== schema.type) {
      errors.push(`Property '${propName}' expected type '${schema.type}', got '${typeof value}'`);
      return { errors, warnings };
    }

    // String validation
    if (schema.type === 'string') {
      if (schema.minLength && value.length < schema.minLength) {
        errors.push(`Property '${propName}' must be at least ${schema.minLength} characters long`);
      }
      if (schema.maxLength && value.length > schema.maxLength) {
        errors.push(`Property '${propName}' must be at most ${schema.maxLength} characters long`);
      }
      if (schema.enum && !schema.enum.includes(value)) {
        errors.push(`Property '${propName}' must be one of: ${schema.enum.join(', ')}`);
      }
    }

    // Number validation
    if (schema.type === 'number') {
      if (schema.minimum !== undefined && value < schema.minimum) {
        errors.push(`Property '${propName}' must be at least ${schema.minimum}`);
      }
      if (schema.maximum !== undefined && value > schema.maximum) {
        errors.push(`Property '${propName}' must be at most ${schema.maximum}`);
      }
    }

    // Array validation
    if (schema.type === 'array' && Array.isArray(value)) {
      if (schema.minItems && value.length < schema.minItems) {
        errors.push(`Property '${propName}' must have at least ${schema.minItems} items`);
      }
      if (schema.maxItems && value.length > schema.maxItems) {
        errors.push(`Property '${propName}' must have at most ${schema.maxItems} items`);
      }
    }

    // Object validation
    if (schema.type === 'object' && typeof value === 'object') {
      const objectValidation = this.validateAgainstSchema(value, schema);
      errors.push(...objectValidation.errors);
      warnings.push(...objectValidation.warnings);
    }

    return { errors, warnings };
  }

  /**
   * Perform activity-specific validation
   * @param {Object} content - The content to validate
   * @param {string} activityType - The activity type
   * @returns {Object} - Validation result
   */
  validateActivitySpecific(content, activityType) {
    const errors = [];
    const warnings = [];

    switch (activityType) {
      case 'quiz':
        return this.validateQuizContent(content);
      case 'simulation':
        return this.validateSimulationContent(content);
      case 'reading':
        return this.validateReadingContent(content);
      case 'interactive':
        return this.validateInteractiveContent(content);
      default:
        return { errors, warnings };
    }
  }

  /**
   * Validate quiz-specific content
   * @param {Object} content - The quiz content
   * @returns {Object} - Validation result
   */
  validateQuizContent(content) {
    const errors = [];
    const warnings = [];

    if (content.questions) {
      content.questions.forEach((question, index) => {
        // Check if multiple choice questions have correct answers
        if (question.type === 'multiple_choice') {
          if (!question.correctAnswer) {
            errors.push(`Question ${index + 1}: Multiple choice question must have a correct answer`);
          }
          if (question.options && question.options.length < 2) {
            errors.push(`Question ${index + 1}: Multiple choice question must have at least 2 options`);
          }
        }

        // Check if drag-drop questions have proper structure
        if (question.type === 'drag_drop') {
          if (!Array.isArray(question.correctAnswer)) {
            errors.push(`Question ${index + 1}: Drag-drop question must have array of correct answers`);
          }
        }

        // Warn about missing explanations
        if (!question.explanation) {
          warnings.push(`Question ${index + 1}: Consider adding an explanation for better learning`);
        }
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate simulation-specific content
   * @param {Object} content - The simulation content
   * @returns {Object} - Validation result
   */
  validateSimulationContent(content) {
    const errors = [];
    const warnings = [];

    // Check for interaction flow
    if (content.interactions) {
      const interactionIds = content.interactions.map(i => i.id);
      
      content.interactions.forEach((interaction, index) => {
        // Check for orphaned interactions
        if (interaction.nextInteractionId && !interactionIds.includes(interaction.nextInteractionId)) {
          errors.push(`Interaction ${index + 1}: References non-existent interaction '${interaction.nextInteractionId}'`);
        }
      });

      // Check for unreachable interactions
      const reachableIds = new Set();
      const findReachable = (id) => {
        if (reachableIds.has(id)) return;
        reachableIds.add(id);
        const interaction = content.interactions.find(i => i.id === id);
        if (interaction && interaction.nextInteractionId) {
          findReachable(interaction.nextInteractionId);
        }
      };

      if (content.interactions.length > 0) {
        findReachable(content.interactions[0].id);
        
        content.interactions.forEach(interaction => {
          if (!reachableIds.has(interaction.id)) {
            warnings.push(`Interaction '${interaction.id}' may be unreachable`);
          }
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate reading-specific content
   * @param {Object} content - The reading content
   * @returns {Object} - Validation result
   */
  validateReadingContent(content) {
    const errors = [];
    const warnings = [];

    if (content.content && content.content.sections) {
      let totalEstimatedTime = 0;
      
      content.content.sections.forEach((section, index) => {
        // Estimate reading time if not provided
        if (section.type === 'text' && section.content) {
          const wordCount = section.content.split(/\s+/).length;
          const estimatedTime = Math.ceil(wordCount / 200); // 200 words per minute
          totalEstimatedTime += estimatedTime;
          
          if (!section.duration) {
            warnings.push(`Section ${index + 1}: Consider adding estimated reading time (${estimatedTime} minutes)`);
          }
        }

        // Check for media sections without URLs
        if (['video', 'audio', 'image'].includes(section.type) && !section.mediaUrl) {
          errors.push(`Section ${index + 1}: ${section.type} section must have a mediaUrl`);
        }
      });

      // Compare with provided estimated time
      if (content.content.estimatedReadingTime && Math.abs(content.content.estimatedReadingTime - totalEstimatedTime) > 5) {
        warnings.push(`Estimated reading time (${content.content.estimatedReadingTime} min) differs significantly from calculated time (${totalEstimatedTime} min)`);
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate interactive-specific content
   * @param {Object} content - The interactive content
   * @returns {Object} - Validation result
   */
  validateInteractiveContent(content) {
    const errors = [];
    const warnings = [];

    if (content.components) {
      content.components.forEach((component, index) => {
        // Check for required configurations based on component type
        switch (component.type) {
          case 'map':
            if (!component.config || !component.config.mapData) {
              errors.push(`Component ${index + 1}: Map component must have mapData configuration`);
            }
            break;
          case 'form_builder':
            if (!component.config || !component.config.fields) {
              errors.push(`Component ${index + 1}: Form builder component must have fields configuration`);
            }
            break;
          case 'timeline':
            if (!component.config || !component.config.events) {
              errors.push(`Component ${index + 1}: Timeline component must have events configuration`);
            }
            break;
        }

        // Warn about missing interactions
        if (!component.interactions || component.interactions.length === 0) {
          warnings.push(`Component ${index + 1}: Consider adding interactions for better engagement`);
        }
      });
    }

    return { errors, warnings };
  }

  /**
   * Get all registered schemas
   * @returns {Array} - Array of schema information
   */
  getSchemas() {
    return Array.from(this.schemas.values()).map(schema => ({
      id: schema.id,
      name: schema.name,
      version: schema.version,
      activityType: schema.activityType,
      isActive: schema.isActive
    }));
  }

  /**
   * Get schema by ID
   * @param {string} schemaId - The schema ID
   * @returns {ContentSchema|null} - The schema or null if not found
   */
  getSchema(schemaId) {
    return this.schemas.get(schemaId) || null;
  }

  /**
   * Validate multiple contents at once
   * @param {Array} contents - Array of content objects with schemaId
   * @returns {Array} - Array of validation results
   */
  validateMultiple(contents) {
    return contents.map(({ content, schemaId, options = {} }) => ({
      ...this.validateContent(content, schemaId, options),
      originalContent: content
    }));
  }
}

export default ContentSchemaValidator;
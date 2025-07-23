/**
 * Simulation Service
 * 
 * This service handles loading and saving simulation data,
 * as well as tracking progress and analytics.
 */
import axios from 'axios';
import { Simulation } from '../simulation/models/SimulationModels';

class SimulationService {
  /**
   * Load a simulation by ID
   * @param {string} simulationId - The ID of the simulation to load
   * @returns {Promise<Simulation>} - A promise that resolves to the simulation data
   */
  async loadSimulation(simulationId) {
    try {
      const response = await axios.get(`/api/simulations/${simulationId}`);
      return new Simulation(response.data);
    } catch (error) {
      console.error('Error loading simulation:', error);
      throw new Error(`Failed to load simulation: ${error.message}`);
    }
  }

  /**
   * Save simulation progress
   * @param {string} simulationId - The ID of the simulation
   * @param {Object} progressData - The progress data to save
   * @returns {Promise<Object>} - A promise that resolves to the saved progress data
   */
  async saveProgress(simulationId, progressData) {
    try {
      const response = await axios.post(`/api/simulations/${simulationId}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error saving simulation progress:', error);
      throw new Error(`Failed to save progress: ${error.message}`);
    }
  }

  /**
   * Get user progress for a simulation
   * @param {string} simulationId - The ID of the simulation
   * @param {string} userId - The ID of the user
   * @returns {Promise<Object>} - A promise that resolves to the user's progress data
   */
  async getUserProgress(simulationId, userId) {
    try {
      const response = await axios.get(`/api/users/${userId}/simulations/${simulationId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw new Error(`Failed to get user progress: ${error.message}`);
    }
  }

  /**
   * Track simulation analytics
   * @param {Object} analyticsData - The analytics data to track
   * @returns {Promise<Object>} - A promise that resolves to the tracked analytics data
   */
  async trackAnalytics(analyticsData) {
    try {
      const response = await axios.post('/api/analytics/simulations', analyticsData);
      return response.data;
    } catch (error) {
      console.error('Error tracking simulation analytics:', error);
      // Don't throw an error for analytics failures
      return null;
    }
  }

  /**
   * Get simulations for a module
   * @param {string} moduleId - The ID of the module
   * @returns {Promise<Array<Object>>} - A promise that resolves to an array of simulation data
   */
  async getSimulationsForModule(moduleId) {
    try {
      const response = await axios.get(`/api/modules/${moduleId}/simulations`);
      return response.data.map(sim => new Simulation(sim));
    } catch (error) {
      console.error('Error getting simulations for module:', error);
      throw new Error(`Failed to get simulations: ${error.message}`);
    }
  }

  /**
   * Create a new simulation (admin function)
   * @param {Object} simulationData - The simulation data to create
   * @returns {Promise<Simulation>} - A promise that resolves to the created simulation
   */
  async createSimulation(simulationData) {
    try {
      const response = await axios.post('/api/simulations', simulationData);
      return new Simulation(response.data);
    } catch (error) {
      console.error('Error creating simulation:', error);
      throw new Error(`Failed to create simulation: ${error.message}`);
    }
  }

  /**
   * Update an existing simulation (admin function)
   * @param {string} simulationId - The ID of the simulation to update
   * @param {Object} simulationData - The updated simulation data
   * @returns {Promise<Simulation>} - A promise that resolves to the updated simulation
   */
  async updateSimulation(simulationId, simulationData) {
    try {
      const response = await axios.put(`/api/simulations/${simulationId}`, simulationData);
      return new Simulation(response.data);
    } catch (error) {
      console.error('Error updating simulation:', error);
      throw new Error(`Failed to update simulation: ${error.message}`);
    }
  }

  /**
   * Delete a simulation (admin function)
   * @param {string} simulationId - The ID of the simulation to delete
   * @returns {Promise<boolean>} - A promise that resolves to true if the deletion was successful
   */
  async deleteSimulation(simulationId) {
    try {
      await axios.delete(`/api/simulations/${simulationId}`);
      return true;
    } catch (error) {
      console.error('Error deleting simulation:', error);
      throw new Error(`Failed to delete simulation: ${error.message}`);
    }
  }
}

// Create a singleton instance
const simulationService = new SimulationService();

export default simulationService;
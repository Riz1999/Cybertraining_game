/**
 * Simulation Redux Slice
 * 
 * This slice manages the global state for simulations.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import simulationService from '../../services/SimulationService';

// Async thunks
export const loadSimulation = createAsyncThunk(
  'simulation/loadSimulation',
  async (simulationId, { rejectWithValue }) => {
    try {
      const simulation = await simulationService.loadSimulation(simulationId);
      return simulation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveSimulationProgress = createAsyncThunk(
  'simulation/saveProgress',
  async ({ simulationId, progressData }, { rejectWithValue }) => {
    try {
      const result = await simulationService.saveProgress(simulationId, progressData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserSimulationProgress = createAsyncThunk(
  'simulation/getUserProgress',
  async ({ simulationId, userId }, { rejectWithValue }) => {
    try {
      const progress = await simulationService.getUserProgress(simulationId, userId);
      return progress;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getModuleSimulations = createAsyncThunk(
  'simulation/getModuleSimulations',
  async (moduleId, { rejectWithValue }) => {
    try {
      const simulations = await simulationService.getSimulationsForModule(moduleId);
      return simulations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  currentSimulation: null,
  simulations: [],
  userProgress: {},
  loading: false,
  error: null,
  activeSimulationId: null
};

// Create the slice
const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setActiveSimulation: (state, action) => {
      state.activeSimulationId = action.payload;
    },
    clearActiveSimulation: (state) => {
      state.activeSimulationId = null;
    },
    updateSimulationProgress: (state, action) => {
      const { simulationId, progress } = action.payload;
      state.userProgress[simulationId] = {
        ...state.userProgress[simulationId],
        ...progress
      };
    },
    resetSimulationState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Load simulation
      .addCase(loadSimulation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSimulation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSimulation = action.payload;
      })
      .addCase(loadSimulation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save progress
      .addCase(saveSimulationProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSimulationProgress.fulfilled, (state, action) => {
        state.loading = false;
        const { simulationId, ...progress } = action.payload;
        state.userProgress[simulationId] = {
          ...state.userProgress[simulationId],
          ...progress
        };
      })
      .addCase(saveSimulationProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get user progress
      .addCase(getUserSimulationProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserSimulationProgress.fulfilled, (state, action) => {
        state.loading = false;
        const { simulationId, ...progress } = action.payload;
        state.userProgress[simulationId] = progress;
      })
      .addCase(getUserSimulationProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get module simulations
      .addCase(getModuleSimulations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getModuleSimulations.fulfilled, (state, action) => {
        state.loading = false;
        state.simulations = action.payload;
      })
      .addCase(getModuleSimulations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  setActiveSimulation,
  clearActiveSimulation,
  updateSimulationProgress,
  resetSimulationState
} = simulationSlice.actions;

// Export selectors
export const selectCurrentSimulation = (state) => state.simulation.currentSimulation;
export const selectSimulations = (state) => state.simulation.simulations;
export const selectUserProgress = (state) => state.simulation.userProgress;
export const selectSimulationLoading = (state) => state.simulation.loading;
export const selectSimulationError = (state) => state.simulation.error;
export const selectActiveSimulationId = (state) => state.simulation.activeSimulationId;

export const selectSimulationById = (state, simulationId) => 
  state.simulation.simulations.find(sim => sim.id === simulationId);

export const selectUserProgressForSimulation = (state, simulationId) => 
  state.simulation.userProgress[simulationId] || null;

// Export reducer
export default simulationSlice.reducer;
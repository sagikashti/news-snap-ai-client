import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SummaryService from '../../services/summaryService';
import type { SummaryRequest, SummaryResponse, LoadingState } from '../../types';

// Async thunk for summarizing URL
export const summarizeUrl = createAsyncThunk(
  'summary/summarizeUrl',
  async (request: SummaryRequest, { rejectWithValue }) => {
    try {
      const result = await SummaryService.summarizeUrl(request);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to summarize URL');
    }
  }
);

// Summary state interface
interface SummaryState extends LoadingState {
  currentSummary: SummaryResponse | null;
  history: SummaryResponse[];
  lastUrl: string | null;
}

// Initial state
const initialState: SummaryState = {
  isLoading: false,
  error: null,
  currentSummary: null,
  history: [],
  lastUrl: null,
};

// Summary slice
const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSummary: (state) => {
      state.currentSummary = null;
      state.lastUrl = null;
    },
    addToHistory: (state, action) => {
      const summary = action.payload as SummaryResponse;
      // Avoid duplicates
      const exists = state.history.some((item) => item.originalUrl === summary.originalUrl);
      if (!exists) {
        state.history.unshift(summary);
        // Keep only last 10 items
        if (state.history.length > 10) {
          state.history = state.history.slice(0, 10);
        }
      }
    },
    removeFromHistory: (state, action) => {
      const url = action.payload as string;
      state.history = state.history.filter((item) => item.originalUrl !== url);
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(summarizeUrl.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.lastUrl = action.meta.arg.url;
      })
      .addCase(summarizeUrl.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.currentSummary = action.payload;

        // Add to history
        const exists = state.history.some(
          (item) => item.originalUrl === action.payload.originalUrl
        );
        if (!exists) {
          state.history.unshift(action.payload);
          if (state.history.length > 10) {
            state.history = state.history.slice(0, 10);
          }
        }
      })
      .addCase(summarizeUrl.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentSummary = null;
      });
  },
});

export const { clearError, clearCurrentSummary, addToHistory, removeFromHistory, clearHistory } =
  summarySlice.actions;

export default summarySlice.reducer;

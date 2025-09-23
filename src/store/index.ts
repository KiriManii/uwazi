import { configureStore } from '@reduxjs/toolkit';
import pollsReducer from './slices/pollsSlice';
import votingReducer from './slices/votingSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    polls: pollsReducer,
    voting: votingReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  showEmailModal: boolean;
  loading: boolean;
  notification: string | null;
}

const initialState: UIState = {
  showEmailModal: false,
  loading: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowEmailModal: (state, action: PayloadAction<boolean>) => {
      state.showEmailModal = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setNotification: (state, action: PayloadAction<string | null>) => {
      state.notification = action.payload;
    },
  },
});

export const { setShowEmailModal, setLoading, setNotification } = uiSlice.actions;
export default uiSlice.reducer;

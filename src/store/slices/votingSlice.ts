import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VotingState {
  votedPolls: string[];
  isVoting: boolean;
}

const initialState: VotingState = {
  votedPolls: [],
  isVoting: false,
};

const votingSlice = createSlice({
  name: 'voting',
  initialState,
  reducers: {
    addVotedPoll: (state, action: PayloadAction<string>) => {
      if (!state.votedPolls.includes(action.payload)) {
        state.votedPolls.push(action.payload);
      }
    },
    setVoting: (state, action: PayloadAction<boolean>) => {
      state.isVoting = action.payload;
    },
  },
});

export const { addVotedPoll, setVoting } = votingSlice.actions;
export default votingSlice.reducer;

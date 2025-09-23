import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import { Poll } from '@/types';

interface PollsState {
  polls: Poll[];
  currentPoll: Poll | null;
  loading: boolean;
  error: string | null;
}

const initialState: PollsState = {
  polls: [],
  currentPoll: null,
  loading: false,
  error: null,
};

export const fetchPolls = createAsyncThunk('polls/fetch', async () => {
  const { data, error } = await supabase
    .from('polls')
    .select('*, poll_options(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
});

export const createPoll = createAsyncThunk(
  'polls/create',
  async (pollData: { title: string; description: string; options: string[]; creatorEmail: string }) => {
    const { data: poll, error } = await supabase
      .from('polls')
      .insert({ 
        title: pollData.title, 
        description: pollData.description,
        creator_email: pollData.creatorEmail 
      })
      .select()
      .single();
    
    if (error) throw error;
    
    const options = pollData.options.map((text, index) => ({
      poll_id: poll.id,
      option_text: text,
      position: index,
      vote_count: 0
    }));
    
    await supabase.from('poll_options').insert(options);
    
    return poll;
  }
);

const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    updateVoteCount: (state, action: PayloadAction<{ pollId: string; optionId: string }>) => {
      const poll = state.polls.find(p => p.id === action.payload.pollId);
      if (poll) {
        const option = poll.options.find(o => o.id === action.payload.optionId);
        if (option) {
          option.vote_count += 1;
          poll.total_votes += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch polls';
      });
  },
});

export const { updateVoteCount } = pollsSlice.actions;
export default pollsSlice.reducer;

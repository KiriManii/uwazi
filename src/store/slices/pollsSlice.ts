import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import type { Poll, PollOption } from '@/types';

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

// Helper to normalize a single poll object returned by Supabase
function normalizePoll(raw: any): Poll {
  const rawOptions: any[] = raw?.poll_options ?? [];
  const options: PollOption[] = rawOptions.map((o: any) => ({
    id: String(o.id),
    poll_id: String(o.poll_id),
    option_text: o.option_text ?? '',
    vote_count: Number(o.vote_count ?? 0),
    position: Number(o.position ?? 0),
  }));

  return {
    id: String(raw.id),
    title: raw.title ?? '',
    description: raw.description ?? '',
    creator_email: raw.creator_email ?? undefined,
    created_at: raw.created_at ?? new Date().toISOString(),
    is_active: raw.is_active ?? true,
    total_votes: Number(raw.total_votes ?? options.reduce((s, opt) => s + opt.vote_count, 0)),
    options,
  };
}

export const fetchPolls = createAsyncThunk('polls/fetch', async () => {
  // Select polls with nested poll_options from Supabase
  const { data, error } = await supabase
    .from('polls')
    .select('*, poll_options(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Normalize each poll so frontend always sees `options: PollOption[]`
  return (data ?? []).map((p: any) => normalizePoll(p));
});

export const createPoll = createAsyncThunk(
  'polls/create',
  async (pollData: { title: string; description?: string; options: string[]; creatorEmail?: string }) => {
    const { data: poll, error } = await supabase
      .from('polls')
      .insert({
        title: pollData.title,
        description: pollData.description ?? null,
        creator_email: pollData.creatorEmail ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    const optionsToInsert = pollData.options.map((text, idx) => ({
      poll_id: poll.id,
      option_text: text,
      position: idx,
      vote_count: 0,
    }));

    await supabase.from('poll_options').insert(optionsToInsert);

    // Re-fetch the created poll with options (safe fresh shape)
    const { data: fresh, error: freshErr } = await supabase
      .from('polls')
      .select('*, poll_options(*)')
      .eq('id', poll.id)
      .single();

    if (freshErr) throw freshErr;

    return normalizePoll(fresh);
  }
);

const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    updateVoteCount: (state, action: PayloadAction<{ pollId: string; optionId: string }>) => {
      const { pollId, optionId } = action.payload;
      const poll = state.polls.find((p) => p.id === pollId);
      if (!poll) return;
      const option = poll.options.find((o) => o.id === optionId);
      if (option) {
        option.vote_count += 1;
        poll.total_votes += 1;
      }
    },
    setCurrentPoll: (state, action: PayloadAction<Poll | null>) => {
      state.currentPoll = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPolls.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPolls.fulfilled, (state, action) => {
      state.loading = false;
      state.polls = action.payload;
    });
    builder.addCase(fetchPolls.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? 'Failed to fetch polls';
    });
  },
});

export const { updateVoteCount, setCurrentPoll } = pollsSlice.actions;
export default pollsSlice.reducer;

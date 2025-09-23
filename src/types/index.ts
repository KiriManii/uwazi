export interface Poll {
  id: string;
  title: string;
  description?: string;
  creator_email?: string;
  created_at: string;
  is_active: boolean;
  total_votes: number;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
  position: number;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  ip_address: string;
  created_at: string;
}

export interface EmailSubscriber {
  email: string;
  source: 'poll_creation' | 'newsletter' | 'results';
}

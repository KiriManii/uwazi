import { z } from 'zod';

export const pollCreateSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().max(500).optional(),
  options: z.array(z.string().min(1)).min(2).max(6),
  creatorEmail: z.string().email(),
});

export const emailSchema = z.object({
  email: z.string().email(),
  source: z.enum(['poll_creation', 'newsletter', 'results']),
});

export const voteSchema = z.object({
  poll_id: z.string().uuid(),
  option_id: z.string().uuid(),
});

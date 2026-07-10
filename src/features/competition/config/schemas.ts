import { z } from 'zod';

export const competitionSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  deadline: z.string().min(1),
  link: z.string().min(1),
  type: z.enum(['international', 'national']),
  category: z.string().min(1),
});

export type CompetitionForm = z.infer<typeof competitionSchema>;

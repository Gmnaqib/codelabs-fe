import { z } from 'zod';

export const ristekSchema = z.object({
  title: z.string().min(1),
  week: z.enum(['Week 1', 'Week 2', 'Week 3', 'Week 4']),
  progress: z.enum(['Finished', 'Unfinished']),
  category: z.string().min(1),
  link: z
    .string()
    .min(1)
    .refine((v) => /^https:\/\/.+/i.test(v), {
      message: "Link harus diawali dengan 'https://'",
    }),
  challenge: z.string().min(1),
});

export type RistekForm = z.infer<typeof ristekSchema>;

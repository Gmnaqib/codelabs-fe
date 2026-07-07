import { z } from 'zod';

export const brandingSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  link: z.string().min(1),
  research: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

export type BrandingForm = z.infer<typeof brandingSchema>;

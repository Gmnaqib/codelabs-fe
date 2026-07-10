import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['active', 'inactive']),
});

export type ProductForm = z.infer<typeof productSchema>;

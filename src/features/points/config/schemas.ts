import { z } from 'zod';

export const kpiItemSchema = z.object({
  point: z.string().min(1).refine((v) => !isNaN(Number(v)), { message: 'Weight harus berupa angka' }),
});

export type KpiItemForm = z.infer<typeof kpiItemSchema>;

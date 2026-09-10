import { z } from 'zod';

export const spSettingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  point: z.string().min(1).refine((v) => !isNaN(Number(v)), { message: 'Point must be a number' }),
});

export type SPSettingForm = z.infer<typeof spSettingSchema>;

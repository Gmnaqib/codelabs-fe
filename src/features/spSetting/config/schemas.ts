import { z } from 'zod';

export const spSettingSchema = z.object({
  name: z.string().min(1, 'Name wajib diisi'),
  point: z.string().min(1).refine((v) => !isNaN(Number(v)), { message: 'Point harus berupa angka' }),
});

export type SPSettingForm = z.infer<typeof spSettingSchema>;

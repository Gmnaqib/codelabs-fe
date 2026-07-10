import { z } from 'zod';

export const timeSettingSchema = z.object({
  checkin: z.string().min(1),
  checkinlimit: z.string().min(1),
  checkinlatelimit: z.string().min(1),
  checkout: z.string().min(1),
  checkoutlate: z.string().min(1),
});

export type TimeSettingForm = z.infer<typeof timeSettingSchema>;

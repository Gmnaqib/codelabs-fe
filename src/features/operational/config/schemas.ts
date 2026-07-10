import { z } from 'zod';

export const operationalRecordSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['absence', 'picket', 'thematic']),
  date: z.string(),
  scheduleId: z.string().optional(),
});

export type OperationalRecordForm = z.infer<typeof operationalRecordSchema>;

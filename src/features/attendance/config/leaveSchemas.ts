import { z } from 'zod';

export const leaveRequestSchema = z.object({
  type: z.enum(['sick', 'permit']),
  reason: z.string().min(1, { message: 'Reason is required' }),
  startDate: z.string().min(1, { message: 'Leave date is required' }),
  endDate: z.string().optional(),
  attachment: z.instanceof(File, { message: 'Attachment is required' }),
});

export type LeaveRequestForm = z.infer<typeof leaveRequestSchema>;

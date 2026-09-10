import { z } from 'zod';

export const leaveRequestSchema = z.object({
  type: z.enum(['sick', 'permit']),
  reason: z.string().min(1, { message: 'Alasan wajib diisi' }),
  startDate: z.string().min(1, { message: 'Tanggal cuti wajib dipilih' }),
  endDate: z.string().optional(),
  attachment: z.instanceof(File, { message: 'Lampiran wajib diunggah' }),
});

export type LeaveRequestForm = z.infer<typeof leaveRequestSchema>;

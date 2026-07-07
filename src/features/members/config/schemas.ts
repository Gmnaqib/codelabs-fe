import { z } from 'zod';
import { USER_ROLES } from '@/shared/constants';

export const memberSchema = z.object({
  nim: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(USER_ROLES as unknown as [string, ...string[]]),
  subriset: z.string().min(1),
  status: z.enum(['active', 'inactive', 'suspended', 'resigned']),
});

export type MemberForm = z.infer<typeof memberSchema>;

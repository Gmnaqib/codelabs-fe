import { z } from 'zod';

export const profileSchema = z
  .object({
    newPassword: z.string().min(6, 'Password minimal 6 karakter!'),
    confirmPassword: z.string().min(6, 'Password minimal 6 karakter!'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password tidak sama!',
    path: ['confirmPassword'],
  });

export type ProfileForm = z.infer<typeof profileSchema>;

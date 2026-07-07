export { USER_ROLES } from '@/types/domain/user';
export type { UserRole } from '@/types/domain/user';
import type { UserRole } from '@/types/domain/user';

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  lecturer: 'Lecturer',
  president: 'President',
  'vice president': 'Vice President',
  user: 'User',
  'minister of research': 'Minister of Research',
  'minister of competition': 'Minister of Competition',
  'minister of branding': 'Minister of Branding',
  'minister of operation': 'Minister of Operation',
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 100,
  president: 90,
  'vice president': 80,
  'minister of operation': 70,
  'minister of research': 70,
  'minister of competition': 70,
  'minister of branding': 70,
  lecturer: 60,
  user: 10,
};

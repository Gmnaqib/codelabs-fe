import type { User } from '@/types/domain';

export function matchesSearch(user: User, query: string): boolean {
  const q = query.toLowerCase();
  return user.name.toLowerCase().includes(q) || user.nim.toLowerCase().includes(q);
}

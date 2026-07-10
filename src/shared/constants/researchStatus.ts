// Matches RESEARCH_STATUS_LABELS / statusResearch in the backend's
// research.interface.ts — a 0-5 review rating (null until reviewed), not an
// approval-workflow string. Shared by the Ristek (review) and Report (my
// submissions) features, both of which render Research records.
export const RESEARCH_STATUS_LABELS: Record<number, string> = {
  0: 'Not Suitable',
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export function getResearchStatusDisplay(status?: number | null): { label: string; className: string } {
  if (status === null || status === undefined) {
    return { label: 'Not Reviewed', className: 'bg-gray-100 text-gray-700' };
  }
  const label = RESEARCH_STATUS_LABELS[status] ?? String(status);
  if (status <= 1) return { label, className: 'bg-red-100 text-red-700' };
  if (status <= 3) return { label, className: 'bg-yellow-100 text-yellow-700' };
  return { label, className: 'bg-green-100 text-green-700' };
}

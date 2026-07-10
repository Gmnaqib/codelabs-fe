// Branding.status is a 0-5 review rating (null until reviewed), same scheme as
// Research. The table badge simplifies it to Approved/Pending/Rejected: 0 =
// Rejected, 1-5 = Approved, null/unreviewed = Pending. Shared by the standalone
// Branding page and the Scoring page's Branding tab, both of which render
// Branding records.
export function getBrandingStatusDisplay(status?: number | string | null): { label: string; className: string } {
  if (status === null || status === undefined || status === '') {
    return { label: 'PENDING', className: 'bg-yellow-100 text-yellow-700' };
  }
  const num = Number(status);
  if (!isNaN(num)) {
    if (num === 0) return { label: 'REJECTED', className: 'bg-red-100 text-red-700' };
    if (num >= 1 && num <= 5) return { label: 'APPROVED', className: 'bg-green-100 text-green-700' };
  }
  return { label: 'PENDING', className: 'bg-yellow-100 text-yellow-700' };
}

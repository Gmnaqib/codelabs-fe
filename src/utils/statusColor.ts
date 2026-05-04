export function getStatusColor(status: string): string {
  if (!status) return "bg-gray-100 text-gray-700";
  switch (status.toUpperCase()) {
    case "APPROVED":
      return "bg-green-100 text-green-700 text-center rounded-full";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 text-center rounded-full";
    case "REJECTED":
      return "bg-red-100 text-red-700 text-center rounded-full";
    default:
      return "bg-gray-100 text-gray-700 text-center rounded-full";
  }
}

export const operasional: Record<string, string[]> = {
  Absensce: ["NIM", "Nama"],
  Thematic: ["NIM", "Nama"],
  Picket: ["NIM", "Nama"],
}

export const report: Record<string, string[]> = {
  report: ["Research Plan", "Week", "Progress", "Status", "Action"]
}

export const attendance: Record<string, string[]> = {
  Permissions: ["Name", "Status", "Date", "Reviewed", "Permission", "Detail"],
  TotalAttendance: ["Name", "Present", "Permit", "Sick", "Late Arrivals", "No Report", "SP", "Action"]
}

export const scoring: Record<string, string[]> = {
  research: ["Ristek & Education Point", "Total", "Point"],
  competition: ["Competition Name", "Status	", "Point", "Action"],
  operational: ["Type of Absence	", "Type of Absence	", "Point"],
  branding: ["Content Name", "Type", "Status", "Point", "Action"]
}

export const organization: Record<string, string[]> = {
  Attendance: ["No", "Name", "Attendance", "Thematic", "Picket", "Points"],
  ResearchPoints: ["No", "Name", "Unfinished", "Finished", "Approved", "Points"],
};

export const members: Record<string, string[]> = {
  members: ["NIM", "Name", "Email", "Sub Riset", "Product", "Role", "Device Id", "Status"],
};

export const competition: Record<string, string[]> = {
  competition: ["Name", "Label", "Action"],
};

export const branding: Record<string, string[]> = {
  branding: ["Name", "Label", "Action"],
};

export const ristek: Record<string, string[]> = {
  ristek: ["Name", "Label", "Action"],
};

export const picketschedule: Record<string, string[]> = {
  picketschedule: ["Name", "Status", "Swap"],
};

export const assessments: Record<string, string[]> = {
  assessments: ["Rank","Name", "Monthly Points", "Status", "Action"],
};

export const products: Record<string, string[]> = {
  products: ["Product","Action"],
};
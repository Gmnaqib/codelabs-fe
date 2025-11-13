export const operasional: Record<string, string[]> = {
  Absensi: ["NIM", "Nama"],
  Tematik: ["NIM", "Nama"],
  Piket: ["NIM", "Nama"],
}

export const report: Record<string, string[]> = {
  report: ["Research Plan", "Week", "Progress", "Action"]
}

export const attendance: Record<string, string[]> = {
  Permissions: ["Nama", "Status", "Date", "Reviewed", "Permission", "Detail"],
  TotalAttendance: ["Nama", "Present", "Permit", "Sick", "Late Arrivals", "No Report", "Permisson", "Action"]
}

export const scoring: Record<string, string[]> = {
  research: ["Ristek & Education Point", "Total", "Point"],
  competition: ["Competition Name", "Status	", "Point", "Action"],
  operational: ["Type of Absence	", "Type of Absence	", "Point"],
  branding: ["Content Name", "Type", "Status", "Point", "Action"]
}

export const organization: Record<string, string[]> = {
  Attendance: ["No", "Name", "Attendance", "Thematic", "Picket", "Points"],
  ResearchPoints: ["No", "Name", "Unfinished", "Finished", "Approved", "Total", "Points"],
};

export const assessments: Record<string, string[]> = {
  assessments: ["Rank", "Name", "Monthly", "Status", "Action"],
};
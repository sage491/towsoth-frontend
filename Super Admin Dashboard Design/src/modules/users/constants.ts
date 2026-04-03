import type { UserData } from "./types";

export const USERS_MOCK_DATA: UserData[] = [
  { id: 1, name: "Dr. Sarah Chen", email: "s.chen@stanford.edu", institution: "Stanford University", role: "Faculty", status: "active", lastLogin: "2 hours ago", activityLevel: "high", createdDate: "2024-01-15" },
  { id: 2, name: "Michael Torres", email: "m.torres@harvard.edu", institution: "Harvard University", role: "Student", status: "active", lastLogin: "5 hours ago", activityLevel: "high", createdDate: "2024-02-20" },
  { id: 3, name: "Emily Williams", email: "e.williams@mit.edu", institution: "MIT", role: "Admin", status: "active", lastLogin: "1 day ago", activityLevel: "medium", createdDate: "2024-01-10" },
  { id: 4, name: "James Anderson", email: "j.anderson@stanford.edu", institution: "Stanford University", role: "Student", status: "active", lastLogin: "3 hours ago", activityLevel: "high", createdDate: "2024-03-05" },
  { id: 5, name: "Lisa Martinez", email: "l.martinez@uchicago.edu", institution: "University of Chicago", role: "Faculty", status: "suspended", lastLogin: "5 days ago", activityLevel: "low", createdDate: "2024-01-25" },
  { id: 6, name: "David Kim", email: "d.kim@harvard.edu", institution: "Harvard University", role: "Staff", status: "active", lastLogin: "12 hours ago", activityLevel: "medium", createdDate: "2024-02-15" },
  { id: 7, name: "Rachel Brown", email: "r.brown@mit.edu", institution: "MIT", role: "Student", status: "inactive", lastLogin: "15 days ago", activityLevel: "low", createdDate: "2024-04-01" },
  { id: 8, name: "Kevin Zhang", email: "k.zhang@berkeley.edu", institution: "UC Berkeley", role: "Faculty", status: "active", lastLogin: "30 minutes ago", activityLevel: "high", createdDate: "2024-01-08" },
];

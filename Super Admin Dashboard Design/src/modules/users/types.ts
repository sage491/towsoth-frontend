export type UserStatus = "active" | "inactive" | "suspended";

export type UserActivityLevel = "high" | "medium" | "low";

export interface UserData {
  id: number;
  name: string;
  email: string;
  institution: string;
  role: string;
  status: UserStatus;
  lastLogin: string;
  activityLevel: UserActivityLevel;
  createdDate: string;
}

export interface UsersFilters {
  searchTerm: string;
  statusFilter: "all" | UserStatus;
  roleFilter: "all" | string;
}

export interface UsersStats {
  total: number;
  active: number;
  suspended: number;
  inactive: number;
}

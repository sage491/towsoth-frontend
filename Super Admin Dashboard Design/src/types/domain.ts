export type InstitutionStatus = "active" | "suspended" | "archived";

export interface InstitutionBranding {
  displayName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
}

export interface Institution {
  id: number;
  name: string;
  type: string;
  country: string;
  timezone?: string;
  academicSession?: string;
  branding?: InstitutionBranding;
  plan: string;
  featuresEnabled: string[];
  activeUsers: number;
  storageUsage: number;
  status: InstitutionStatus;
  createdDate: string;
  lastModified: string;
  modifiedBy: string;
  adminEmail?: string;
  autoStructureEnabled?: boolean;
}

export interface NewInstitutionData {
  name: string;
  type: "school" | "college" | "university";
  country: string;
  timezone: string;
  academicSession: string;
  branding?: InstitutionBranding;
  planId: number;
  featuresEnabled: string[];
  autoStructureEnabled: boolean;
  adminName: string;
  adminEmail: string;
}

export type UserStatus = "active" | "inactive" | "suspended";

export type UserActivityLevel = "high" | "medium" | "low";

export interface User {
  id: number;
  name: string;
  email: string;
  institution: string;
  institutionId: number;
  role: string;
  status: UserStatus;
  lastLogin: string;
  activityLevel: UserActivityLevel;
  createdDate: string;
}

export interface Plan {
  id: number;
  name: string;
  tier: "starter" | "pro" | "enterprise";
  price: number;
  userLimit: number;
  storageLimit: number;
  features: string[];
  status: "active" | "deprecated";
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: "success" | "warning" | "error";
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export type AppEnvironment = "production" | "staging";

export type SecurityEventType = "login_failure" | "suspicious_ip" | "role_escalation" | "session_anomaly" | "password_reset";
export type SecuritySeverity = "low" | "medium" | "high" | "critical";
export type SecurityEventStatus = "resolved" | "investigating" | "blocked";

export interface SecurityEvent {
  id: number;
  timestamp: string;
  type: SecurityEventType;
  user: string;
  institution: string;
  ipAddress: string;
  location: string;
  severity: SecuritySeverity;
  status: SecurityEventStatus;
}

export interface ActiveSession {
  id: number;
  user: string;
  institution: string;
  ipAddress: string;
  location: string;
  device: string;
  startTime: string;
  lastActivity: string;
}

export type SecurityTabId = "events" | "sessions" | "policies" | "monitoring";

export interface SecurityTab {
  id: SecurityTabId;
  label: string;
}

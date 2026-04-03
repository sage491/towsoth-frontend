import type { ActiveSession, SecurityEvent, SecurityTab } from "../types";

export const SECURITY_EVENTS: SecurityEvent[] = [
  { id: 1, timestamp: "2025-12-29 15:45:20", type: "login_failure", user: "j.smith@stanford.edu", institution: "Stanford University", ipAddress: "45.67.89.123", location: "Unknown (VPN)", severity: "high", status: "blocked" },
  { id: 2, timestamp: "2025-12-29 15:32:15", type: "suspicious_ip", user: "admin@harvard.edu", institution: "Harvard University", ipAddress: "203.45.12.89", location: "Beijing, China", severity: "critical", status: "investigating" },
  { id: 3, timestamp: "2025-12-29 15:18:42", type: "password_reset", user: "student@mit.edu", institution: "MIT", ipAddress: "192.168.1.45", location: "Cambridge, MA", severity: "low", status: "resolved" },
  { id: 4, timestamp: "2025-12-29 14:55:33", type: "role_escalation", user: "faculty@berkeley.edu", institution: "UC Berkeley", ipAddress: "172.16.0.88", location: "Berkeley, CA", severity: "medium", status: "resolved" },
  { id: 5, timestamp: "2025-12-29 14:42:18", type: "session_anomaly", user: "staff@uchicago.edu", institution: "University of Chicago", ipAddress: "10.0.0.45", location: "Chicago, IL", severity: "medium", status: "investigating" },
  { id: 6, timestamp: "2025-12-29 14:28:05", type: "login_failure", user: "test@yale.edu", institution: "Yale University", ipAddress: "123.45.67.89", location: "New Haven, CT", severity: "low", status: "resolved" },
];

export const ACTIVE_SESSIONS: ActiveSession[] = [
  { id: 1, user: "admin@platform.com", institution: "Platform Admin", ipAddress: "192.168.1.1", location: "San Francisco, CA", device: "Chrome on macOS", startTime: "09:30 AM", lastActivity: "1 min ago" },
  { id: 2, user: "s.chen@stanford.edu", institution: "Stanford University", ipAddress: "171.64.12.45", location: "Stanford, CA", device: "Safari on iOS", startTime: "10:15 AM", lastActivity: "3 min ago" },
  { id: 3, user: "m.torres@harvard.edu", institution: "Harvard University", ipAddress: "140.247.8.92", location: "Cambridge, MA", device: "Firefox on Windows", startTime: "11:22 AM", lastActivity: "5 min ago" },
  { id: 4, user: "e.williams@mit.edu", institution: "MIT", ipAddress: "18.9.22.163", location: "Cambridge, MA", device: "Chrome on Windows", startTime: "08:45 AM", lastActivity: "2 min ago" },
];

export const SECURITY_TABS: SecurityTab[] = [
  { id: "events", label: "Security Events" },
  { id: "sessions", label: "Active Sessions" },
  { id: "policies", label: "Security Policies" },
  { id: "monitoring", label: "Threat Monitoring" },
];

export function filterSecurityEvents(events: SecurityEvent[], searchTerm: string, severityFilter: string): SecurityEvent[] {
  const normalized = searchTerm.toLowerCase();

  return events.filter((event) => {
    const matchesSearch =
      event.user.toLowerCase().includes(normalized) ||
      event.ipAddress.includes(searchTerm) ||
      event.institution.toLowerCase().includes(normalized);

    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });
}

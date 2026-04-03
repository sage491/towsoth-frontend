import { useMemo, useState } from "react";
import { ACTIVE_SESSIONS, SECURITY_EVENTS, SECURITY_TABS, filterSecurityEvents } from "../services/securityService";
import type { SecurityTabId } from "../types";

export function useSecurity() {
  const [activeTab, setActiveTab] = useState<SecurityTabId>("events");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredEvents = useMemo(() => {
    return filterSecurityEvents(SECURITY_EVENTS, searchTerm, severityFilter);
  }, [searchTerm, severityFilter]);

  const stats = useMemo(() => {
    return {
      totalEvents: SECURITY_EVENTS.length,
      critical: SECURITY_EVENTS.filter((event) => event.severity === "critical").length,
      blocked: SECURITY_EVENTS.filter((event) => event.status === "blocked").length,
      activeSessions: ACTIVE_SESSIONS.length,
    };
  }, []);

  return {
    tabs: SECURITY_TABS,
    events: SECURITY_EVENTS,
    filteredEvents,
    activeSessions: ACTIVE_SESSIONS,
    stats,
    activeTab,
    searchTerm,
    severityFilter,
    setActiveTab,
    setSearchTerm,
    setSeverityFilter,
  };
}

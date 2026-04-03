import {
  AlertOctagon,
  BarChart3,
  Brain,
  Building2,
  CreditCard,
  Database,
  FileText,
  Layers,
  LayoutDashboard,
  Lock,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AppSectionId } from "../types/navigation";

export interface NavigationItem {
  id: AppSectionId;
  label: string;
  icon: LucideIcon;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "institutions", label: "Institutions", icon: Building2 },
  { id: "plans", label: "Plans & Features", icon: Layers },
  { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
  { id: "users", label: "Users", icon: Users },
  { id: "ai-control", label: "AI Control Center", icon: Brain },
  { id: "compliance", label: "Data & Compliance", icon: Database },
  { id: "billing", label: "Billing & Monetization", icon: CreditCard },
  { id: "security", label: "Security Center", icon: Lock },
  { id: "analytics", label: "Analytics & Intelligence", icon: BarChart3 },
  { id: "config", label: "System Configuration", icon: Settings },
  { id: "governance", label: "Governance & Policies", icon: FileText },
  { id: "logs", label: "System Logs", icon: ScrollText },
  { id: "emergency", label: "Emergency Controls", icon: AlertOctagon },
];

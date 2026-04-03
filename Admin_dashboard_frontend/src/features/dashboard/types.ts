import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { StatusBadgeTone } from '../../components/ui/StatusBadge';

export interface DashboardActionItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: StatusBadgeTone;
  ctaLabel: string;
  target: string;
  count?: number;
  urgent?: boolean;
}

export interface DashboardStatItem {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  target: string;
}

export interface DashboardActivityItem {
  id: string;
  action: string;
  user: string;
  time: string;
  category: string;
  status: StatusBadgeTone;
}

export interface DashboardFilterOption {
  label: string;
  value: string;
}

export interface DashboardViewData {
  title: string;
  subtitle: string;
  actionCards: DashboardActionItem[];
  statCards: DashboardStatItem[];
  activityItems: DashboardActivityItem[];
  activityFilterOptions: DashboardFilterOption[];
}

export interface DashboardPageProps {
  data: DashboardViewData;
  loading?: boolean;
  showHelpBanner?: boolean;
  showActionCards?: boolean;
  showStats?: boolean;
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  showOnboardingChecklist?: boolean;
  showDataImport?: boolean;
  onboardingChecklistSlot?: ReactNode;
  dataImportSlot?: ReactNode;
  onNavigate?: (target: string) => void;
}

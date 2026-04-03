import type { RoutePath } from '@/shared/config/routes';

export type DashboardMessage = {
  id: number;
  type: 'deadline' | 'update' | 'achievement';
  title: string;
  description: string;
  time?: string;
  action: string;
  page: RoutePath;
};

export type DashboardWorkspace = {
  id: RoutePath;
  title: string;
  subtitle: string;
  icon: string;
  stats: { label: string; value: string }[];
  nextAction: string;
  locked: boolean;
};

export type DashboardWorkspaceOptions = {
  showRank: boolean;
  focusMode: boolean;
};

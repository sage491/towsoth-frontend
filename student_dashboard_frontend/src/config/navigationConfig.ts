import type { RoutePath } from '../shared/config/routes';

type NavigationItem = {
  icon: 'LayoutGrid' | 'BarChart3' | 'Trophy' | 'Brain' | 'BookOpen' | 'ClipboardCheck' | 'Target' | 'Globe2' | 'Settings';
  label: string;
  id: RoutePath;
  essential: boolean;
};

type NavigationConfig = {
  student: NavigationItem[];
};

export const navigationConfig: NavigationConfig = {
  student: [
    { icon: 'LayoutGrid', label: 'Dashboard', id: 'dashboard', essential: true },
    { icon: 'BarChart3', label: 'Analytics', id: 'analytics', essential: true },
    { icon: 'Trophy', label: 'Leaderboard', id: 'leaderboard', essential: false },
    { icon: 'Brain', label: 'Learning Hub', id: 'learning-hub', essential: true },
    { icon: 'BookOpen', label: 'My Subjects', id: 'my-subjects', essential: true },
    { icon: 'ClipboardCheck', label: 'Tests & Guidelines', id: 'tests-guidelines', essential: true },
    { icon: 'Target', label: 'Plan My Journey', id: 'plan-journey', essential: true },
    { icon: 'Globe2', label: 'Towsoth Global', id: 'towsoth-global', essential: false },
    { icon: 'Settings', label: 'Settings', id: 'settings', essential: true },
  ],
};

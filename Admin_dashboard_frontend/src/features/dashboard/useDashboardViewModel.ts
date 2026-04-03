import { useMemo, useState } from 'react';
import type {
  DashboardActionItem,
  DashboardActivityItem,
  DashboardFilterOption,
} from './types';

interface UseDashboardViewModelParams {
  actionCards: DashboardActionItem[];
  activityItems: DashboardActivityItem[];
  activityFilterOptions: DashboardFilterOption[];
  onNavigate?: (target: string) => void;
}

const routeToPageMap: Record<string, string> = {
  '/': 'dashboard',
  '/students': 'student-management',
  '/faculty': 'faculty',
  '/staff': 'staff-management',
  '/attendance': 'attendance',
  '/batches': 'batches',
  '/analytics': 'analytics',
  '/notifications': 'dashboard',
  '/activity': 'dashboard',
};

const resolveNavigationTarget = (target: string): string => {
  if (!target.startsWith('/')) {
    return target;
  }

  const [path] = target.split('?');
  return routeToPageMap[path] ?? 'dashboard';
};

export function useDashboardViewModel({
  actionCards,
  activityItems,
  activityFilterOptions,
  onNavigate,
}: UseDashboardViewModelParams) {
  const [dismissedActionIds, setDismissedActionIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(activityFilterOptions[0]?.value ?? 'all');

  const visibleActionCards = useMemo(
    () => actionCards.filter((card) => !dismissedActionIds.includes(card.id)),
    [actionCards, dismissedActionIds],
  );

  const filteredActivityItems = useMemo(() => {
    return activityItems.filter((item) => {
      const matchesCategory = selectedFilter === 'all' || item.category === selectedFilter;
      const normalizedSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.action.toLowerCase().includes(normalizedSearch) ||
        item.user.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activityItems, searchQuery, selectedFilter]);

  const dismissActionCard = (cardId: string) => {
    setDismissedActionIds((previous) => [...previous, cardId]);
  };

  const navigateTo = (target: string) => {
    if (!onNavigate) {
      return;
    }

    onNavigate(resolveNavigationTarget(target));
  };

  return {
    visibleActionCards,
    filteredActivityItems,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    dismissActionCard,
    navigateTo,
  };
}

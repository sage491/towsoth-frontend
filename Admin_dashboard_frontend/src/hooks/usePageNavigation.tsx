import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { renderPageByKey } from '../services/navigation/pageRegistry';
import type { NavigateToPage, PageKey } from '../types/navigation';

interface UsePageNavigationResult {
  activePage: PageKey;
  navigateToPage: NavigateToPage;
  activePageContent: ReactNode;
}

export const usePageNavigation = (initialPage: PageKey = 'dashboard'): UsePageNavigationResult => {
  const [activePage, setActivePage] = useState<PageKey>(initialPage);

  const activePageContent = useMemo(
    () => renderPageByKey(activePage, setActivePage),
    [activePage],
  );

  return {
    activePage,
    navigateToPage: setActivePage,
    activePageContent,
  };
};

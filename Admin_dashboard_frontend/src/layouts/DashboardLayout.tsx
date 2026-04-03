import type { PropsWithChildren } from 'react';
import { AdminLayout } from '../components/layout';
import type { PageKey } from '../types/navigation';

interface DashboardLayoutProps extends PropsWithChildren {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export function DashboardLayout({ children, activePage, onNavigate }: DashboardLayoutProps) {
  return (
    <AdminLayout activePage={activePage} onNavigate={onNavigate}>
      {children}
    </AdminLayout>
  );
}

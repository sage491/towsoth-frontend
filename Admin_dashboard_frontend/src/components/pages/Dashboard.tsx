import { DashboardPage } from '../../features/dashboard/DashboardPage';
import { useDashboardData } from '../../features/dashboard/useDashboardData';
import { useAdminModeEngine } from '../../contexts/AdminModeEngine';
import { DataImportCard } from '../import/DataImportCard';
import { OnboardingChecklist } from '../admin/OnboardingChecklist';
import { SystemHealthMonitor } from '../admin/SystemHealthMonitor';
import { InstitutionBadge } from '../branding/InstitutionBadge';

export function Dashboard() {
  const { isDashboardWidgetVisible, state } = useAdminModeEngine();
  const dashboardData = useDashboardData();

  const topContent = (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <SystemHealthMonitor />
      </div>
      <aside>
        <InstitutionBadge variant="detailed" showLicense />
      </aside>
    </div>
  );

  return (
    <DashboardPage
      data={{
        ...dashboardData,
        title: 'Institution Dashboard',
        subtitle: `Overview of institutional health and operations • Mode: ${state.currentMode}`,
      }}
      showHelpBanner={state.behavior.showHelpBanners}
      showActionCards={isDashboardWidgetVisible('pendingApprovals') || isDashboardWidgetVisible('atRiskStudents')}
      showStats={isDashboardWidgetVisible('totalStudents')}
      showOnboardingChecklist={isDashboardWidgetVisible('setupChecklist')}
      showDataImport={isDashboardWidgetVisible('dataImport')}
      onboardingChecklistSlot={<OnboardingChecklist />}
      dataImportSlot={<DataImportCard />}
      topContent={topContent}
    />
  );
}

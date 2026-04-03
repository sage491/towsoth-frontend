import { DashboardPage } from '../../features/dashboard/DashboardPage';
import { useDashboardData } from '../../features/dashboard/useDashboardData';
import { useAdminModeEngine } from '../../contexts/AdminModeEngine';
import { OnboardingChecklist } from '../admin/OnboardingChecklist';
import { DataImportCard } from '../import/DataImportCard';

interface SmartDashboardProps {
  onNavigate?: (page: string) => void;
}

export function SmartDashboard({ onNavigate }: SmartDashboardProps) {
  const { isDashboardWidgetVisible, state } = useAdminModeEngine();
  const dashboardData = useDashboardData();

  return (
    <DashboardPage
      data={dashboardData}
      showHelpBanner={state.behavior.showHelpBanners}
      showActionCards={isDashboardWidgetVisible('pendingApprovals') || isDashboardWidgetVisible('atRiskStudents')}
      showStats={isDashboardWidgetVisible('totalStudents')}
      showOnboardingChecklist={isDashboardWidgetVisible('setupChecklist')}
      showDataImport={isDashboardWidgetVisible('dataImport')}
      onboardingChecklistSlot={<OnboardingChecklist />}
      dataImportSlot={<DataImportCard />}
      onNavigate={onNavigate}
    />
  );
}
import { ArrowRight, CheckCircle, History } from 'lucide-react';
import { DataTable, type DataTableColumn } from '../../components/shared/DataTable';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { ActionDropdown } from '../../components/ui/ActionDropdown';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { WorkspaceBreadcrumb } from '../../components/navigation/WorkspaceSelector';
import { useDashboardViewModel } from './useDashboardViewModel';
import type { DashboardActivityItem, DashboardPageProps } from './types';

const activityColumns: DataTableColumn<DashboardActivityItem>[] = [
  {
    key: 'activity',
    header: 'Activity',
    renderCell: (row) => (
      <div>
        <p className="text-[12px] sm:text-[13px] text-[#374151]">{row.action}</p>
        <p className="mt-0.5 text-[10px] sm:text-[11px] text-[#6b7280]">by {row.user}</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    renderCell: (row) => <StatusBadge label={row.category} tone={row.status} />,
  },
  {
    key: 'time',
    header: 'Time',
    className: 'whitespace-nowrap',
    renderCell: (row) => <span className="text-[10px] sm:text-[11px] text-[#9ca3af]">{row.time}</span>,
  },
  {
    key: 'actions',
    header: '',
    className: 'w-[52px] text-right',
    renderCell: () => (
      <ActionDropdown
        items={[
          { key: 'open', label: 'Open details' },
          { key: 'archive', label: 'Archive' },
        ]}
        onSelect={() => {
          // Action handlers can be injected when wiring to backend workflows.
        }}
      />
    ),
  },
];

export function DashboardPage({
  data,
  loading = false,
  showHelpBanner = false,
  showActionCards = true,
  showStats = true,
  topContent,
  bottomContent,
  showOnboardingChecklist = false,
  showDataImport = false,
  onboardingChecklistSlot,
  dataImportSlot,
  onNavigate,
}: DashboardPageProps) {
  const {
    visibleActionCards,
    filteredActivityItems,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    dismissActionCard,
    navigateTo,
  } = useDashboardViewModel({
    actionCards: data.actionCards,
    activityItems: data.activityItems,
    activityFilterOptions: data.activityFilterOptions,
    onNavigate,
  });

  return (
    <main className="p-4 sm:p-6">
      <WorkspaceBreadcrumb />

      <PageHeader
        title={data.title}
        subtitle={data.subtitle}
        className="mb-6"
      />

      {showHelpBanner ? (
        <section className="mb-6 border border-[#93c5fd] bg-[#dbeafe] p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3b82f6]" />
            <div className="flex-1">
              <h2 className="mb-1 text-[13px] text-[#111827]">Welcome to Your Dashboard</h2>
              <p className="text-[12px] text-[#374151]">
                This is your control center. Use search and filters to quickly find operational updates.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {showOnboardingChecklist && onboardingChecklistSlot ? <section className="mb-6">{onboardingChecklistSlot}</section> : null}
      {showDataImport && dataImportSlot ? <section className="mb-6">{dataImportSlot}</section> : null}
      {topContent ? <section className="mb-6">{topContent}</section> : null}

      {loading ? (
        <LoadingSkeleton rows={4} className="mb-6" />
      ) : (
        <>
          {showActionCards ? (
            <section className="mb-6" aria-labelledby="needs-attention-heading">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="needs-attention-heading" className="text-[14px] font-medium text-[#111827] sm:text-[15px]">
                  Needs Attention
                </h2>
                <button
                  type="button"
                  onClick={() => navigateTo('/notifications')}
                  className="flex items-center gap-1 text-[12px] text-[#3b82f6] hover:underline"
                >
                  View All
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {visibleActionCards.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {visibleActionCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <article key={card.id} className="border border-[#e5e7eb] border-l-4 bg-white p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center bg-[#f9fafb]">
                              <Icon className="h-5 w-5 text-[#6b7280]" />
                            </div>
                            <div>
                              <h3 className="text-[13px] font-medium text-[#111827] sm:text-[14px]">{card.title}</h3>
                              <p className="mt-0.5 text-[11px] text-[#6b7280] sm:text-[12px]">{card.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {typeof card.count === 'number' ? (
                              <StatusBadge label={String(card.count)} tone={card.tone} />
                            ) : null}
                            {card.urgent ? <StatusBadge label="URGENT" tone="danger" /> : null}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => navigateTo(card.target)}
                            className="flex items-center gap-2 border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2 text-[12px] text-[#374151] transition-colors hover:bg-[#f3f4f6]"
                          >
                            {card.ctaLabel}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => dismissActionCard(card.id)}
                            className="text-[11px] text-[#9ca3af] hover:text-[#6b7280]"
                          >
                            Dismiss
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No pending actions"
                  description="Everything in your queue has been resolved."
                />
              )}
            </section>
          ) : null}

          {showStats ? (
            <section className="mb-6" aria-labelledby="quick-overview-heading">
              <h2 id="quick-overview-heading" className="mb-4 text-[14px] font-medium text-[#111827] sm:text-[15px]">
                Quick Overview
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {data.statCards.map((stat) => (
                  <StatCard
                    key={stat.id}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    onClick={() => navigateTo(stat.target)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="border border-[#e5e7eb] bg-white p-4 sm:p-5" aria-labelledby="recent-activity-heading">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-[#374151]" />
                <h2 id="recent-activity-heading" className="text-[14px] font-medium text-[#111827] sm:text-[15px]">
                  Recent Activity
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('/activity')}
                className="text-[12px] text-[#3b82f6] hover:underline"
              >
                View All
              </button>
            </div>

            <DataTable
              caption="Recent administrative activity"
              columns={activityColumns}
              rows={filteredActivityItems}
              getRowKey={(row) => row.id}
              emptyState={
                <EmptyState
                  title="No activity found"
                  description="Try another search query or filter." 
                  icon={<History className="h-6 w-6" />}
                />
              }
            />
          </section>

          {bottomContent ? <section className="mb-6">{bottomContent}</section> : null}
        </>
      )}
    </main>
  );
}

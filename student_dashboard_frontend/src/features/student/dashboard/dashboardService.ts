import { DashboardMessage, DashboardWorkspace, DashboardWorkspaceOptions } from './types';

type DashboardDataSource = {
  messages: DashboardMessage[];
  workspaceTemplates: DashboardWorkspace[];
};

const createDefaultDashboardDataSource = (): DashboardDataSource => ({
  messages: [
    {
      id: 1,
      type: 'deadline',
      title: 'JEE Main Mock Test 3 - Tomorrow',
      description: 'Complete full syllabus test • 3 hours • Counts toward final rank',
      time: '11:00 AM - 2:00 PM',
      action: 'View Details',
      page: 'tests-guidelines'
    },
    {
      id: 2,
      type: 'update',
      title: 'New Chemistry PYQs Added',
      description: '2024 papers now available • Organic Chemistry focus',
      action: 'Practice Now',
      page: 'my-subjects'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Weekly Target: 85% Complete',
      description: '34/40 hours logged • Maintain momentum to hit goal',
      action: 'View Progress',
      page: 'tests-guidelines'
    },
    {
      id: 4,
      type: 'update',
      title: 'System Maintenance Scheduled',
      description: 'Platform will be down for 30 minutes on Feb 3, 2:00-2:30 AM',
      action: 'Learn More',
      page: 'learning-hub'
    }
  ],
  workspaceTemplates: [
    {
      id: 'my-subjects',
      title: 'My Subjects',
      subtitle: 'Learning Workspace',
      icon: 'BookOpen',
      stats: [
        { label: 'Active Topics', value: '12' },
        { label: 'Completion', value: '67%' },
        { label: 'Weak Areas', value: '3' },
      ],
      nextAction: 'Continue EM Induction Practice',
      locked: false,
    },
    {
      id: 'tests-guidelines',
      title: 'Tests & Guidelines',
      subtitle: 'Assessment & Discipline',
      icon: 'ClipboardCheck',
      stats: [
        { label: 'Upcoming', value: '2 tests' },
        { label: 'Last Score', value: '85%' },
        { label: 'PYQs Solved', value: '24' },
      ],
      nextAction: 'Physics Mock Test in 2 days',
      locked: false,
    },
    {
      id: 'plan-journey',
      title: 'Plan My Journey',
      subtitle: 'Growth & Strategy',
      icon: 'Target',
      stats: [
        { label: 'Tasks Today', value: '5/8' },
        { label: 'On Track', value: 'Yes' },
        { label: 'Target Rank', value: '__RANK_TARGET__' },
      ],
      nextAction: 'Review today\'s tasks',
      locked: false,
    },
    {
      id: 'towsoth-global',
      title: 'Towsoth Global',
      subtitle: 'Competition & Exposure',
      icon: 'Globe2',
      stats: [
        { label: 'Your Rank', value: '__GLOBAL_RANK__' },
        { label: 'Active', value: '3 challenges' },
        { label: 'Percentile', value: '__GLOBAL_PERCENTILE__' },
      ],
      nextAction: 'View leaderboard updates',
      locked: false,
    },
  ],
});

let dashboardDataSource = createDefaultDashboardDataSource();

export function configureDashboardDataSource(patch: Partial<DashboardDataSource>) {
  dashboardDataSource = {
    ...dashboardDataSource,
    ...patch,
  };
}

export function resetDashboardDataSource() {
  dashboardDataSource = createDefaultDashboardDataSource();
}

export function getDashboardMessages() {
  return dashboardDataSource.messages.map((item) => ({ ...item }));
}

export function getDashboardWorkspaces({ showRank, focusMode }: DashboardWorkspaceOptions) {
  return dashboardDataSource.workspaceTemplates.map((workspace) => {
    const resolvedStats = workspace.stats.map((stat) => {
      if (stat.value === '__RANK_TARGET__') {
        return { ...stat, value: showRank ? 'AIR 150' : '—' };
      }

      if (stat.value === '__GLOBAL_RANK__') {
        return { ...stat, value: showRank ? '#847' : 'Hidden' };
      }

      if (stat.value === '__GLOBAL_PERCENTILE__') {
        return { ...stat, value: showRank ? '92%' : '—' };
      }

      return { ...stat };
    });

    const resolvedLocked = workspace.id === 'towsoth-global' ? focusMode : workspace.locked;

    return {
      ...workspace,
      stats: resolvedStats,
      locked: resolvedLocked,
    };
  });
}

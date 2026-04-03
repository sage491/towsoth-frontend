import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { logger } from '../utils/logger';
import { safeJsonParse, safeJsonStringify } from '../utils/storageUtils';

export type AdminMode = 'onboarding' | 'operational' | 'analytical' | 'power';

// Sidebar Module Configuration per Mode
export interface SidebarModuleVisibility {
  dashboard: boolean;
  'academic-overview': boolean;
  streams: boolean;
  batches: boolean;
  subjects: boolean;
  'student-dashboard': boolean;
  'student-management': boolean;
  'student-performance': boolean;
  faculty: boolean;
  'faculty-rating': boolean;
  'staff-dashboard': boolean;
  'staff-management': boolean;
  'staff-performance': boolean;
  content: boolean;
  assessments: boolean;
  attendance: boolean;
  timetable: boolean;
  analytics: boolean;
  system: boolean;
  global: boolean;
}

// Dashboard Widget Configuration per Mode
export interface DashboardWidgetVisibility {
  totalStudents: boolean;
  totalFaculty: boolean;
  attendanceRate: boolean;
  academicSession: boolean;
  atRiskStudents: boolean;
  pendingApprovals: boolean;
  aiInsights: boolean;
  engagementTrends: boolean;
  performanceAnalytics: boolean;
  setupChecklist: boolean;
  dataImport: boolean; // Add data import widget
  riskHeatmap: boolean;
  advancedCharts: boolean;
}

// Mode Behavior Configuration
export interface ModeBehavior {
  name: string;
  description: string;
  tooltipsDefault: boolean;
  showHelpBanners: boolean;
  showExplanations: boolean;
  defaultFilters: {
    currentSessionOnly: boolean;
    activeBatchesOnly: boolean;
  };
  alertVerbosity: 'minimal' | 'standard' | 'detailed' | 'all';
  collapsedSectionsByDefault: string[];
}

// Audit Log Entry
export interface AdminModeAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: 'mode-changed' | 'manual-override' | 'reset-visibility' | 'simplified-dashboard' | 'show-everything';
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  source: 'manual' | 'auto-detected' | 'system-reset';
  metadata?: Record<string, any>;
}

interface AdminModeEngineState {
  currentMode: AdminMode;
  manualOverride: boolean;
  sidebarVisibility: SidebarModuleVisibility;
  dashboardWidgets: DashboardWidgetVisibility;
  behavior: ModeBehavior;
  showTooltips: boolean;
  auditLog: AdminModeAuditLog[];
  temporaryOverrides: {
    simplifiedDashboard: boolean;
    showEverything: boolean;
  };
}

interface AdminModeEngineContextType {
  state: AdminModeEngineState;
  
  // Mode Management
  switchMode: (mode: AdminMode, source?: 'manual' | 'auto-detected') => void;
  getCurrentMode: () => AdminMode;
  
  // Sidebar Controls
  isModuleVisible: (moduleId: string) => boolean;
  getSidebarVisibility: () => SidebarModuleVisibility;
  
  // Dashboard Controls
  isDashboardWidgetVisible: (widgetId: string) => boolean;
  getDashboardWidgets: () => DashboardWidgetVisibility;
  
  // Quick Actions
  simplifyDashboard: () => void;
  resetVisibility: () => void;
  showEverything: () => void;
  toggleTooltips: (enabled: boolean) => void;
  
  // Audit
  getAuditLog: () => AdminModeAuditLog[];
  clearAuditLog: () => void;
  
  // Behavior
  getBehavior: () => ModeBehavior;
}

const AdminModeEngineContext = createContext<AdminModeEngineContextType | undefined>(undefined);

// MODE CONFIGURATIONS
const MODE_SIDEBAR_CONFIGS: Record<AdminMode, SidebarModuleVisibility> = {
  onboarding: {
    dashboard: true,
    'academic-overview': true,
    streams: false,
    batches: false,
    subjects: false,
    'student-dashboard': true,
    'student-management': true,
    'student-performance': false,
    faculty: true,
    'faculty-rating': false,
    'staff-dashboard': false,
    'staff-management': false,
    'staff-performance': false,
    content: true,
    assessments: true,
    attendance: true,
    timetable: false,
    analytics: false,
    system: true,
    global: false,
  },
  operational: {
    dashboard: true,
    'academic-overview': true,
    streams: true,
    batches: true,
    subjects: true,
    'student-dashboard': true,
    'student-management': true,
    'student-performance': true,
    faculty: true,
    'faculty-rating': true,
    'staff-dashboard': true,
    'staff-management': true,
    'staff-performance': false,
    content: true,
    assessments: true,
    attendance: true,
    timetable: true,
    analytics: false,
    system: true,
    global: false,
  },
  analytical: {
    dashboard: true,
    'academic-overview': true,
    streams: true,
    batches: true,
    subjects: true,
    'student-dashboard': true,
    'student-management': true,
    'student-performance': true,
    faculty: true,
    'faculty-rating': true,
    'staff-dashboard': true,
    'staff-management': true,
    'staff-performance': true,
    content: true,
    assessments: true,
    attendance: true,
    timetable: true,
    analytics: true,
    system: true,
    global: false,
  },
  power: {
    dashboard: true,
    'academic-overview': true,
    streams: true,
    batches: true,
    subjects: true,
    'student-dashboard': true,
    'student-management': true,
    'student-performance': true,
    faculty: true,
    'faculty-rating': true,
    'staff-dashboard': true,
    'staff-management': true,
    'staff-performance': true,
    content: true,
    assessments: true,
    attendance: true,
    timetable: true,
    analytics: true,
    system: true,
    global: true,
  },
};

const MODE_DASHBOARD_CONFIGS: Record<AdminMode, DashboardWidgetVisibility> = {
  onboarding: {
    totalStudents: true,
    totalFaculty: true,
    attendanceRate: true,
    academicSession: true,
    atRiskStudents: false,
    pendingApprovals: true,
    aiInsights: false,
    engagementTrends: false,
    performanceAnalytics: false,
    setupChecklist: true,
    dataImport: true, // Show data import only in onboarding
    riskHeatmap: false,
    advancedCharts: false,
  },
  operational: {
    totalStudents: true,
    totalFaculty: true,
    attendanceRate: true,
    academicSession: true,
    atRiskStudents: true,
    pendingApprovals: true,
    aiInsights: false,
    engagementTrends: true,
    performanceAnalytics: false,
    setupChecklist: false,
    dataImport: false, // Hide in operational mode
    riskHeatmap: false,
    advancedCharts: false,
  },
  analytical: {
    totalStudents: true,
    totalFaculty: true,
    attendanceRate: true,
    academicSession: true,
    atRiskStudents: true,
    pendingApprovals: true,
    aiInsights: true,
    engagementTrends: true,
    performanceAnalytics: true,
    setupChecklist: false,
    dataImport: false, // Hide in analytical mode
    riskHeatmap: true,
    advancedCharts: true,
  },
  power: {
    totalStudents: true,
    totalFaculty: true,
    attendanceRate: true,
    academicSession: true,
    atRiskStudents: true,
    pendingApprovals: true,
    aiInsights: true,
    engagementTrends: true,
    performanceAnalytics: true,
    setupChecklist: false,
    dataImport: false, // Hide in power mode
    riskHeatmap: true,
    advancedCharts: true,
  },
};

const MODE_BEHAVIORS: Record<AdminMode, ModeBehavior> = {
  onboarding: {
    name: 'Onboarding Mode',
    description: 'Simplified view with guided setup for new admins',
    tooltipsDefault: true,
    showHelpBanners: true,
    showExplanations: true,
    defaultFilters: {
      currentSessionOnly: true,
      activeBatchesOnly: true,
    },
    alertVerbosity: 'minimal',
    collapsedSectionsByDefault: ['insights-intelligence'],
  },
  operational: {
    name: 'Operational Mode',
    description: 'Day-to-day management tools for routine academic operations',
    tooltipsDefault: false,
    showHelpBanners: false,
    showExplanations: false,
    defaultFilters: {
      currentSessionOnly: true,
      activeBatchesOnly: true,
    },
    alertVerbosity: 'standard',
    collapsedSectionsByDefault: [],
  },
  analytical: {
    name: 'Analytical Mode',
    description: 'Insights and performance tracking for data-driven decisions',
    tooltipsDefault: false,
    showHelpBanners: false,
    showExplanations: true,
    defaultFilters: {
      currentSessionOnly: false,
      activeBatchesOnly: false,
    },
    alertVerbosity: 'detailed',
    collapsedSectionsByDefault: [],
  },
  power: {
    name: 'Power Mode',
    description: 'Full control with all features for expert admins',
    tooltipsDefault: false,
    showHelpBanners: false,
    showExplanations: false,
    defaultFilters: {
      currentSessionOnly: false,
      activeBatchesOnly: false,
    },
    alertVerbosity: 'all',
    collapsedSectionsByDefault: [],
  },
};

const STORAGE_KEY = 'adminModeEngineState';

export function AdminModeEngineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminModeEngineState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = safeJsonParse<AdminModeEngineState | null>(saved, null);

    if (parsed) {
      return {
        ...parsed,
        temporaryOverrides: {
          simplifiedDashboard: false,
          showEverything: false,
        },
      };
    }

    // Default: New admin starts in Operational mode
    return {
      currentMode: 'operational',
      manualOverride: false,
      sidebarVisibility: MODE_SIDEBAR_CONFIGS.operational,
      dashboardWidgets: MODE_DASHBOARD_CONFIGS.operational,
      behavior: MODE_BEHAVIORS.operational,
      showTooltips: false,
      auditLog: [
        {
          id: crypto.randomUUID(),
          adminId: 'current-admin',
          adminName: 'Current Admin',
          action: 'mode-changed',
          newValue: 'operational',
          timestamp: new Date().toISOString(),
          source: 'system-reset',
          metadata: { reason: 'System default mode' },
        },
      ],
      temporaryOverrides: {
        simplifiedDashboard: false,
        showEverything: false,
      },
    };
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    const toSave = {
      ...state,
      // Don't persist temporary overrides
      temporaryOverrides: {
        simplifiedDashboard: false,
        showEverything: false,
      },
    };
    localStorage.setItem(STORAGE_KEY, safeJsonStringify(toSave, '{}'));
  }, [state]);

  const addAuditLog = (
    action: AdminModeAuditLog['action'],
    oldValue: string | undefined,
    newValue: string | undefined,
    source: AdminModeAuditLog['source'],
    metadata?: Record<string, any>
  ) => {
    const logEntry: AdminModeAuditLog = {
      id: crypto.randomUUID(),
      adminId: 'current-admin', // TODO: Replace with actual admin ID from auth context
      adminName: 'Current Admin', // TODO: Replace with actual admin name
      action,
      oldValue,
      newValue,
      timestamp: new Date().toISOString(),
      source,
      metadata,
    };

    setState((prev) => ({
      ...prev,
      auditLog: [logEntry, ...prev.auditLog].slice(0, 100), // Keep last 100 entries
    }));

    // Also log to console in development
    logger.info('[Admin Mode Audit]', logEntry);
  };

  const switchMode = (mode: AdminMode, source: 'manual' | 'auto-detected' = 'manual') => {
    const oldMode = state.currentMode;

    setState((prev) => ({
      ...prev,
      currentMode: mode,
      manualOverride: source === 'manual',
      sidebarVisibility: MODE_SIDEBAR_CONFIGS[mode],
      dashboardWidgets: MODE_DASHBOARD_CONFIGS[mode],
      behavior: MODE_BEHAVIORS[mode],
      showTooltips: MODE_BEHAVIORS[mode].tooltipsDefault,
      temporaryOverrides: {
        simplifiedDashboard: false,
        showEverything: false,
      },
    }));

    addAuditLog('mode-changed', oldMode, mode, source, {
      previousBehavior: MODE_BEHAVIORS[oldMode].name,
      newBehavior: MODE_BEHAVIORS[mode].name,
    });
  };

  const getCurrentMode = () => state.currentMode;

  const isModuleVisible = (moduleId: string): boolean => {
    // Temporary override: show everything
    if (state.temporaryOverrides.showEverything) {
      return true;
    }

    const key = moduleId as keyof SidebarModuleVisibility;
    return state.sidebarVisibility[key] ?? true;
  };

  const getSidebarVisibility = () => {
    if (state.temporaryOverrides.showEverything) {
      // Return all visible
      const allVisible = { ...state.sidebarVisibility };
      Object.keys(allVisible).forEach((key) => {
        allVisible[key as keyof SidebarModuleVisibility] = true;
      });
      return allVisible;
    }
    return state.sidebarVisibility;
  };

  const isDashboardWidgetVisible = (widgetId: string): boolean => {
    // Temporary override: simplify dashboard
    if (state.temporaryOverrides.simplifiedDashboard) {
      const simpleWidgets = ['totalStudents', 'totalFaculty', 'attendanceRate', 'academicSession'];
      return simpleWidgets.includes(widgetId);
    }

    // Temporary override: show everything
    if (state.temporaryOverrides.showEverything) {
      return true;
    }

    const key = widgetId as keyof DashboardWidgetVisibility;
    return state.dashboardWidgets[key] ?? true;
  };

  const getDashboardWidgets = () => {
    if (state.temporaryOverrides.simplifiedDashboard) {
      return {
        totalStudents: true,
        totalFaculty: true,
        attendanceRate: true,
        academicSession: true,
        atRiskStudents: false,
        pendingApprovals: false,
        aiInsights: false,
        engagementTrends: false,
        performanceAnalytics: false,
        setupChecklist: false,
        dataImport: false, // Add data import widget
        riskHeatmap: false,
        advancedCharts: false,
      };
    }

    if (state.temporaryOverrides.showEverything) {
      const allVisible = { ...state.dashboardWidgets };
      Object.keys(allVisible).forEach((key) => {
        allVisible[key as keyof DashboardWidgetVisibility] = true;
      });
      return allVisible;
    }

    return state.dashboardWidgets;
  };

  const simplifyDashboard = () => {
    setState((prev) => ({
      ...prev,
      temporaryOverrides: {
        ...prev.temporaryOverrides,
        simplifiedDashboard: true,
        showEverything: false,
      },
    }));

    addAuditLog('simplified-dashboard', undefined, 'active', 'manual', {
      note: 'Temporary override - session only',
    });
  };

  const resetVisibility = () => {
    const currentMode = state.currentMode;

    setState((prev) => ({
      ...prev,
      sidebarVisibility: MODE_SIDEBAR_CONFIGS[currentMode],
      dashboardWidgets: MODE_DASHBOARD_CONFIGS[currentMode],
      behavior: MODE_BEHAVIORS[currentMode],
      temporaryOverrides: {
        simplifiedDashboard: false,
        showEverything: false,
      },
    }));

    addAuditLog('reset-visibility', undefined, currentMode, 'manual', {
      restoredTo: MODE_BEHAVIORS[currentMode].name,
    });
  };

  const showEverything = () => {
    setState((prev) => ({
      ...prev,
      temporaryOverrides: {
        ...prev.temporaryOverrides,
        showEverything: true,
        simplifiedDashboard: false,
      },
    }));

    addAuditLog('show-everything', undefined, 'active', 'manual', {
      note: 'Temporary override - session only',
    });
  };

  const toggleTooltips = (enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      showTooltips: enabled,
    }));

    addAuditLog('manual-override', state.showTooltips.toString(), enabled.toString(), 'manual', {
      setting: 'tooltips',
    });
  };

  const getAuditLog = () => state.auditLog;

  const clearAuditLog = () => {
    setState((prev) => ({
      ...prev,
      auditLog: [],
    }));
  };

  const getBehavior = () => state.behavior;

  return (
    <AdminModeEngineContext.Provider
      value={{
        state,
        switchMode,
        getCurrentMode,
        isModuleVisible,
        getSidebarVisibility,
        isDashboardWidgetVisible,
        getDashboardWidgets,
        simplifyDashboard,
        resetVisibility,
        showEverything,
        toggleTooltips,
        getAuditLog,
        clearAuditLog,
        getBehavior,
      }}
    >
      {children}
    </AdminModeEngineContext.Provider>
  );
}

export function useAdminModeEngine() {
  const context = useContext(AdminModeEngineContext);
  if (!context) {
    throw new Error('useAdminModeEngine must be used within AdminModeEngineProvider');
  }
  return context;
}
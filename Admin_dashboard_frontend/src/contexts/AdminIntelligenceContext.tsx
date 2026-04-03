import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type AdminState = 'onboarding' | 'operational' | 'analytical' | 'power';

export interface AdminBehaviorMetrics {
  loginCount: number;
  modulesUsed: string[];
  featuresEnabled: number;
  lastActiveDate: string;
  actionsPerformed: number;
  advancedFeaturesUsed: number;
  timeSpentMinutes: number;
  preferencesChanged: number;
}

export interface FeatureDependency {
  feature: string;
  requiredFor: string[];
  enhancedBy: string[];
  description: string;
}

export interface DashboardLayer {
  id: string;
  name: string;
  visible: boolean;
  collapsed: boolean;
  widgets: string[];
}

export interface SmartWidget {
  id: string;
  title: string;
  dataSource: string;
  explanation: string;
  suggestedAction?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  visible: boolean;
  pinned: boolean;
  snoozedUntil?: string;
}

export interface SystemHealthIssue {
  id: string;
  category: 'missing-data' | 'unused-module' | 'incomplete-config' | 'optimization';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  resolution: string;
  moduleAffected: string;
}

export interface AdminIntelligence {
  detectedState: AdminState;
  manualOverride: AdminState | null;
  finalState: AdminState;
  behaviorMetrics: AdminBehaviorMetrics;
  enabledFeatures: Set<string>;
  featureDependencies: FeatureDependency[];
  recommendedFeatures: string[];
  dashboardLayers: DashboardLayer[];
  smartWidgets: SmartWidget[];
  systemHealth: {
    score: number;
    issues: SystemHealthIssue[];
    lastChecked: string;
  };
  preferences: {
    showExplanations: boolean;
    showSmartSuggestions: boolean;
    enableAutoDetection: boolean;
    sandboxMode: boolean;
  };
}

interface AdminIntelligenceContextType {
  intelligence: AdminIntelligence;
  setManualOverride: (state: AdminState | null) => void;
  detectAdminState: () => AdminState;
  trackAction: (action: string, module?: string) => void;
  trackFeatureUsage: (feature: string, isAdvanced?: boolean) => void;
  enableFeature: (feature: string) => void;
  disableFeature: (feature: string) => void;
  getFeatureDependencies: (feature: string) => FeatureDependency | undefined;
  toggleLayer: (layerId: string) => void;
  collapseLayer: (layerId: string) => void;
  expandLayer: (layerId: string) => void;
  pinWidget: (widgetId: string) => void;
  unpinWidget: (widgetId: string) => void;
  snoozeWidget: (widgetId: string, until: string) => void;
  refreshSystemHealth: () => void;
  dismissIssue: (issueId: string) => void;
  updatePreference: (key: keyof AdminIntelligence['preferences'], value: boolean) => void;
  simplifyDashboard: () => void;
  resetFeatureVisibility: () => void;
  showEverything: () => void;
  resetToDefaults: () => void;
}

const AdminIntelligenceContext = createContext<AdminIntelligenceContextType | undefined>(undefined);

const DEFAULT_BEHAVIOR_METRICS: AdminBehaviorMetrics = {
  loginCount: 1,
  modulesUsed: ['dashboard'],
  featuresEnabled: 0,
  lastActiveDate: new Date().toISOString(),
  actionsPerformed: 0,
  advancedFeaturesUsed: 0,
  timeSpentMinutes: 0,
  preferencesChanged: 0,
};

const FEATURE_DEPENDENCIES: FeatureDependency[] = [
  {
    feature: 'ai-insights',
    requiredFor: ['risk-alerts', 'performance-prediction'],
    enhancedBy: ['analytics-charts', 'student-classification'],
    description: 'AI-powered pattern recognition and insights generation',
  },
  {
    feature: 'risk-alerts',
    requiredFor: ['student-intervention'],
    enhancedBy: ['ai-insights', 'attendance-tracking', 'assessment-analytics'],
    description: 'Early warning system for at-risk students',
  },
];

const DEFAULT_DASHBOARD_LAYERS: DashboardLayer[] = [
  {
    id: 'core-health',
    name: 'Core Health',
    visible: true,
    collapsed: false,
    widgets: ['total-students', 'total-faculty', 'attendance-rate', 'academic-session'],
  },
  {
    id: 'action-required',
    name: 'Action Required',
    visible: true,
    collapsed: false,
    widgets: ['at-risk-students', 'pending-approvals', 'missing-data', 'incomplete-setups'],
  },
  {
    id: 'insights-intelligence',
    name: 'Insights & Intelligence',
    visible: true,
    collapsed: true,
    widgets: ['ai-insights', 'engagement-trends', 'performance-analytics'],
  },
];

const DEFAULT_SMART_WIDGETS: SmartWidget[] = [
  {
    id: 'total-students',
    title: 'Total Students',
    dataSource: 'Student Database',
    explanation: 'Total number of enrolled students across all batches',
    priority: 'high',
    visible: true,
    pinned: true,
  },
  {
    id: 'total-faculty',
    title: 'Total Faculty',
    dataSource: 'Faculty Database',
    explanation: 'Active faculty members across all departments',
    priority: 'high',
    visible: true,
    pinned: false,
  },
  {
    id: 'attendance-rate',
    title: 'Overall Attendance Rate',
    dataSource: 'Attendance Records (Last 30 days)',
    explanation: 'Average attendance percentage across all active batches',
    suggestedAction: 'Review batches with attendance below 85%',
    priority: 'high',
    visible: true,
    pinned: false,
  },
  {
    id: 'academic-session',
    title: 'Academic Session',
    dataSource: 'System Configuration',
    explanation: 'Current active academic year',
    priority: 'medium',
    visible: true,
    pinned: false,
  },
  {
    id: 'at-risk-students',
    title: 'Students Needing Attention',
    dataSource: 'AI Risk Engine + Performance Data',
    explanation: 'Students flagged by multiple indicators: low attendance, declining grades, missed assessments',
    suggestedAction: 'Click to view intervention recommendations',
    priority: 'critical',
    visible: true,
    pinned: false,
  },
  {
    id: 'pending-approvals',
    title: 'Pending Approvals',
    dataSource: 'Workflow System',
    explanation: 'Items requiring admin approval',
    priority: 'high',
    visible: true,
    pinned: false,
  },
  {
    id: 'ai-insights',
    title: 'AI-Generated Insights',
    dataSource: 'Pattern Recognition Engine',
    explanation: 'Automatically detected trends and anomalies across all modules',
    suggestedAction: 'Review insights to identify improvement opportunities',
    priority: 'medium',
    visible: false,
    pinned: false,
  },
];

const DEFAULT_INTELLIGENCE: AdminIntelligence = {
  detectedState: 'onboarding',
  manualOverride: null,
  finalState: 'onboarding',
  behaviorMetrics: DEFAULT_BEHAVIOR_METRICS,
  enabledFeatures: new Set(['core-features']),
  featureDependencies: FEATURE_DEPENDENCIES,
  recommendedFeatures: ['attendance-tracking', 'basic-analytics'],
  dashboardLayers: DEFAULT_DASHBOARD_LAYERS,
  smartWidgets: DEFAULT_SMART_WIDGETS,
  systemHealth: {
    score: 45,
    issues: [],
    lastChecked: new Date().toISOString(),
  },
  preferences: {
    showExplanations: true,
    showSmartSuggestions: true,
    enableAutoDetection: true,
    sandboxMode: false,
  },
};

export function AdminIntelligenceProvider({ children }: { children: ReactNode }) {
  const [intelligence, setIntelligence] = useState<AdminIntelligence>(() => {
    const saved = localStorage.getItem('adminIntelligence');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.enabledFeatures = new Set(parsed.enabledFeatures);
        return parsed;
      } catch (e) {
        return DEFAULT_INTELLIGENCE;
      }
    }
    return DEFAULT_INTELLIGENCE;
  });

  useEffect(() => {
    const toSave = {
      ...intelligence,
      enabledFeatures: Array.from(intelligence.enabledFeatures),
    };
    localStorage.setItem('adminIntelligence', JSON.stringify(toSave));
  }, [intelligence]);

  const detectAdminState = (): AdminState => {
    const { behaviorMetrics } = intelligence;
    if (behaviorMetrics.loginCount < 5 && behaviorMetrics.actionsPerformed < 20) {
      return 'onboarding';
    }
    if (
      behaviorMetrics.advancedFeaturesUsed > 5 &&
      behaviorMetrics.modulesUsed.length > 8 &&
      intelligence.enabledFeatures.size > 6
    ) {
      return 'power';
    }
    if (
      behaviorMetrics.modulesUsed.includes('analytics') &&
      (intelligence.enabledFeatures.has('ai-insights') ||
        intelligence.enabledFeatures.has('analytics-charts'))
    ) {
      return 'analytical';
    }
    return 'operational';
  };

  const setManualOverride = (state: AdminState | null) => {
    setIntelligence((prev) => ({
      ...prev,
      manualOverride: state,
      finalState: state || prev.detectedState,
    }));
  };

  const trackAction = (action: string, module?: string) => {
    setIntelligence((prev) => ({
      ...prev,
      behaviorMetrics: {
        ...prev.behaviorMetrics,
        actionsPerformed: prev.behaviorMetrics.actionsPerformed + 1,
        modulesUsed: module && !prev.behaviorMetrics.modulesUsed.includes(module)
          ? [...prev.behaviorMetrics.modulesUsed, module]
          : prev.behaviorMetrics.modulesUsed,
      },
    }));
  };

  const trackFeatureUsage = (feature: string, isAdvanced = false) => {
    setIntelligence((prev) => ({
      ...prev,
      behaviorMetrics: {
        ...prev.behaviorMetrics,
        advancedFeaturesUsed: isAdvanced
          ? prev.behaviorMetrics.advancedFeaturesUsed + 1
          : prev.behaviorMetrics.advancedFeaturesUsed,
      },
    }));
  };

  const enableFeature = (feature: string) => {
    setIntelligence((prev) => ({
      ...prev,
      enabledFeatures: new Set([...prev.enabledFeatures, feature]),
    }));
  };

  const disableFeature = (feature: string) => {
    setIntelligence((prev) => {
      const newFeatures = new Set(prev.enabledFeatures);
      newFeatures.delete(feature);
      return { ...prev, enabledFeatures: newFeatures };
    });
  };

  const getFeatureDependencies = (feature: string) => {
    return intelligence.featureDependencies.find((dep) => dep.feature === feature);
  };

  const toggleLayer = (layerId: string) => {
    setIntelligence((prev) => ({
      ...prev,
      dashboardLayers: prev.dashboardLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ),
    }));
  };

  const collapseLayer = (layerId: string) => {
    setIntelligence((prev) => ({
      ...prev,
      dashboardLayers: prev.dashboardLayers.map((layer) =>
        layer.id === layerId ? { ...layer, collapsed: true } : layer
      ),
    }));
  };

  const expandLayer = (layerId: string) => {
    setIntelligence((prev) => ({
      ...prev,
      dashboardLayers: prev.dashboardLayers.map((layer) =>
        layer.id === layerId ? { ...layer, collapsed: false } : layer
      ),
    }));
  };

  const pinWidget = (widgetId: string) => {
    setIntelligence((prev) => ({
      ...prev,
      smartWidgets: prev.smartWidgets.map((widget) =>
        widget.id === widgetId ? { ...widget, pinned: true } : widget
      ),
    }));
  };

  const unpinWidget = (widgetId: string) => {
    setIntelligence((prev) => ({
      ...prev,
      smartWidgets: prev.smartWidgets.map((widget) =>
        widget.id === widgetId ? { ...widget, pinned: false } : widget
      ),
    }));
  };

  const snoozeWidget = (widgetId: string, until: string) => {
    setIntelligence((prev) => ({
      ...prev,
      smartWidgets: prev.smartWidgets.map((widget) =>
        widget.id === widgetId ? { ...widget, snoozedUntil: until } : widget
      ),
    }));
  };

  const refreshSystemHealth = () => {
    const issues: SystemHealthIssue[] = [];
    if (intelligence.behaviorMetrics.modulesUsed.length < 5) {
      issues.push({
        id: 'unused-modules',
        category: 'unused-module',
        title: 'Modules Not Yet Explored',
        description: 'Several powerful modules are available but not yet used',
        severity: 'info',
        resolution: 'Explore Content Management, Assessments, and Analytics modules',
        moduleAffected: 'general',
      });
    }
    const healthScore = Math.max(45, 100 - issues.length * 15);
    setIntelligence((prev) => ({
      ...prev,
      systemHealth: { score: healthScore, issues, lastChecked: new Date().toISOString() },
    }));
  };

  const dismissIssue = (issueId: string) => {
    setIntelligence((prev) => ({
      ...prev,
      systemHealth: {
        ...prev.systemHealth,
        issues: prev.systemHealth.issues.filter((issue) => issue.id !== issueId),
      },
    }));
  };

  const updatePreference = (key: keyof AdminIntelligence['preferences'], value: boolean) => {
    setIntelligence((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const simplifyDashboard = () => {
    setIntelligence((prev) => ({
      ...prev,
      dashboardLayers: prev.dashboardLayers.map((layer) =>
        layer.id === 'core-health'
          ? { ...layer, visible: true, collapsed: false }
          : { ...layer, visible: false }
      ),
    }));
  };

  const resetFeatureVisibility = () => {
    setIntelligence((prev) => ({
      ...prev,
      dashboardLayers: DEFAULT_DASHBOARD_LAYERS,
    }));
  };

  const showEverything = () => {
    setIntelligence((prev) => ({
      ...prev,
      dashboardLayers: prev.dashboardLayers.map((layer) => ({
        ...layer,
        visible: true,
        collapsed: false,
      })),
    }));
  };

  const resetToDefaults = () => {
    setIntelligence(DEFAULT_INTELLIGENCE);
  };

  return (
    <AdminIntelligenceContext.Provider
      value={{
        intelligence,
        setManualOverride,
        detectAdminState,
        trackAction,
        trackFeatureUsage,
        enableFeature,
        disableFeature,
        getFeatureDependencies,
        toggleLayer,
        collapseLayer,
        expandLayer,
        pinWidget,
        unpinWidget,
        snoozeWidget,
        refreshSystemHealth,
        dismissIssue,
        updatePreference,
        simplifyDashboard,
        resetFeatureVisibility,
        showEverything,
        resetToDefaults,
      }}
    >
      {children}
    </AdminIntelligenceContext.Provider>
  );
}

export function useAdminIntelligence() {
  const context = useContext(AdminIntelligenceContext);
  if (!context) {
    throw new Error('useAdminIntelligence must be used within AdminIntelligenceProvider');
  }
  return context;
}

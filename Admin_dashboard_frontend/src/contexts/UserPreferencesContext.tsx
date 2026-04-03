import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { safeJsonParse, safeJsonStringify } from '../utils/storageUtils';

export type ExperienceMode = 'basic' | 'standard' | 'advanced';

export interface FeatureToggles {
  aiInsights: boolean;
  riskAlerts: boolean;
  analyticsCharts: boolean;
  staffPerformance: boolean;
  globalRankings: boolean;
  advancedReports: boolean;
}

export interface OnboardingStep {
  id: string;
  label: string;
  completed: boolean;
}

export interface DashboardWidget {
  id: string;
  visible: boolean;
  order: number;
}

export interface UserPreferences {
  experienceMode: ExperienceMode;
  featureToggles: FeatureToggles;
  onboardingSteps: OnboardingStep[];
  dashboardWidgets: DashboardWidget[];
  hasCompletedOnboarding: boolean;
  isFirstLogin: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setExperienceMode: (mode: ExperienceMode) => void;
  toggleFeature: (feature: keyof FeatureToggles) => void;
  completeOnboardingStep: (stepId: string) => void;
  resetOnboarding: () => void;
  toggleWidget: (widgetId: string) => void;
  reorderWidgets: (widgetIds: string[]) => void;
  resetDashboard: () => void;
  simplifyDashboard: () => void;
  dismissOnboarding: () => void;
  resetAllPreferences: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

const DEFAULT_ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'add-students', label: 'Add your first students', completed: false },
  { id: 'add-faculty', label: 'Add faculty members', completed: false },
  { id: 'create-batches', label: 'Create academic batches', completed: false },
  { id: 'upload-content', label: 'Upload course content', completed: false },
  { id: 'mark-attendance', label: 'Mark attendance', completed: false },
];

const DEFAULT_DASHBOARD_WIDGETS: DashboardWidget[] = [
  { id: 'total-students', visible: true, order: 1 },
  { id: 'total-faculty', visible: true, order: 2 },
  { id: 'attendance-rate', visible: true, order: 3 },
  { id: 'recent-activity', visible: true, order: 4 },
  { id: 'ai-insights', visible: true, order: 5 },
  { id: 'risk-alerts', visible: true, order: 6 },
  { id: 'performance-chart', visible: true, order: 7 },
  { id: 'engagement-metrics', visible: true, order: 8 },
];

const DEFAULT_FEATURE_TOGGLES: FeatureToggles = {
  aiInsights: true,
  riskAlerts: true,
  analyticsCharts: true,
  staffPerformance: true,
  globalRankings: true,
  advancedReports: true,
};

const DEFAULT_PREFERENCES: UserPreferences = {
  experienceMode: 'basic',
  featureToggles: DEFAULT_FEATURE_TOGGLES,
  onboardingSteps: DEFAULT_ONBOARDING_STEPS,
  dashboardWidgets: DEFAULT_DASHBOARD_WIDGETS,
  hasCompletedOnboarding: false,
  isFirstLogin: true,
};

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return safeJsonParse<UserPreferences>(saved, DEFAULT_PREFERENCES);
  });

  // Save to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem('userPreferences', safeJsonStringify(preferences, '{}'));
  }, [preferences]);

  const setExperienceMode = (mode: ExperienceMode) => {
    setPreferences(prev => ({
      ...prev,
      experienceMode: mode,
      // Auto-adjust feature toggles based on mode
      featureToggles: mode === 'basic' 
        ? {
            aiInsights: false,
            riskAlerts: false,
            analyticsCharts: false,
            staffPerformance: false,
            globalRankings: false,
            advancedReports: false,
          }
        : mode === 'standard'
        ? {
            aiInsights: true,
            riskAlerts: true,
            analyticsCharts: true,
            staffPerformance: false,
            globalRankings: false,
            advancedReports: false,
          }
        : DEFAULT_FEATURE_TOGGLES, // advanced mode
    }));
  };

  const toggleFeature = (feature: keyof FeatureToggles) => {
    setPreferences(prev => ({
      ...prev,
      featureToggles: {
        ...prev.featureToggles,
        [feature]: !prev.featureToggles[feature],
      },
    }));
  };

  const completeOnboardingStep = (stepId: string) => {
    setPreferences(prev => {
      const updatedSteps = prev.onboardingSteps.map(step =>
        step.id === stepId ? { ...step, completed: true } : step
      );
      
      // Check if all steps completed
      const allCompleted = updatedSteps.every(step => step.completed);
      
      return {
        ...prev,
        onboardingSteps: updatedSteps,
        hasCompletedOnboarding: allCompleted,
        // Automatically upgrade to standard mode after onboarding
        experienceMode: allCompleted ? 'standard' : prev.experienceMode,
      };
    });
  };

  const resetOnboarding = () => {
    setPreferences(prev => ({
      ...prev,
      onboardingSteps: DEFAULT_ONBOARDING_STEPS,
      hasCompletedOnboarding: false,
    }));
  };

  const toggleWidget = (widgetId: string) => {
    setPreferences(prev => ({
      ...prev,
      dashboardWidgets: prev.dashboardWidgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, visible: !widget.visible }
          : widget
      ),
    }));
  };

  const reorderWidgets = (widgetIds: string[]) => {
    setPreferences(prev => ({
      ...prev,
      dashboardWidgets: widgetIds.map((id, index) => {
        const widget = prev.dashboardWidgets.find(w => w.id === id);
        return widget ? { ...widget, order: index + 1 } : { id, visible: true, order: index + 1 };
      }),
    }));
  };

  const resetDashboard = () => {
    setPreferences(prev => ({
      ...prev,
      dashboardWidgets: DEFAULT_DASHBOARD_WIDGETS,
    }));
  };

  const simplifyDashboard = () => {
    setPreferences(prev => ({
      ...prev,
      dashboardWidgets: prev.dashboardWidgets.map(widget => ({
        ...widget,
        visible: ['total-students', 'total-faculty', 'attendance-rate', 'recent-activity'].includes(widget.id),
      })),
    }));
  };

  const dismissOnboarding = () => {
    setPreferences(prev => ({
      ...prev,
      isFirstLogin: false,
      hasCompletedOnboarding: true,
    }));
  };

  const resetAllPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        setExperienceMode,
        toggleFeature,
        completeOnboardingStep,
        resetOnboarding,
        toggleWidget,
        reorderWidgets,
        resetDashboard,
        simplifyDashboard,
        dismissOnboarding,
        resetAllPreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
}

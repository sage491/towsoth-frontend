import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { MotivationTone } from './MotivationToneContext';

export interface UserPreferences {
  focusMode: boolean;
  motivationTone: MotivationTone;
  aiIntensity: number; // 0-100
  language: 'en' | 'hinglish' | 'simple';
  notifications: {
    testReminders: boolean;
    dailyStudy: boolean;
    achievements: boolean;
    rankChanges: boolean;
    aiInsights: boolean;
  };
  theme: 'light' | 'dark';
}

export interface PreferencesContextValue {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  updateNotification: (key: keyof UserPreferences['notifications'], value: boolean) => void;
  shouldShowNotification: (type: keyof UserPreferences['notifications']) => boolean;
  shouldShowRank: () => boolean;
  shouldShowAchievements: () => boolean;
  getAIProactivityLevel: () => 'minimal' | 'balanced' | 'proactive';
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const STORAGE_KEY = 'towsoth_user_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  focusMode: false,
  motivationTone: 'supportive',
  aiIntensity: 50, // Balanced by default
  language: 'en',
  notifications: {
    testReminders: true,
    dailyStudy: true,
    achievements: true,
    rankChanges: true,
    aiInsights: true,
  },
  theme: 'light',
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } catch (e) {
        console.error('Failed to parse preferences:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): void => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNotification = (
    key: keyof UserPreferences['notifications'],
    value: boolean
  ): void => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  /**
   * CONFLICT RESOLUTION: Focus Mode overrides notification preferences
   * Only test reminders are allowed during Focus Mode
   */
  const shouldShowNotification = (
    type: keyof UserPreferences['notifications']
  ): boolean => {
    // Focus Mode ON: Only show test reminders
    if (preferences.focusMode) {
      return type === 'testReminders' && preferences.notifications.testReminders;
    }
    
    // Focus Mode OFF: Respect individual preferences
    return preferences.notifications[type];
  };

  /**
   * CONFLICT RESOLUTION: Focus Mode hides rank
   */
  const shouldShowRank = (): boolean => {
    return !preferences.focusMode;
  };

  /**
   * CONFLICT RESOLUTION: Focus Mode hides achievements
   */
  const shouldShowAchievements = (): boolean => {
    return !preferences.focusMode;
  };

  /**
   * Get AI proactivity level based on intensity slider
   */
  const getAIProactivityLevel = (): 'minimal' | 'balanced' | 'proactive' => {
    if (preferences.aiIntensity <= 33) return 'minimal';
    if (preferences.aiIntensity <= 66) return 'balanced';
    return 'proactive';
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        updateNotification,
        shouldShowNotification,
        shouldShowRank,
        shouldShowAchievements,
        getAIProactivityLevel,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}

/**
 * Multi-language support for UI labels and system messages
 * Works in tandem with motivationMessages.ts
 */

export type Language = 'en' | 'hinglish' | 'simple';

type LanguageKey =
  // Navigation
  | 'nav_dashboard'
  | 'nav_subjects'
  | 'nav_planner'
  | 'nav_progress'
  | 'nav_ai_coach'
  | 'nav_settings'
  
  // Common Actions
  | 'action_save'
  | 'action_cancel'
  | 'action_delete'
  | 'action_edit'
  | 'action_add'
  | 'action_view'
  
  // Settings
  | 'settings_preferences'
  | 'settings_focus_mode'
  | 'settings_motivation_tone'
  | 'settings_ai_intensity'
  | 'settings_language'
  | 'settings_notifications'
  | 'settings_theme'
  
  // Focus Mode
  | 'focus_mode_on'
  | 'focus_mode_off'
  | 'focus_mode_description'
  
  // Notifications
  | 'notif_test_reminders'
  | 'notif_daily_study'
  | 'notif_achievements'
  | 'notif_rank_changes'
  | 'notif_ai_insights'
  
  // General
  | 'label_active'
  | 'label_inactive'
  | 'label_recommended';

type LanguageData = {
  [key in LanguageKey]: {
    en: string;
    hinglish: string;
    simple: string;
  };
};

const translations: LanguageData = {
  // Navigation
  nav_dashboard: {
    en: 'Dashboard',
    hinglish: 'Dashboard',
    simple: 'Home',
  },
  nav_subjects: {
    en: 'Subjects',
    hinglish: 'Subjects',
    simple: 'Subjects',
  },
  nav_planner: {
    en: 'My Planner',
    hinglish: 'Mera Planner',
    simple: 'My Tasks',
  },
  nav_progress: {
    en: 'Progress',
    hinglish: 'Progress',
    simple: 'My Progress',
  },
  nav_ai_coach: {
    en: 'AI Coach',
    hinglish: 'AI Coach',
    simple: 'AI Help',
  },
  nav_settings: {
    en: 'Settings',
    hinglish: 'Settings',
    simple: 'Settings',
  },
  
  // Common Actions
  action_save: {
    en: 'Save',
    hinglish: 'Save karo',
    simple: 'Save',
  },
  action_cancel: {
    en: 'Cancel',
    hinglish: 'Cancel karo',
    simple: 'Cancel',
  },
  action_delete: {
    en: 'Delete',
    hinglish: 'Delete karo',
    simple: 'Remove',
  },
  action_edit: {
    en: 'Edit',
    hinglish: 'Edit karo',
    simple: 'Change',
  },
  action_add: {
    en: 'Add',
    hinglish: 'Add karo',
    simple: 'Add',
  },
  action_view: {
    en: 'View',
    hinglish: 'Dekho',
    simple: 'See',
  },
  
  // Settings
  settings_preferences: {
    en: 'Preferences',
    hinglish: 'Preferences',
    simple: 'My Settings',
  },
  settings_focus_mode: {
    en: 'Focus Mode',
    hinglish: 'Focus Mode',
    simple: 'Focus Mode',
  },
  settings_motivation_tone: {
    en: 'Motivation Tone',
    hinglish: 'Motivation Style',
    simple: 'How to Talk',
  },
  settings_ai_intensity: {
    en: 'AI Recommendation Intensity',
    hinglish: 'AI Suggestions Ki Intensity',
    simple: 'AI Help Level',
  },
  settings_language: {
    en: 'Language Preference',
    hinglish: 'Language Preference',
    simple: 'Language',
  },
  settings_notifications: {
    en: 'Notification Control',
    hinglish: 'Notification Control',
    simple: 'Alerts',
  },
  settings_theme: {
    en: 'Visual Theme',
    hinglish: 'Theme',
    simple: 'Colors',
  },
  
  // Focus Mode
  focus_mode_on: {
    en: 'Focus Mode Active',
    hinglish: 'Focus Mode Chalu Hai',
    simple: 'Focus Mode On',
  },
  focus_mode_off: {
    en: 'Focus Mode Inactive',
    hinglish: 'Focus Mode Band Hai',
    simple: 'Focus Mode Off',
  },
  focus_mode_description: {
    en: 'Hides rank, reduces notifications, locks non-essential sections',
    hinglish: 'Rank hide karega, notifications kam karega, extra sections lock karega',
    simple: 'Removes distractions to help you focus',
  },
  
  // Notifications
  notif_test_reminders: {
    en: 'Test & Quiz Reminders',
    hinglish: 'Test Aur Quiz Reminders',
    simple: 'Test Alerts',
  },
  notif_daily_study: {
    en: 'Daily Study Nudges',
    hinglish: 'Daily Study Nudges',
    simple: 'Study Reminders',
  },
  notif_achievements: {
    en: 'Achievement Badges',
    hinglish: 'Achievement Badges',
    simple: 'Achievement Alerts',
  },
  notif_rank_changes: {
    en: 'Rank Movement Alerts',
    hinglish: 'Rank Change Alerts',
    simple: 'Rank Updates',
  },
  notif_ai_insights: {
    en: 'AI-Only Recommendations',
    hinglish: 'AI Recommendations',
    simple: 'AI Suggestions',
  },
  
  // General
  label_active: {
    en: 'Active',
    hinglish: 'Active',
    simple: 'On',
  },
  label_inactive: {
    en: 'Inactive',
    hinglish: 'Inactive',
    simple: 'Off',
  },
  label_recommended: {
    en: 'Recommended',
    hinglish: 'Recommended',
    simple: 'Best Choice',
  },
};

/**
 * Get translated label based on language preference
 */
export function getLabel(key: LanguageKey, language: Language): string {
  return translations[key][language];
}

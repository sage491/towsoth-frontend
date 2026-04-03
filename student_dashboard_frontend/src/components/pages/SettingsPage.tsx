import { Monitor, Moon, Sun, Bell, Zap, Globe, Focus } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import { getLabel } from '@/utils/languageMessages';

export function SettingsPage() {
  const {
    preferences,
    updatePreference,
    updateNotification,
    getAIProactivityLevel,
  } = usePreferences();

  const aiLevel = getAIProactivityLevel();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-4" style={{ borderBottom: '2px solid var(--border-medium)' }}>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {getLabel('settings_preferences', preferences.language)}
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Control how the system speaks, behaves, and adapts to you
          </p>
        </div>

        {/* Focus Mode */}
        <section className="bg-white border-2 border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${preferences.focusMode ? 'bg-purple-100' : 'bg-slate-100'}`}>
                <Focus className={`w-5 h-5 ${preferences.focusMode ? 'text-purple-700' : 'text-slate-600'}`} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {getLabel('settings_focus_mode', preferences.language)}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {getLabel('focus_mode_description', preferences.language)}
                </div>
              </div>
            </div>
            <button
              onClick={() => updatePreference('focusMode', !preferences.focusMode)}
              className={`px-4 py-2 text-xs font-bold transition-colors ${
                preferences.focusMode
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {preferences.focusMode
                ? getLabel('label_active', preferences.language)
                : getLabel('label_inactive', preferences.language)}
            </button>
          </div>

          {preferences.focusMode && (
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mt-4">
              <div className="text-xs text-purple-900 font-semibold mb-2">
                Currently Active:
              </div>
              <ul className="text-xs text-purple-800 space-y-1">
                <li>• Leaderboard & rank hidden</li>
                <li>• Achievement toasts disabled</li>
                <li>• Only test reminders allowed</li>
                <li>• Non-essential sections soft-locked</li>
              </ul>
            </div>
          )}
        </section>

        {/* Motivation Tone */}
        <section className="bg-white border-2 border-slate-200 p-6">
          <div className="mb-4">
            <div className="text-sm font-bold text-slate-900 mb-1">
              {getLabel('settings_motivation_tone', preferences.language)}
            </div>
            <div className="text-xs text-slate-600">
              Controls language style, feedback framing, and AI suggestions
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              {
                id: 'calm' as const,
                name: 'Calm',
                description: 'Reduce anxiety, promote consistency',
                example: 'You\'re making steady progress.',
                color: 'border-emerald-300 bg-emerald-50',
                selectedColor: 'border-emerald-600 bg-emerald-100',
              },
              {
                id: 'competitive' as const,
                name: 'Competitive',
                description: 'Push performance & urgency',
                example: 'Complete this today to move up 3 ranks.',
                color: 'border-red-300 bg-red-50',
                selectedColor: 'border-red-600 bg-red-100',
              },
              {
                id: 'supportive' as const,
                name: 'Supportive',
                description: 'Encourage without pressure',
                example: 'Nice work! You\'re improving.',
                color: 'border-blue-300 bg-blue-50',
                selectedColor: 'border-blue-600 bg-blue-100',
                recommended: true,
              },
            ].map((tone) => (
              <button
                key={tone.id}
                onClick={() => updatePreference('motivationTone', tone.id)}
                className={`text-left p-4 border-2 transition-all ${
                  preferences.motivationTone === tone.id
                    ? tone.selectedColor
                    : tone.color
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {tone.name}
                    </span>
                    {tone.recommended && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wide">
                        {getLabel('label_recommended', preferences.language)}
                      </span>
                    )}
                  </div>
                  {preferences.motivationTone === tone.id && (
                    <div className="w-3 h-3 rounded-full bg-slate-900" />
                  )}
                </div>
                <div className="text-xs text-slate-700 mb-2">
                  {tone.description}
                </div>
                <div className="bg-white border-l-2 border-slate-400 p-2">
                  <div className="text-xs text-slate-600 italic">
                    "{tone.example}"
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* AI Recommendation Intensity */}
        <section className="bg-white border-2 border-slate-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-slate-100">
              <Zap className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900 mb-1">
                {getLabel('settings_ai_intensity', preferences.language)}
              </div>
              <div className="text-xs text-slate-600">
                Controls frequency and depth of AI-driven nudges and suggestions
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.aiIntensity}
                onChange={(e) =>
                  updatePreference('aiIntensity', parseInt(e.target.value))
                }
                className="flex-1 h-2 bg-slate-200 appearance-none cursor-pointer accent-slate-900"
              />
              <div className="text-sm font-bold text-slate-900 w-12 text-right">
                {preferences.aiIntensity}%
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-600">
              <span>Minimal</span>
              <span>Balanced</span>
              <span>Proactive</span>
            </div>

            <div className="bg-slate-50 border-l-4 border-slate-400 p-4">
              <div className="text-xs text-slate-700">
                <strong>Current Level: {aiLevel.charAt(0).toUpperCase() + aiLevel.slice(1)}</strong>
                <div className="mt-2">
                  {aiLevel === 'minimal' && '• AI only reacts to your actions'}
                  {aiLevel === 'balanced' && '• AI suggests when relevant'}
                  {aiLevel === 'proactive' && '• AI predicts and prompts proactively'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Language Preference */}
        <section className="bg-white border-2 border-slate-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-slate-100">
              <Globe className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900 mb-1">
                {getLabel('settings_language', preferences.language)}
              </div>
              <div className="text-xs text-slate-600">
                Changes UI labels, AI messages, and system notifications
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'en' as const, name: 'English', desc: 'Full English' },
              { id: 'hinglish' as const, name: 'Hinglish', desc: 'Hindi + English' },
              { id: 'simple' as const, name: 'Simple', desc: 'Easy words' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => updatePreference('language', lang.id)}
                className={`p-4 border-2 transition-all ${
                  preferences.language === lang.id
                    ? 'border-slate-900 bg-slate-100'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="text-sm font-bold text-slate-900 mb-1">
                  {lang.name}
                </div>
                <div className="text-xs text-slate-600">{lang.desc}</div>
              </button>
            ))}
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
            <div className="text-xs text-amber-900">
              <strong>Note:</strong> Language preference does not affect academic content (questions, solutions, etc.)
            </div>
          </div>
        </section>

        {/* Notification Control */}
        <section className="bg-white border-2 border-slate-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-slate-100">
              <Bell className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900 mb-1">
                {getLabel('settings_notifications', preferences.language)}
              </div>
              <div className="text-xs text-slate-600">
                Individual control over each notification type
              </div>
            </div>
          </div>

          {preferences.focusMode && (
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
              <div className="text-xs text-purple-900 font-semibold">
                Focus Mode is active - only Test Reminders are allowed
              </div>
            </div>
          )}

          <div className="space-y-3">
            {[
              {
                key: 'testReminders' as const,
                label: getLabel('notif_test_reminders', preferences.language),
                desc: 'Exam & quiz alerts',
                critical: true,
              },
              {
                key: 'dailyStudy' as const,
                label: getLabel('notif_daily_study', preferences.language),
                desc: 'Study nudges',
              },
              {
                key: 'achievements' as const,
                label: getLabel('notif_achievements', preferences.language),
                desc: 'Badges & milestones',
              },
              {
                key: 'rankChanges' as const,
                label: getLabel('notif_rank_changes', preferences.language),
                desc: 'Leaderboard movement',
              },
              {
                key: 'aiInsights' as const,
                label: getLabel('notif_ai_insights', preferences.language),
                desc: 'AI-only recommendations',
              },
            ].map((notif) => (
              <div
                key={notif.key}
                className={`flex items-center justify-between p-4 border ${
                  preferences.notifications[notif.key]
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200 bg-slate-50'
                } ${preferences.focusMode && notif.key !== 'testReminders' ? 'opacity-50' : ''}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-bold text-slate-900">
                      {notif.label}
                    </div>
                    {notif.critical && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wide">
                        Critical
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {notif.desc}
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateNotification(notif.key, !preferences.notifications[notif.key])
                  }
                  disabled={preferences.focusMode && notif.key !== 'testReminders'}
                  className={`px-4 py-2 text-xs font-bold transition-colors ${
                    preferences.notifications[notif.key]
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-200 text-slate-700'
                  } ${preferences.focusMode && notif.key !== 'testReminders' ? 'cursor-not-allowed' : ''}`}
                >
                  {preferences.notifications[notif.key] ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Theme */}
        <section className="bg-white border-2 border-slate-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-slate-100">
              <Monitor className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900 mb-1">
                {getLabel('settings_theme', preferences.language)}
              </div>
              <div className="text-xs text-slate-600">
                Adjusts background, cards, and text contrast
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updatePreference('theme', 'light')}
              className={`p-6 border-2 transition-all ${
                preferences.theme === 'light'
                  ? 'border-slate-900 bg-slate-100'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <Sun className="w-8 h-8 text-amber-500 mb-3 mx-auto" />
              <div className="text-sm font-bold text-slate-900">Light</div>
            </button>
            <button
              onClick={() => updatePreference('theme', 'dark')}
              className={`p-6 border-2 transition-all ${
                preferences.theme === 'dark'
                  ? 'border-slate-900 bg-slate-800'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <Moon className={`w-8 h-8 mb-3 mx-auto ${preferences.theme === 'dark' ? 'text-blue-400' : 'text-slate-600'}`} />
              <div className={`text-sm font-bold ${preferences.theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Dark
              </div>
            </button>
          </div>
        </section>

        {/* System Info */}
        <div className="bg-slate-100 border-l-4 border-slate-600 p-6">
          <div className="text-xs text-slate-700 leading-relaxed space-y-2">
            <div>
              <strong>Persistence:</strong> All preferences are saved instantly and persist across sessions.
            </div>
            <div>
              <strong>Conflict Resolution:</strong> Focus Mode overrides notification settings (except Test Reminders).
            </div>
            <div>
              <strong>Privacy:</strong> Preferences are stored locally. No data is sent to external servers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
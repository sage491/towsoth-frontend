import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { Brain, AlertTriangle, BarChart3, Users, Trophy, FileText } from 'lucide-react';

export function FeatureTogglePanel() {
  const { preferences, toggleFeature } = useUserPreferences();

  const features = [
    {
      key: 'aiInsights' as const,
      label: 'AI Insights',
      description: 'Automatically generated patterns based on attendance, assessments, and engagement',
      icon: Brain,
      recommendedFor: ['standard', 'advanced'],
    },
    {
      key: 'riskAlerts' as const,
      label: 'Risk Alerts',
      description: 'Early warning system for at-risk students based on performance trends',
      icon: AlertTriangle,
      recommendedFor: ['standard', 'advanced'],
    },
    {
      key: 'analyticsCharts' as const,
      label: 'Analytics Charts',
      description: 'Visual analytics and performance graphs across all modules',
      icon: BarChart3,
      recommendedFor: ['standard', 'advanced'],
    },
    {
      key: 'staffPerformance' as const,
      label: 'Staff Performance Tracking',
      description: 'Advanced metrics for faculty and staff evaluation',
      icon: Users,
      recommendedFor: ['advanced'],
    },
    {
      key: 'globalRankings' as const,
      label: 'Global Rankings',
      description: 'Compare student and faculty performance across batches and departments',
      icon: Trophy,
      recommendedFor: ['advanced'],
    },
    {
      key: 'advancedReports' as const,
      label: 'Advanced Reports',
      description: 'Comprehensive reporting tools with export and scheduling',
      icon: FileText,
      recommendedFor: ['advanced'],
    },
  ];

  return (
    <div className="bg-white border border-[#d1d5db]">
      <div className="px-6 py-4 border-b border-[#d1d5db]">
        <h2 className="text-[17px] text-[#111827]">Feature Visibility</h2>
        <p className="text-[13px] text-[#6b7280] mt-1">
          Control which features appear in your dashboard and sidebar
        </p>
      </div>

      <div className="p-6">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-[#f0f9ff] border border-[#bae6fd]">
          <p className="text-[12px] text-[#0c4a6e] leading-relaxed">
            ℹ️ <span className="font-medium">Note:</span> Toggling features only affects visibility in the UI. 
            All data and functionality remains intact and can be re-enabled anytime.
          </p>
        </div>

        {/* Current Mode Info */}
        <div className="mb-6 p-4 bg-[#f9fafb] border border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[13px] text-[#111827]">Current Experience Mode</h3>
              <p className="text-[11px] text-[#6b7280] mt-1">
                {preferences.experienceMode === 'basic' && 'Basic Mode - Essential features only'}
                {preferences.experienceMode === 'standard' && 'Standard Mode - Balanced experience'}
                {preferences.experienceMode === 'advanced' && 'Advanced Mode - Full power'}
              </p>
            </div>
            <span className="px-3 py-1 bg-white border border-[#d1d5db] text-[11px] text-[#374151] uppercase tracking-wider">
              {preferences.experienceMode}
            </span>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="space-y-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isEnabled = preferences.featureToggles[feature.key];
            const isRecommended = feature.recommendedFor.includes(preferences.experienceMode);

            return (
              <div
                key={feature.key}
                className={`p-4 border transition-colors ${
                  isEnabled ? 'bg-white border-[#d1d5db]' : 'bg-[#f9fafb] border-[#e5e7eb]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center border flex-shrink-0 ${
                    isEnabled 
                      ? 'bg-[#dbeafe] border-[#93c5fd]' 
                      : 'bg-[#f3f4f6] border-[#d1d5db]'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isEnabled ? 'text-[#3b82f6]' : 'text-[#9ca3af]'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-[13px] ${
                        isEnabled ? 'text-[#111827]' : 'text-[#6b7280]'
                      }`}>
                        {feature.label}
                      </h3>
                      {isRecommended && (
                        <span className="px-2 py-0.5 bg-[#d1fae5] border border-[#86efac] text-[#059669] text-[10px] uppercase tracking-wider">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6b7280] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleFeature(feature.key)}
                      className={`relative inline-flex h-6 w-11 items-center border-2 transition-colors ${
                        isEnabled
                          ? 'bg-[#3b82f6] border-[#3b82f6]'
                          : 'bg-[#e5e7eb] border-[#d1d5db]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform bg-white transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Button */}
        <div className="mt-6 pt-6 border-t border-[#e5e7eb] flex items-center justify-between">
          <p className="text-[11px] text-[#6b7280]">
            Reset all features to default settings
          </p>
          <button
            onClick={() => {
              // Reset based on current mode
              const mode = preferences.experienceMode;
              if (mode === 'basic') {
                Object.keys(preferences.featureToggles).forEach(key => {
                  if (preferences.featureToggles[key as keyof typeof preferences.featureToggles]) {
                    toggleFeature(key as keyof typeof preferences.featureToggles);
                  }
                });
              } else if (mode === 'advanced') {
                Object.keys(preferences.featureToggles).forEach(key => {
                  if (!preferences.featureToggles[key as keyof typeof preferences.featureToggles]) {
                    toggleFeature(key as keyof typeof preferences.featureToggles);
                  }
                });
              }
            }}
            className="px-4 py-2 text-[13px] text-[#374151] border border-[#d1d5db] hover:bg-[#f9fafb] transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}

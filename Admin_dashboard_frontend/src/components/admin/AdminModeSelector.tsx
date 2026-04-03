import { useState, useRef, useEffect } from 'react';
import { useAdminModeEngine } from '../../contexts/AdminModeEngine';
import {
  GraduationCap,
  Briefcase,
  BarChart3,
  Settings,
  ChevronDown,
  Check,
  RotateCcw,
  Eye,
  Minimize2,
  AlertCircle,
} from 'lucide-react';

export function AdminModeSelector() {
  const {
    state,
    switchMode,
    simplifyDashboard,
    resetVisibility,
    showEverything,
    toggleTooltips,
  } = useAdminModeEngine();

  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowResetConfirm(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // All modes defined for internal compatibility (used for icon/config lookups)
  const allModes = [
    {
      id: 'onboarding' as const,
      name: 'Onboarding',
      description: 'Simplified view with guided setup',
      icon: GraduationCap,
      color: 'text-[#6b7280]',
      hoverColor: 'group-hover:text-[var(--brand-primary)]',
      bg: 'bg-[#f9fafb]',
      hoverBg: 'group-hover:bg-[var(--brand-primary)]/10',
    },
    {
      id: 'operational' as const,
      name: 'Operational',
      description: 'Day-to-day management tools',
      icon: Briefcase,
      color: 'text-[#6b7280]',
      hoverColor: 'group-hover:text-[var(--brand-primary)]',
      bg: 'bg-[#f9fafb]',
      hoverBg: 'group-hover:bg-[var(--brand-primary)]/10',
    },
    {
      id: 'analytical' as const,
      name: 'Analytical',
      description: 'Insights and performance tracking',
      icon: BarChart3,
      color: 'text-[#6b7280]',
      hoverColor: 'group-hover:text-[var(--brand-primary)]',
      bg: 'bg-[#f9fafb]',
      hoverBg: 'group-hover:bg-[var(--brand-primary)]/10',
    },
    {
      id: 'power' as const,
      name: 'Power',
      description: 'Full control with all features',
      icon: Settings,
      color: 'text-[#6b7280]',
      hoverColor: 'group-hover:text-[var(--brand-primary)]',
      bg: 'bg-[#f9fafb]',
      hoverBg: 'group-hover:bg-[var(--brand-primary)]/10',
    },
  ];

  // Only show Operational mode in the UI
  const modes = allModes.filter(mode => mode.id === 'operational');

  const currentModeConfig = allModes.find((m) => m.id === state.currentMode);
  const CurrentIcon = currentModeConfig?.icon || Briefcase;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Mode Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 px-2 -mx-2 hover:bg-[#f9fafb] transition-colors group"
      >
        {/* Icon */}
        <div className="w-7 h-7 flex items-center justify-center rounded bg-[#f9fafb] group-hover:bg-[var(--brand-primary)]/10 transition-colors">
          <CurrentIcon className="w-4 h-4 text-[#6b7280] group-hover:text-[var(--brand-primary)] transition-colors" />
        </div>

        {/* Text Label */}
        <div className="text-left">
          <p className="text-[11px] text-[#9ca3af]">Admin Mode</p>
          <p className="text-[12px] text-[#374151] group-hover:text-[#111827] transition-colors">
            {currentModeConfig?.name}
          </p>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#9ca3af] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />

        {/* Manual Override Indicator */}
        {state.manualOverride && (
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#3b82f6] rounded-full" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full right-0 mt-2 w-[380px] bg-white border border-[#e5e7eb] shadow-xl z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#e5e7eb]">
              <h3 className="text-[13px] text-[#111827]">Select Admin Mode</h3>
              <p className="text-[11px] text-[#6b7280]">
                Choose the experience that fits your current task
              </p>
            </div>

            {/* Mode Selection */}
            <div className="p-2">
              {modes.map((mode) => {
                const Icon = mode.icon;
                const isActive = state.currentMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      switchMode(mode.id, 'manual');
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 flex items-start gap-3 transition-all relative group ${
                      isActive 
                        ? 'bg-[var(--brand-primary)]/5' 
                        : 'hover:bg-[#f9fafb]'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--brand-primary)]" />
                    )}

                    {/* Mode Icon */}
                    <div className={`w-9 h-9 flex items-center justify-center ${mode.bg} ${mode.hoverBg} rounded flex-shrink-0 transition-colors`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--brand-primary)]' : mode.color} ${mode.hoverColor} transition-colors`} />
                    </div>

                    {/* Mode Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[13px] ${isActive ? 'text-[#111827]' : 'text-[#374151]'}`}>
                          {mode.name}
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-[var(--brand-primary)]" />}
                      </div>
                      <p className="text-[11px] text-[#6b7280]">{mode.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Temporary Overrides Status */}
            {(state.temporaryOverrides.simplifiedDashboard || state.temporaryOverrides.showEverything) && (
              <div className="mx-3 mb-3 px-3 py-2 bg-[#fef3c7] border-l-2 border-[#f59e0b] flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#92400e] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#92400e]">
                  {state.temporaryOverrides.simplifiedDashboard && 'Dashboard simplified (session only)'}
                  {state.temporaryOverrides.showEverything && 'Showing everything (session only)'}
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="border-t border-[#e5e7eb] p-3 bg-[#fafafa]">
              <h4 className="text-[11px] text-[#6b7280] mb-2">Quick Actions</h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    simplifyDashboard();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[12px] text-[#374151] hover:bg-white hover:text-[#111827] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={state.temporaryOverrides.simplifiedDashboard}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  Simplify Dashboard
                  {state.temporaryOverrides.simplifiedDashboard && (
                    <span className="text-[10px] text-[#6b7280] ml-auto">Active</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!showResetConfirm) {
                      setShowResetConfirm(true);
                    } else {
                      resetVisibility();
                      setShowResetConfirm(false);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 text-[12px] transition-colors flex items-center gap-2 ${
                    showResetConfirm
                      ? 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
                      : 'text-[#374151] hover:bg-white hover:text-[#111827]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {showResetConfirm ? 'Confirm Reset?' : 'Reset Visibility'}
                </button>

                <button
                  onClick={() => {
                    showEverything();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[12px] text-[#374151] hover:bg-white hover:text-[#111827] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={state.temporaryOverrides.showEverything}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Show Everything
                  {state.temporaryOverrides.showEverything && (
                    <span className="text-[10px] text-[#6b7280] ml-auto">Active</span>
                  )}
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="border-t border-[#e5e7eb] px-4 py-3">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={state.showTooltips}
                  onChange={(e) => toggleTooltips(e.target.checked)}
                  className="w-4 h-4 accent-[var(--brand-primary)]" />
                <span className="text-[12px] text-[#374151] group-hover:text-[#111827]">
                  Show contextual help tooltips
                </span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useAdminIntelligence } from '../../contexts/AdminIntelligenceContext';
import {
  GraduationCap,
  Zap,
  BarChart3,
  Sparkles,
  ChevronDown,
  Check,
  RotateCcw,
  Eye,
  Minimize2,
} from 'lucide-react';

export function AdminStateIndicator() {
  const {
    intelligence,
    setManualOverride,
    simplifyDashboard,
    resetFeatureVisibility,
    showEverything,
    updatePreference,
  } = useAdminIntelligence();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const states = [
    {
      id: 'onboarding' as const,
      name: 'Onboarding Mode',
      description: 'Simplified view with guided setup',
      icon: GraduationCap,
    },
    {
      id: 'operational' as const,
      name: 'Operational Mode',
      description: 'Day-to-day management tools',
      icon: Zap,
    },
    {
      id: 'analytical' as const,
      name: 'Analytical Mode',
      description: 'Insights and performance tracking',
      icon: BarChart3,
    },
    {
      id: 'power' as const,
      name: 'Power Mode',
      description: 'Full control with all features',
      icon: Sparkles,
    },
  ];

  const currentState = states.find((s) => s.id === intelligence.finalState);
  const CurrentIcon = currentState?.icon || Zap;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-[#d1d5db] bg-white hover:bg-[#f9fafb] transition-colors"
      >
        <CurrentIcon className="w-4 h-4 text-[#374151]" />
        <span className="text-[12px] text-[#111827]">{currentState?.name.replace(' Mode', '')}</span>
        <ChevronDown className={`w-3 h-3 text-[#6b7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[320px] bg-white border border-[#d1d5db] shadow-lg z-50">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h3 className="text-[13px] text-[#111827] mb-1">Admin Mode</h3>
            <p className="text-[11px] text-[#6b7280]">
              Current: {intelligence.finalState}
              {intelligence.manualOverride && ' (manual override)'}
            </p>
          </div>

          <div className="p-2">
            {states.map((state) => {
              const Icon = state.icon;
              const isActive = intelligence.finalState === state.id;

              return (
                <button
                  key={state.id}
                  onClick={() => {
                    setManualOverride(state.id === intelligence.detectedState ? null : state.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 flex items-start gap-3 hover:bg-[#f9fafb] transition-colors ${
                    isActive ? 'bg-[#f0f9ff]' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#6b7280] flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] text-[#374151]">{state.name}</span>
                      {isActive && <Check className="w-3 h-3 text-[#3b82f6]" />}
                    </div>
                    <p className="text-[11px] text-[#6b7280]">{state.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[#e5e7eb] p-3 bg-[#f9fafb]">
            <h4 className="text-[11px] text-[#6b7280] uppercase mb-2">Quick Actions</h4>
            <div className="space-y-1">
              <button
                onClick={() => {
                  simplifyDashboard();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-[12px] text-[#374151] hover:bg-white flex items-center gap-2"
              >
                <Minimize2 className="w-3 h-3" />
                Simplify Dashboard
              </button>
              <button
                onClick={() => {
                  resetFeatureVisibility();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-[12px] text-[#374151] hover:bg-white flex items-center gap-2"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Visibility
              </button>
              <button
                onClick={() => {
                  showEverything();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-[12px] text-[#374151] hover:bg-white flex items-center gap-2"
              >
                <Eye className="w-3 h-3" />
                Show Everything
              </button>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={intelligence.preferences.showExplanations}
                onChange={(e) => updatePreference('showExplanations', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-[11px] text-[#374151]">Show tooltips</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

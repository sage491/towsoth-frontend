import { useState, useRef, useEffect } from 'react';
import { useUserPreferences, ExperienceMode } from '../../contexts/UserPreferencesContext';
import { Zap, GraduationCap, Sparkles, ChevronDown, Check } from 'lucide-react';

export function ExperienceModeToggle() {
  const { preferences, setExperienceMode } = useUserPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const modes: Array<{
    id: ExperienceMode;
    label: string;
    description: string;
    icon: typeof Zap;
  }> = [
    {
      id: 'basic',
      label: 'Basic Mode',
      description: 'Essential features only - perfect for getting started',
      icon: GraduationCap,
    },
    {
      id: 'standard',
      label: 'Standard Mode',
      description: 'Balanced experience with key analytics and modules',
      icon: Zap,
    },
    {
      id: 'advanced',
      label: 'Advanced Mode',
      description: 'Full power - all features, analytics, and AI tools',
      icon: Sparkles,
    },
  ];

  const currentMode = modes.find(m => m.id === preferences.experienceMode);
  const CurrentIcon = currentMode?.icon || Zap;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-[#d1d5db] bg-white hover:bg-[#f9fafb] transition-colors text-[13px] text-[#374151]"
      >
        <CurrentIcon className="w-4 h-4" />
        <span>{currentMode?.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[320px] bg-white border border-[#d1d5db] shadow-lg z-50">
          <div className="p-3 border-b border-[#e5e7eb]">
            <h3 className="text-[13px] text-[#111827]">Admin Experience Mode</h3>
            <p className="text-[11px] text-[#6b7280] mt-1">
              Customize your dashboard complexity
            </p>
          </div>

          <div className="p-2">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = preferences.experienceMode === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    setExperienceMode(mode.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 flex items-start gap-3 hover:bg-[#f9fafb] transition-colors ${
                    isActive ? 'bg-[#f0f9ff] border border-[#bae6fd]' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    isActive ? 'text-[#0284c7]' : 'text-[#6b7280]'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] ${
                        isActive ? 'text-[#0284c7]' : 'text-[#111827]'
                      }`}>
                        {mode.label}
                      </span>
                      {isActive && <Check className="w-3 h-3 text-[#0284c7]" />}
                    </div>
                    <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-[#f9fafb] border-t border-[#e5e7eb]">
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              💡 <span className="text-[#374151]">Tip:</span> You can switch modes anytime without losing data
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

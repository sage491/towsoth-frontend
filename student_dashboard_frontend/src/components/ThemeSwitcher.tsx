import { useState, useEffect, useRef } from 'react';
import { Palette, Sun, Moon, Coffee, FileText, Minimize2 } from 'lucide-react';

type Theme = 'light' | 'dark' | 'warm' | 'mono' | 'dim';

interface ThemeOption {
  id: Theme;
  label: string;
  description: string;
  icon: typeof Sun;
}

const themes: ThemeOption[] = [
  {
    id: 'light',
    label: 'Minimal Light',
    description: 'Clean, bright workspace',
    icon: Sun,
  },
  {
    id: 'dark',
    label: 'Deep Focus Dark',
    description: 'Night study mode',
    icon: Moon,
  },
  {
    id: 'warm',
    label: 'Warm Study',
    description: 'Low contrast, easy on eyes',
    icon: Coffee,
  },
  {
    id: 'mono',
    label: 'Night Mono',
    description: 'Black/gray only',
    icon: FileText,
  },
  {
    id: 'dim',
    label: 'Calm Paper',
    description: 'Off-white, print-like',
    icon: Minimize2,
  },
];

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('towsoth_theme') as Theme | null;
    if (saved) {
      setCurrentTheme(saved);
      applyTheme(saved);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('towsoth_theme', theme);
    setCurrentTheme(theme);
  };

  const handleThemeChange = (theme: Theme) => {
    applyTheme(theme);
    setTimeout(() => setIsOpen(false), 150);
  };

  const currentThemeLabel = themes.find(t => t.id === currentTheme)?.label || 'Theme';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
        style={{
          background: isOpen ? 'var(--bg-secondary)' : 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        }}
        title="Change theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden md:inline">{currentThemeLabel}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 animate-fadeIn z-50"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <div 
            className="p-4" 
            style={{ 
              borderBottom: '1px solid var(--border-soft)',
              background: 'var(--bg-card)',
            }}
          >
            <div className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Appearance
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Choose theme for study endurance
            </div>
          </div>

          <div className="p-2" style={{ background: 'var(--bg-card)' }}>
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isActive = currentTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-all duration-200 theme-option-button ${isActive ? 'active' : ''}`}
                  style={{
                    background: isActive ? 'var(--accent-soft)' : 'var(--bg-card)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--bg-card)';
                    }
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <div className="flex-1">
                    <div 
                      className="text-xs transition-all duration-200 theme-option-title"
                      style={{ 
                        color: 'var(--text-primary)',
                      }}
                    >
                      {theme.label}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {theme.description}
                    </div>
                  </div>
                  {isActive && (
                    <div 
                      className="w-2 h-2" 
                      style={{ 
                        background: 'var(--accent-primary)',
                        borderRadius: '2px',
                      }} 
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div 
            className="p-3" 
            style={{ 
              borderTop: '1px solid var(--border-soft)', 
              background: 'var(--bg-secondary)',
            }}
          >
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Designed for 4-6 hour study sessions. No reload needed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
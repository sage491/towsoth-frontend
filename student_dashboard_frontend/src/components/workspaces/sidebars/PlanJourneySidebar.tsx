import { Target, ListChecks, TrendingUp, Calendar, Lightbulb, ArrowLeft, BarChart3 } from 'lucide-react';

interface PlanJourneySidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onNavigateToDashboard?: () => void;
}

export function PlanJourneySidebar({ currentSection, onSectionChange, collapsed, onNavigateToDashboard }: PlanJourneySidebarProps) {
  const sections = [
    { id: 'tasks', label: 'Daily Tasks', icon: ListChecks },
    { id: 'goals', label: 'Goals & Targets', icon: Target },
    { id: 'career', label: 'Career Plan', icon: TrendingUp, highlight: true },
    { id: 'progress', label: 'Progress Tracking', icon: Calendar },
    { id: 'analytics', label: 'Progress Analytics', icon: BarChart3 },
    { id: 'mentor', label: 'AI Mentor', icon: Lightbulb },
  ];

  return (
    <div 
      style={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: collapsed ? '60px' : '280px',
        transition: 'width 300ms',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40
      }}
    >
      {/* ========== BACK TO DASHBOARD BUTTON - PUSHED DOWN BELOW HEADER ========== */}
      <div 
        style={{ 
          marginTop: '72px',
          padding: '12px 12px 8px 12px',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0
        }}
      >
        <button
          onClick={() => {
            console.log('Back to Dashboard clicked!');
            if (onNavigateToDashboard) {
              onNavigateToDashboard();
            } else {
              alert('Navigate to Dashboard - function not connected');
            }
          }}
          style={{ 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '8px',
            padding: collapsed ? '8px' : '8px 12px',
            backgroundColor: 'transparent',
            color: '#5B5F8D',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#5B5F8D';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <ArrowLeft style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          {!collapsed && <span>Dashboard</span>}
        </button>
      </div>

      {/* Workspace Identity */}
      <div className="h-[64px] flex items-center px-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        {!collapsed && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Plan My Journey</div>
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Strategy Mode</div>
          </div>
        )}
        {collapsed && (
          <Target className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
        )}
      </div>

      {/* Strategy Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className={`${!collapsed && 'px-2'} space-y-0.5`}>
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs transition-all relative"
                style={{
                  background: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 400
                }}
                title={collapsed ? section.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{section.label}</span>}
                {section.highlight && !collapsed && (
                  <div className="absolute right-2 top-2 bg-red-500 text-white text-[10px] px-1 py-0.5 rounded-full">New</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Footer */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
        {!collapsed && (
          <div className="text-[10px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Strategy Mode Active</strong>
            <br />
            Calm reflection. Long-term thinking. No pressure.
          </div>
        )}
      </div>
    </div>
  );
}
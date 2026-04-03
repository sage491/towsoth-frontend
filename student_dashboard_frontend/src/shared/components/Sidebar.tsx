import { 
  LayoutGrid,
  BookOpen,
  ClipboardCheck,
  Target,
  Globe2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Lock,
  BarChart3,
  Trophy,
  Brain
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePreferences } from '@/contexts/PreferencesContext';
import { getPageFromPath, getPathFromPage } from '@/routes/pageRoutes';
import type { RoutePath } from '../config/routes';

const iconMap = {
  LayoutGrid,
  BarChart3,
  Trophy,
  Brain,
  BookOpen,
  ClipboardCheck,
  Target,
  Globe2,
  Settings,
};

interface SidebarNavigationItem {
  icon: keyof typeof iconMap;
  label: string;
  id: RoutePath;
  essential: boolean;
  description?: string;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  navigationItems: SidebarNavigationItem[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed, onToggle, navigationItems, mobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences } = usePreferences();
  const currentPage = getPageFromPath(location.pathname);

  const handleNavigate = (page: RoutePath) => {
    navigate(getPathFromPage(page));
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 top-[64px]"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200 overflow-y-auto transition-all duration-300 z-40 ${
          collapsed ? 'w-[60px]' : 'w-[260px]'
        } ${
          mobileOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'
        } fixed left-0 top-[64px] bottom-0 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:flex-shrink-0 lg:w-auto`}
      >
        <nav className="p-2 space-y-0">
          {navigationItems.map((item, index) => {
            const Icon = iconMap[item.icon];
            const isDashboard = index === 0;
            const isActive = currentPage === item.id;
            const isLocked = preferences.focusMode && !item.essential;
            
            return (
              <div key={item.label}>
                {/* Toggle button above Dashboard */}
                {isDashboard && (
                  <div className="px-3 py-2 flex items-center justify-between">
                    {!collapsed && <span className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">Navigation</span>}
                    <button
                      onClick={onToggle}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-900 rounded flex items-center justify-center transition-colors shadow-sm"
                      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                      {collapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <ChevronLeft className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => !isLocked && handleNavigate(item.id)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs transition-all relative group ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : isLocked
                      ? 'text-slate-400 cursor-not-allowed opacity-60'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={collapsed ? (isLocked ? `${item.label} (Focus Mode)` : item.label) : undefined}
                >
                  {isActive && !isLocked && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                  )}
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <div>{item.label}</div>
                      {item.description && (
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                  {!collapsed && isLocked && (
                    <Lock className="w-3 h-3 text-slate-400" />
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {item.label}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {!collapsed && (
          <>
            {/* Session Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 bg-slate-50">
              <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-1 font-semibold">Study Session</div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">4h 23m</span>
                <span className="text-[10px] text-slate-600">Today</span>
              </div>
            </div>
          </>
        )}

        {/* Collapsed state - minimal indicators */}
        {collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col items-center gap-2">
              <div className="text-[9px] text-emerald-700 font-bold">↑</div>
              <div className="text-[8px] text-slate-900 font-bold">8.7</div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
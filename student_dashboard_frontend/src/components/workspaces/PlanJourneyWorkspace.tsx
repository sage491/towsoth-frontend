import { useEffect, useState } from 'react';
import { PlanJourneySidebar } from './sidebars/PlanJourneySidebar';
import { FutureIntelligencePage } from '../pages/FutureIntelligencePage';
import { ProgressAnalytics, ProgressTracking } from '@/features/analytics/components';
import { EnhancedDailyTaskSection } from '@/features/planner/components';
import { Brain, ArrowLeft } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import type { RoutePath } from '@/shared/config/routes';
import { ROUTES } from '@/shared/config/routes';

interface WorkspaceLayoutContext {
  mobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

interface PlanJourneyWorkspaceProps {
  onNavigate: (page: RoutePath) => void;
  focusModeActive?: boolean;
  onExitFocusMode?: () => void;
}

export function PlanJourneyWorkspace({ onNavigate, focusModeActive = false, onExitFocusMode }: PlanJourneyWorkspaceProps) {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const sidebarCollapsed = false;
  const [showFocusConfirm, setShowFocusConfirm] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
  const { shouldShowRank } = usePreferences();
  const { mobileSidebarOpen, closeMobileSidebar } = useOutletContext<WorkspaceLayoutContext>();
  const allowedSections = ['tasks', 'goals', 'career', 'progress', 'analytics', 'mentor'] as const;
  const currentSection = allowedSections.includes((section ?? '') as (typeof allowedSections)[number]) ? section! : 'tasks';

  useEffect(() => {
    const handleResize = () => setIsCompactViewport(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBackClick = () => {
    if (focusModeActive) {
      setShowFocusConfirm(true);
    } else {
      exitWorkspace();
    }
  };

  const exitWorkspace = () => {
    setShowFocusConfirm(false);
    if (onExitFocusMode) onExitFocusMode();
    onNavigate('dashboard');
  };

  const handleSidebarSectionChange = (section: string) => {
    navigate(`${ROUTES.student['plan-journey']}/${section}`);
    if (isCompactViewport) {
      closeMobileSidebar();
    }
  };

  // Handle navigation from tasks to other workspaces
  const handleTaskNavigation = (page: RoutePath, _tab?: string) => {
    onNavigate(page);
    // If we need to set a specific tab in the target workspace, we'd need to pass that through
    // For now, the workspaces will default to their main view
  };

  return (
    <div className="fixed inset-0" style={{ background: 'var(--bg-secondary)' }}>
      {/* Focus Mode Confirmation Modal */}
      {showFocusConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="max-w-md p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
            <div className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              You're leaving focus mode
            </div>
            <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
              Return to dashboard?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFocusConfirm(false)}
                className="flex-1 px-4 py-2.5 text-xs font-bold"
                style={{ 
                  background: 'var(--accent-primary)',
                  color: '#ffffff'
                }}
              >
                Continue Focus
              </button>
              <button
                onClick={exitWorkspace}
                className="flex-1 px-4 py-2.5 text-xs font-bold"
                style={{ 
                  background: 'transparent',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workspace-Specific Sidebar */}
      {!isCompactViewport && (
        <PlanJourneySidebar
          currentSection={currentSection}
          onSectionChange={handleSidebarSectionChange}
          collapsed={sidebarCollapsed}
          onNavigateToDashboard={exitWorkspace}
        />
      )}

      {isCompactViewport && mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 top-[64px]"
            onClick={closeMobileSidebar}
          />
          <PlanJourneySidebar
            currentSection={currentSection}
            onSectionChange={handleSidebarSectionChange}
            collapsed={sidebarCollapsed}
            onNavigateToDashboard={exitWorkspace}
          />
        </>
      )}

      {/* Workspace Content Area */}
      <div
        className="absolute top-0 right-0 bottom-0 overflow-y-auto"
        style={{
          left: isCompactViewport ? '0px' : (sidebarCollapsed ? '60px' : '280px'),
          transition: 'left 300ms',
          background: 'var(--bg-secondary)'
        }}
      >
        {/* Workspace Header with Back Button */}
        <div className={`${isCompactViewport ? 'sticky top-0 z-30 px-4 pt-4 pb-3' : 'sticky top-0 z-30 px-6 pt-6 pb-3'}`} style={{ background: 'var(--bg-secondary)' }}>
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-xs font-medium hover:opacity-70 transition-opacity mb-4"
            style={{ color: 'var(--accent-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Go to Dashboard</span>
          </button>

        </div>

        {/* Section Content */}
        <div className={`${isCompactViewport ? 'px-4 pb-12' : 'px-6 pb-12'}`}>
          {currentSection === 'tasks' && (
            <EnhancedDailyTaskSection onNavigate={handleTaskNavigation} />
          )}

          {currentSection === 'goals' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Goals & Targets</h1>
                <p className="text-sm text-slate-600">
                  Set realistic goals and track your progress toward them
                </p>
              </div>

              <div className={isCompactViewport ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-2 gap-6'}>
                {/* Rank Goal */}
                {shouldShowRank() && (
                  <div className="bg-blue-50 border-2 border-blue-200 p-6">
                    <div className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wider">
                      Rank Target
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <div className="text-4xl font-bold text-slate-900">AIR 150</div>
                      <div className="text-sm text-slate-600">by JEE Main</div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Current Rank</span>
                        <span className="font-bold text-slate-900">#847</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Gap to Target</span>
                        <span className="font-bold text-red-600">-697 ranks</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Time Remaining</span>
                        <span className="font-bold text-slate-900">4 months</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-blue-200">
                      <div className="text-xs text-blue-900 mb-2 font-bold">AI Prediction</div>
                      <p className="text-xs text-blue-800">
                        At current pace: <strong>AIR 245</strong>. Add 45 mins/day to reach target.
                      </p>
                    </div>
                  </div>
                )}

                {/* Syllabus Goal */}
                <div className="bg-emerald-50 border-2 border-emerald-200 p-6">
                  <div className="text-xs font-bold text-emerald-900 mb-2 uppercase tracking-wider">
                    Syllabus Target
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <div className="text-4xl font-bold text-slate-900">100%</div>
                    <div className="text-sm text-slate-600">completion</div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Completed</span>
                      <span className="font-bold text-emerald-600">67%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">In Progress</span>
                      <span className="font-bold text-blue-600">12%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Pending</span>
                      <span className="font-bold text-orange-600">21%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5">
                    <div className="bg-emerald-600 h-2.5" style={{ width: '67%' }} />
                  </div>
                </div>

                {/* Study Time Goal */}
                <div className="bg-purple-50 border-2 border-purple-200 p-6">
                  <div className="text-xs font-bold text-purple-900 mb-2 uppercase tracking-wider">
                    Study Time Target
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <div className="text-4xl font-bold text-slate-900">6h</div>
                    <div className="text-sm text-slate-600">per day</div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Today</span>
                      <span className="font-bold text-slate-900">4h 23m</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">This Week Avg</span>
                      <span className="font-bold text-emerald-600">5h 45m</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Focus Streak</span>
                      <span className="font-bold text-orange-600">7 days</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-purple-200">
                    <div className="text-xs font-bold text-purple-800">✓ On track this week</div>
                  </div>
                </div>

                {/* Weak Topics Goal */}
                <div className="bg-orange-50 border-2 border-orange-200 p-6">
                  <div className="text-xs font-bold text-orange-900 mb-2 uppercase tracking-wider">
                    Weak Topics Target
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <div className="text-4xl font-bold text-slate-900">0</div>
                    <div className="text-sm text-slate-600">weak areas</div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Current</span>
                      <span className="font-bold text-red-600">3 weak</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Improving</span>
                      <span className="font-bold text-blue-600">2 topics</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Fixed This Month</span>
                      <span className="font-bold text-emerald-600">5 topics</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2.5 bg-orange-600 text-white text-xs font-bold hover:bg-orange-700">
                    View Fix Plans
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentSection === 'career' && (
            <FutureIntelligencePage />
          )}

          {currentSection === 'progress' && (
            <ProgressTracking />
          )}

          {currentSection === 'analytics' && (
            <ProgressAnalytics />
          )}

          {currentSection === 'mentor' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">AI Mentor</h1>
                <p className="text-sm text-slate-600">
                  Personalized strategic guidance and long-term planning assistance
                </p>
              </div>

              <div className="bg-white border-2 border-emerald-200 p-6">
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">AI Mentor Coming Soon</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your personal AI mentor for strategic guidance, reflection, and long-term planning will be available here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
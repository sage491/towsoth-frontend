import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { TestsGuidelinesSidebar } from './sidebars/TestsGuidelinesSidebar';
import { TestsPage } from '../pages/TestsPage';
import { EnhancedPerformanceAnalytics } from '@/features/analytics/components';
import { MistakeAnalysis } from '../MistakeAnalysis';
import { FixPlanDetail } from '../FixPlanDetail';
import { PYQSection, RecentResultsSection } from '@/features/tests/components';
import { EnterpriseTestWindow, type TestResults } from '@/features/subjects/components';
import { Target, ArrowLeft } from 'lucide-react';
import type { RoutePath } from '@/shared/config/routes';
import { ROUTES } from '@/shared/config/routes';

interface MistakeCluster {
  cluster: string;
  topics: string[];
  frequency: number;
  severity: 'High' | 'Medium' | 'Low';
  impact: string;
}

interface TestsGuidelinesWorkspaceProps {
  onNavigate: (page: RoutePath) => void;
  focusModeActive?: boolean;
  onExitFocusMode?: () => void;
  initialSection?: string;
}

interface WorkspaceLayoutContext {
  mobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

export function TestsGuidelinesWorkspace({ onNavigate, focusModeActive = false, onExitFocusMode, initialSection = 'analytics' }: TestsGuidelinesWorkspaceProps) {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const [sidebarCollapsed] = useState(false);
  const [showFocusConfirm, setShowFocusConfirm] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
  const [selectedMistake, setSelectedMistake] = useState<MistakeCluster | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [retakeTestData, setRetakeTestData] = useState<{ name: string; subject: string } | null>(null);
  const [, setTestResults] = useState<TestResults | null>(null);
  const { mobileSidebarOpen, closeMobileSidebar } = useOutletContext<WorkspaceLayoutContext>();

  const allowedSections = ['upcoming', 'pyq', 'results', 'mistakes', 'fix-plans', 'analytics'] as const;
  const isAllowedSection = (value?: string): value is (typeof allowedSections)[number] => {
    return Boolean(value) && allowedSections.includes(value as (typeof allowedSections)[number]);
  };

  const fallbackSection = isAllowedSection(initialSection) ? initialSection : 'analytics';
  const currentSection = isAllowedSection(section) ? section : fallbackSection;

  useEffect(() => {
    const handleResize = () => setIsCompactViewport(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarSectionChange = (section: string) => {
    navigate(`${ROUTES.student['tests-guidelines']}/${section}`);
    if (isCompactViewport) {
      closeMobileSidebar();
    }
  };

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

  const handleRetakeTest = (testName: string, subject: string) => {
    const searchParams = new URLSearchParams({
      topic: testName,
      subject,
      returnTo: ROUTES.student['tests-guidelines'],
    });

    navigate(`${ROUTES.student['test-window']}?${searchParams.toString()}`);
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

      {/* Workspace-Specific Sidebar - Hidden during test */}
      {!isTestActive && !isCompactViewport && (
        <TestsGuidelinesSidebar
          currentSection={currentSection}
          onSectionChange={handleSidebarSectionChange}
          collapsed={sidebarCollapsed}
          onNavigateToDashboard={exitWorkspace}
        />
      )}

      {!isTestActive && isCompactViewport && mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 top-[64px]"
            onClick={closeMobileSidebar}
          />
          <TestsGuidelinesSidebar
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
          left: isTestActive || isCompactViewport ? '0' : (sidebarCollapsed ? '60px' : '280px'),
          transition: 'left 300ms',
          background: 'var(--bg-secondary)'
        }}
      >
        {/* Workspace Header with Back Button - Hidden during test */}
        {!isTestActive && (
          <div className="sticky top-0 z-30 px-6 pt-6 pb-3" style={{ background: 'var(--bg-secondary)' }}>
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-xs font-medium hover:opacity-70 transition-opacity mb-4"
              style={{ color: 'var(--accent-primary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Go to Dashboard</span>
            </button>
          </div>
        )}

        {/* Section Content */}
        <div className={isTestActive ? '' : 'px-6 pb-12'}>
          {currentSection === 'upcoming' && (
            <div>
              {!isTestActive && (
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Upcoming Tests</h1>
                  <p className="text-sm text-slate-600">
                    Scheduled assessments with preparation status and guidelines
                  </p>
                </div>
              )}
              <TestsPage onTestStateChange={setIsTestActive} />
            </div>
          )}

          {currentSection === 'pyq' && (
            <PYQSection />
          )}

          {currentSection === 'results' && (
            <>
              {/* Test Window for Retakes from Results */}
              {isTestActive && retakeTestData ? (
                <EnterpriseTestWindow
                  subject={retakeTestData.subject}
                  topic={retakeTestData.name}
                  onBack={() => {
                    setIsTestActive(false);
                    setRetakeTestData(null);
                  }}
                  onSubmit={(results) => {
                    setTestResults(results);
                    setIsTestActive(false);
                    setRetakeTestData(null);
                  }}
                />
              ) : (
                <RecentResultsSection onRetakeTest={handleRetakeTest} />
              )}
            </>
          )}

          {currentSection === 'mistakes' && (
            <>
              {!selectedMistake ? (
                <MistakeAnalysis onViewFixPlan={setSelectedMistake} />
              ) : (
                <FixPlanDetail 
                  cluster={selectedMistake} 
                  onBack={() => setSelectedMistake(null)} 
                />
              )}
            </>
          )}

          {currentSection === 'fix-plans' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">AI Fix Plans</h1>
                <p className="text-sm text-slate-600">
                  Personalized improvement strategies based on your mistake clusters
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Fix Conceptual Confusion in EM Induction',
                    severity: 'High',
                    estimatedTime: '3 hours',
                    steps: [
                      'Watch 2 visual explainers on Lenz Law',
                      'Solve 10 guided conceptual problems',
                      'Take EM Induction topic test',
                      'Review mistakes with detailed solutions'
                    ],
                    expectedImprovement: '+12 marks',
                    status: 'Ready to start'
                  },
                  {
                    title: 'Improve Calculation Speed in Rotational Dynamics',
                    severity: 'Medium',
                    estimatedTime: '2 hours',
                    steps: [
                      'Practice 15 numerical problems',
                      'Review formula sheet',
                      'Timed practice set (20 mins)',
                      'Analyze time management'
                    ],
                    expectedImprovement: '+6 marks',
                    status: 'In progress (40%)'
                  },
                ].map((plan, idx) => (
                  <div key={idx} className="bg-white border-2 border-blue-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900 mb-2">{plan.title}</div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2 py-1 text-xs font-bold ${
                            plan.severity === 'High' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {plan.severity} Priority
                          </span>
                          <span className="text-xs text-slate-600">⏱ {plan.estimatedTime}</span>
                          <span className="text-xs font-bold text-emerald-600">{plan.expectedImprovement}</span>
                        </div>
                      </div>
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="bg-slate-50 p-4 mb-4">
                      <div className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">Fix Steps</div>
                      <ol className="space-y-2">
                        {plan.steps.map((step, sidx) => (
                          <li key={sidx} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="text-slate-400 font-bold">{sidx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">
                        {plan.status === 'Ready to start' ? 'Start Fix Plan' : 'Continue Plan'}
                      </button>
                      {plan.status !== 'Ready to start' && (
                        <div className="text-xs text-slate-600">{plan.status}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSection === 'analytics' && (
            <EnhancedPerformanceAnalytics />
          )}
        </div>
      </div>
    </div>
  );
}

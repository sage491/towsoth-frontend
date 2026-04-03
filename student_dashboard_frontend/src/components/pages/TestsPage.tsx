import { Clock, AlertCircle, TrendingUp, TrendingDown, Target, Play, BarChart3, Zap, List, LayoutGrid } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnterpriseTestWindow, TestAnalyticsPage, type TestResults } from '@/features/subjects/components';
import { Skeleton } from '@/components/ui/skeleton';
import { getCompletedTests, getUpcomingTests } from '@/features/tests/services';
import type { CompletedTestItem, UpcomingTestItem } from '@/features/tests/services';
import { ROUTES } from '@/shared/config/routes';

type ViewMode = 'list' | 'cards';

interface TestsPageProps {
  onTestStateChange?: (isTestActive: boolean) => void;
}

export function TestsPage({ onTestStateChange }: TestsPageProps = {}) {
  const navigate = useNavigate();
  const [upcomingTests, setUpcomingTests] = useState<UpcomingTestItem[]>([]);
  const [completedTests, setCompletedTests] = useState<CompletedTestItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [currentView, setCurrentView] = useState<'tests' | 'test-window' | 'analytics'>('tests');
  const [selectedTestData, setSelectedTestData] = useState<{ name: string; subject: string } | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('towsoth_tests_view') as ViewMode | null;
    if (saved) setViewMode(saved);
  }, []);

  useEffect(() => {
    if (onTestStateChange) {
      onTestStateChange(currentView === 'test-window');
    }
  }, [currentView, onTestStateChange]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getUpcomingTests(), getCompletedTests()])
      .then(([upcoming, completed]) => {
        if (!isMounted) return;
        setUpcomingTests(upcoming);
        setCompletedTests(completed);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoadingData(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('towsoth_tests_view', mode);
  };

  const handleStartTest = (testName: string, subject: string) => {
    const searchParams = new URLSearchParams({
      topic: testName,
      subject,
      returnTo: ROUTES.student['tests-guidelines'],
    });

    navigate(`${ROUTES.student['test-window']}?${searchParams.toString()}`);
  };

  if (currentView === 'test-window' && selectedTestData) {
    return (
      <EnterpriseTestWindow
        subject={selectedTestData.subject}
        topic={selectedTestData.name}
        onBack={() => {
          setCurrentView('tests');
          setSelectedTestData(null);
        }}
        onSubmit={(results) => {
          setTestResults(results);
          setCurrentView('analytics');
        }}
      />
    );
  }

  if (currentView === 'analytics' && testResults) {
    return (
      <TestAnalyticsPage
        results={testResults}
        onBack={() => {
          setCurrentView('tests');
          setTestResults(null);
          setSelectedTestData(null);
        }}
        onRetakeTest={() => {
          setCurrentView('test-window');
        }}
        onReviewAnswers={() => {
        }}
        onStartPractice={() => {
          setCurrentView('tests');
        }}
      />
    );
  }

  if (isLoadingData) {
    return (
      <div className="space-y-5 w-full">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full">
      {/* Page Header */}
      <div className="border-l-4 pl-4" style={{ borderColor: 'var(--accent-primary, #5B5F8D)' }}>
        <h1 className="text-xl font-bold text-slate-900">Tests & Feedback Loops</h1>
        <p className="text-sm text-slate-600">Every test is a learning opportunity • Recursive improvement system</p>
      </div>

      {/* Main Layout: Left = Tests, Right = AI */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5 items-start w-full">
        {/* LEFT: Tests Section (2/3 width) */}
        <div className="space-y-4 min-w-0">
          {/* Tab Switcher with View Toggle */}
          <div className="flex flex-col sm:flex-row sm:flex-nowrap sm:items-center justify-between gap-3 bg-white border border-slate-200 p-1">
            <div className="flex flex-1 min-w-0 gap-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming ({upcomingTests.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({completedTests.length})
              </button>
            </div>

            {/* View Toggle - Only show for upcoming tests */}
            {activeTab === 'upcoming' && (
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200">
                <button
                  onClick={() => handleViewChange('list')}
                  title="List View"
                  className="p-1.5 transition-all"
                  style={{
                    background: viewMode === 'list' ? '#1e293b' : 'transparent',
                    color: viewMode === 'list' ? '#ffffff' : '#64748b',
                  }}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleViewChange('cards')}
                  title="Card View"
                  className="p-1.5 transition-all"
                  style={{
                    background: viewMode === 'cards' ? '#1e293b' : 'transparent',
                    color: viewMode === 'cards' ? '#ffffff' : '#64748b',
                  }}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Tests */}
          {activeTab === 'upcoming' && (
            <div>
              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-3">
                  {upcomingTests.map((test) => {
                    const isCritical = test.priority === 'critical';
                    const isHigh = test.priority === 'high';
                    const readiness = isCritical ? 64 : isHigh ? 78 : 92;
                    
                    return (
                      <div
                        key={test.id}
                        className="bg-white border-2 border-slate-200 hover:border-slate-300 transition-all"
                      >
                        {/* Subtle top indicator for priority */}
                        {isCritical && (
                          <div className="h-1 bg-slate-400"></div>
                        )}
                        
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-slate-900">{test.name}</h3>
                                {isCritical && (
                                  <div className="px-2 py-0.5 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wide">
                                    Due Soon
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{test.date} • {test.time}</span>
                                </div>
                                <div className="text-slate-400">|</div>
                                <span>Duration: {test.duration}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <button
                                  className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-2"
                                  onClick={() => handleStartTest(test.name, 'Physics')}
                                >
                                  <Play className="w-3.5 h-3.5" />
                                  Start Test
                                </button>
                                <button className="px-4 py-2 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold uppercase tracking-wide transition-colors">
                                  View Syllabus
                                </button>
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Preparation</div>
                              <div className={`text-3xl font-bold ${
                                readiness >= 80 ? 'text-slate-900' : 
                                readiness >= 65 ? 'text-slate-700' : 
                                'text-slate-600'
                              }`}>
                                {readiness}%
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1">readiness</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Quick Practice */}
                  <div className="bg-slate-50 border-2 border-slate-200 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                          Quick Practice
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Adaptive Quiz Mode</h3>
                        <p className="text-xs text-slate-600 mt-1">
                          AI-selected questions • Instant feedback • No rank pressure
                        </p>
                      </div>
                      <button
                        className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors"
                        onClick={() => handleStartTest('Adaptive Quiz Mode', 'Mixed')}
                      >
                        Start Quiz
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card/Grid View */}
              {viewMode === 'cards' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                    {upcomingTests.map((test) => {
                      const isCritical = test.priority === 'critical';
                      const isHigh = test.priority === 'high';
                      const readiness = isCritical ? 64 : isHigh ? 78 : 92;
                      
                      return (
                        <div
                          key={test.id}
                          className="bg-white border-2 border-slate-200 hover:border-slate-300 transition-all flex flex-col h-full"
                        >
                          {/* Top indicator spacer keeps card content aligned across the row */}
                          <div className={`h-1 ${isCritical ? 'bg-slate-400' : 'bg-transparent'}`}></div>
                          
                          <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-base font-bold text-slate-900 mb-2 min-h-[2.5rem] leading-5">{test.name}</h3>
                                {isCritical && (
                                  <div className="inline-block px-2 py-0.5 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wide mb-2">
                                    Due Soon
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2 mb-4 text-xs text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{test.date} • {test.time}</span>
                              </div>
                              <div>Duration: {test.duration}</div>
                            </div>

                            {/* Readiness */}
                            <div className="mb-4 pb-4 border-b border-slate-200">
                              <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Preparation</div>
                              <div className={`text-2xl font-bold ${
                                readiness >= 80 ? 'text-slate-900' : 
                                readiness >= 65 ? 'text-slate-700' : 
                                'text-slate-600'
                              }`}>
                                {readiness}%
                              </div>
                              <div className="text-[10px] text-slate-500">readiness</div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-auto space-y-2">
                              <button
                                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                                onClick={() => handleStartTest(test.name, 'Physics')}
                              >
                                <Play className="w-3.5 h-3.5" />
                                Start Test
                              </button>
                              <button className="w-full px-4 py-2 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold uppercase tracking-wide transition-colors">
                                View Syllabus
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Practice */}
                  <div className="bg-slate-50 border-2 border-slate-200 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                          Quick Practice
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Adaptive Quiz Mode</h3>
                        <p className="text-xs text-slate-600 mt-1">
                          AI-selected questions • Instant feedback • No rank pressure
                        </p>
                      </div>
                      <button
                        className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors"
                        onClick={() => handleStartTest('Adaptive Quiz Mode', 'Mixed')}
                      >
                        Start Quiz
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Completed Tests */}
          {activeTab === 'completed' && (
            <div className="space-y-3">
              {completedTests.map((test) => (
                <div key={test.id}>
                  {/* Test Header - Always Visible */}
                  <div
                    className={`bg-white border-2 cursor-pointer transition-all ${
                      selectedTest === test.id ? 'border-blue-500' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                  >
                    <div className="p-5 border-b border-slate-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{test.name}</h3>
                            <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                              Analyzed
                            </div>
                          </div>
                          <div className="text-sm text-slate-600">Completed on {test.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-slate-900">
                            {test.score}/{test.maxScore}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">Percentile: {test.percentile}%</div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-3 border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Rank</div>
                          <div className="text-2xl font-bold text-slate-900">{test.rank}</div>
                        </div>
                        <div className="bg-slate-50 p-3 border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Accuracy</div>
                          <div className="text-2xl font-bold text-emerald-600">{test.accuracy}%</div>
                        </div>
                        <div className="bg-slate-50 p-3 border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Speed</div>
                          <div className="text-2xl font-bold text-orange-600">{test.speed}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Analysis */}
                    {selectedTest === test.id && (
                      <div className="p-5 space-y-5">
                        {/* Marks Lost Analysis */}
                        <div className="bg-red-50 border-l-4 border-red-600 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <h4 className="text-xs uppercase tracking-wider text-red-700 font-semibold">
                              Marks Lost Because Of
                            </h4>
                          </div>
                          <p className="text-sm text-slate-900 font-semibold">{test.marksLostReason}</p>
                        </div>

                        {/* Topic-wise Heatmap */}
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                            Topic-wise Performance
                          </h4>
                          <div className="space-y-2">
                            {test.topicBreakdown.map((topic, idx) => (
                              <div key={idx} className="bg-slate-50 p-3 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900">{topic.topic}</span>
                                    {topic.trend === 'rising' && (
                                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                    )}
                                    {topic.trend === 'dropping' && (
                                      <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                                    )}
                                  </div>
                                  <div className="text-sm font-bold text-slate-900">
                                    {topic.correct}/{topic.total}
                                  </div>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5">
                                  <div
                                    className={`h-1.5 ${
                                      topic.accuracy >= 80
                                        ? 'bg-emerald-500'
                                        : topic.accuracy >= 60
                                        ? 'bg-orange-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{ width: `${topic.accuracy}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{topic.accuracy}% accuracy</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Accuracy vs Speed Graph (Visual Representation) */}
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                            Accuracy vs Speed
                          </h4>
                          <div className="bg-slate-50 p-4 border border-slate-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-slate-500 mb-2">Accuracy</div>
                                <div className="w-full bg-slate-200 h-3">
                                  <div className="bg-emerald-500 h-3" style={{ width: `${test.accuracy}%` }}></div>
                                </div>
                                <div className="text-xs text-slate-600 mt-1">{test.accuracy}% • Good</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 mb-2">Speed</div>
                                <div className="w-full bg-slate-200 h-3">
                                  <div className="bg-orange-500 h-3" style={{ width: `${test.speed}%` }}></div>
                                </div>
                                <div className="text-xs text-slate-600 mt-1">{test.speed}% • Needs work</div>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-slate-700 bg-white p-3 border border-slate-200">
                              <strong>Insight:</strong> You're accurate but slow. Practice timed problem-solving to improve speed without sacrificing accuracy.
                            </div>
                          </div>
                        </div>

                        {/* AI-Generated Fix Plan */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <h4 className="text-xs uppercase tracking-wider text-blue-700 font-semibold">
                              AI Fix Plan
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {test.aiFixPlan.map((step) => (
                              <div key={step.step} className="flex items-start gap-3 bg-white p-3 border border-blue-200">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-semibold text-slate-900">{step.action}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">Impact: {step.impact}</div>
                                </div>
                                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wide transition-colors">
                                  Start
                                </button>
                              </div>
                            ))}
                          </div>
                          <button className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                            Execute Complete Fix Plan
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                            Retry Weak Concepts
                          </button>
                          <button className="px-4 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold uppercase tracking-wide transition-colors">
                            View Solutions
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: AI Intelligence Panel (1/3 width) */}
        <div className="space-y-4 min-w-0">
          {/* Test Readiness */}
          <div className="bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Next Test Readiness
              </div>
              <Target className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-5xl font-bold text-slate-900 mb-2">64%</div>
            <div className="text-xs text-slate-600 mb-4">JEE Mock Test 3 • Tomorrow</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Syllabus Coverage</span>
                <span className="font-semibold text-emerald-600">92%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Practice Done</span>
                <span className="font-semibold text-orange-600">58%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Weak Concepts</span>
                <span className="font-semibold text-red-600">3 pending</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
              Prepare Now
            </button>
          </div>

          {/* Performance Trend */}
          <div className="bg-white border border-slate-200 p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
              Test Performance Trend
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Last 3 Tests Avg</span>
                <span className="text-sm font-bold text-slate-900">76%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Best Score</span>
                <span className="text-sm font-bold text-emerald-600">82%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Improvement</span>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Rank Movement</span>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +45
                </span>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">
                AI Strategy
              </div>
            </div>
            <div className="text-sm font-bold text-slate-900 mb-2">
              Take mini-tests daily
            </div>
            <div className="text-xs text-slate-700 leading-relaxed mb-3">
              Students who take 15-min quizzes daily score 18% higher. Your optimal time: 8 PM.
            </div>
            <button className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
              Schedule Daily Quiz
            </button>
          </div>

          {/* Weak Concepts Alert */}
          <div className="bg-red-50 border-l-4 border-red-500 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div className="text-xs uppercase tracking-wider text-red-700 font-semibold">
                Before Next Test
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="text-xs text-slate-700 font-semibold">Must fix:</div>
              <div className="text-xs text-slate-700">• Lenz Law Applications</div>
              <div className="text-xs text-slate-700">• Carnot Cycle Efficiency</div>
              <div className="text-xs text-slate-700">• Integration by Parts</div>
            </div>
            <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
              Fix These Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
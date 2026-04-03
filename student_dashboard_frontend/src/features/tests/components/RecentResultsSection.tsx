import { useState, useEffect } from 'react';
import { List, LayoutGrid, TrendingUp, RotateCcw, Target, BookOpen } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TestAnalyticsPage } from '@/features/subjects/components';
import { useRecentTests } from '@/features/tests/hooks';
import { buildMockTestResults } from '@/features/tests/services';
import { Skeleton, Spinner } from '@/components/ui';
import { ROUTES } from '@/shared/config/routes';
import type { TestResultData, TestType } from '@/types/Test';

type ViewMode = 'list' | 'cards';

interface RecentResultsSectionProps {
  onRetakeTest?: (testName: string, subject: string) => void;
}

export function RecentResultsSection({ onRetakeTest }: RecentResultsSectionProps = {}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: testResults = [], isLoading } = useRecentTests();
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const allowedFilters: Array<TestType | 'all'> = ['all', 'recursive', 'mock', 'chapter'];
  const requestedFilter = searchParams.get('type');
  const typeFilter: TestType | 'all' = allowedFilters.includes((requestedFilter ?? '') as TestType | 'all')
    ? (requestedFilter as TestType | 'all')
    : 'all';

  useEffect(() => {
    const saved = localStorage.getItem('towsoth_results_view') as ViewMode | null;
    if (saved) setViewMode(saved);
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('towsoth_results_view', mode);
  };

  const getResultKey = (result: TestResultData) => `${result.type}:${result.name}:${result.date}`;

  const selectedResultKey = searchParams.get('result');
  const selectedResultData = selectedResultKey
    ? testResults.find((result) => getResultKey(result) === selectedResultKey) ?? null
    : null;
  const selectedResult = selectedResultData ? buildMockTestResults(selectedResultData) : null;

  const filteredResults = typeFilter === 'all' 
    ? testResults 
    : testResults.filter(r => r.type === typeFilter);

  const viewDetailedAnalysis = (result: TestResultData) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('result', getResultKey(result));
    setSearchParams(nextParams, { replace: false });
  };

  const setTypeFilterInUrl = (filter: TestType | 'all') => {
    const nextParams = new URLSearchParams(searchParams);
    if (filter === 'all') {
      nextParams.delete('type');
    } else {
      nextParams.set('type', filter);
    }
    setSearchParams(nextParams, { replace: false });
  };

  const getTestTypeStyle = (type: TestType) => {
    switch(type) {
      case 'recursive':
        return {
          bg: '#5B5F8D',
          text: '#FFFFFF',
          border: '#5B5F8D',
          label: 'RECURSIVE',
          icon: RotateCcw
        };
      case 'mock':
        return {
          bg: '#111827',
          text: '#FFFFFF',
          border: '#111827',
          label: 'MOCK TEST',
          icon: Target
        };
      case 'chapter':
        return {
          bg: '#FAFAFA',
          text: '#111827',
          border: '#E5E7EB',
          label: 'CHAPTER',
          icon: BookOpen
        };
    }
  };

  if (selectedResult) {
    return (
      <TestAnalyticsPage
        results={selectedResult}
        onBack={() => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.delete('result');
          setSearchParams(nextParams, { replace: false });
        }}
        onRetakeTest={() => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.delete('result');
          setSearchParams(nextParams, { replace: false });
          if (onRetakeTest) {
            onRetakeTest(selectedResult.testName || 'Retake Test', selectedResult.subject);
          }
        }}
        onReviewAnswers={() => console.log('Review answers')}
        onStartPractice={() => {
          const searchParams = new URLSearchParams({
            topic: selectedResult.testName || 'Practice Quiz',
            subject: selectedResult.subject,
            returnTo: ROUTES.student['tests-guidelines'],
          });

          navigate(`${ROUTES.student['test-window']}?${searchParams.toString()}`);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Spinner className="w-4 h-4" />
          <span>Loading recent results...</span>
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Recent Test Results</h1>
          <p className="text-sm text-slate-600">
            Performance analysis with trend tracking and score breakdowns
          </p>
        </div>

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
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewChange('cards')}
            title="Grid View"
            className="p-1.5 transition-all"
            style={{
              background: viewMode === 'cards' ? '#1e293b' : 'transparent',
              color: viewMode === 'cards' ? '#ffffff' : '#64748b',
            }}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto whitespace-nowrap mb-5">
        <div className="inline-flex min-w-max items-center gap-2">
          <button
            onClick={() => setTypeFilterInUrl('all')}
            className="shrink-0 whitespace-nowrap px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] border transition-colors"
            style={{
              background: typeFilter === 'all' ? '#111827' : '#FFFFFF',
              borderColor: '#E5E7EB',
              color: typeFilter === 'all' ? '#FFFFFF' : '#6B7280'
            }}
          >
            All Tests
          </button>
          <button
            onClick={() => setTypeFilterInUrl('recursive')}
            className="shrink-0 whitespace-nowrap px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] border transition-colors flex items-center gap-1.5"
            style={{
              background: typeFilter === 'recursive' ? '#5B5F8D' : '#FFFFFF',
              borderColor: typeFilter === 'recursive' ? '#5B5F8D' : '#E5E7EB',
              color: typeFilter === 'recursive' ? '#FFFFFF' : '#6B7280'
            }}
          >
            <RotateCcw className="w-3 h-3" />
            Recursive
          </button>
          <button
            onClick={() => setTypeFilterInUrl('mock')}
            className="shrink-0 whitespace-nowrap px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] border transition-colors flex items-center gap-1.5"
            style={{
              background: typeFilter === 'mock' ? '#111827' : '#FFFFFF',
              borderColor: '#E5E7EB',
              color: typeFilter === 'mock' ? '#FFFFFF' : '#6B7280'
            }}
          >
            <Target className="w-3 h-3" />
            Mock Tests
          </button>
          <button
            onClick={() => setTypeFilterInUrl('chapter')}
            className="shrink-0 whitespace-nowrap px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] border transition-colors flex items-center gap-1.5"
            style={{
              background: typeFilter === 'chapter' ? '#111827' : '#FFFFFF',
              borderColor: '#E5E7EB',
              color: typeFilter === 'chapter' ? '#FFFFFF' : '#6B7280'
            }}
          >
            <BookOpen className="w-3 h-3" />
            Chapter Tests
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredResults.map((result, idx) => {
            const typeStyle = getTestTypeStyle(result.type);
            const TypeIcon = typeStyle.icon;
            
            return (
              <div key={idx} className="bg-white border-2 border-slate-200 hover:border-slate-300 transition-colors">
                <div className="h-1" style={{ background: typeStyle.bg }}></div>
                
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] border flex items-center gap-1"
                          style={{
                            background: typeStyle.bg,
                            borderColor: typeStyle.border,
                            color: typeStyle.text
                          }}
                        >
                          <TypeIcon className="w-2.5 h-2.5" />
                          {typeStyle.label}
                        </div>
                        {result.attemptNumber && (
                          <div 
                            className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]"
                            style={{ color: '#6B7280' }}
                          >
                            Attempt #{result.attemptNumber}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mb-1">{result.name}</div>
                      <div className="text-xs text-slate-600">{result.date}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8">
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">Score</div>
                        <div className="text-xl font-bold text-slate-900">{result.score}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-600 mb-1">Percentile</div>
                        <div className="text-xl font-bold" style={{ color: '#5B5F8D' }}>{result.percentile}%</div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold ${
                        result.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <TrendingUp className={`w-3.5 h-3.5 ${result.trend === 'down' ? 'rotate-180' : ''}`} />
                        {result.improvement}
                      </div>
                    </div>

                    <button 
                      onClick={() => viewDetailedAnalysis(result)}
                      className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                      View Analysis
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResults.map((result, idx) => {
            const typeStyle = getTestTypeStyle(result.type);
            const TypeIcon = typeStyle.icon;
            
            return (
              <div key={idx} className="bg-white border-2 border-slate-200 hover:border-slate-300 transition-colors">
                <div className="h-1" style={{ background: typeStyle.bg }}></div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] border flex items-center gap-1"
                          style={{
                            background: typeStyle.bg,
                            borderColor: typeStyle.border,
                            color: typeStyle.text
                          }}
                        >
                          <TypeIcon className="w-2.5 h-2.5" />
                          {typeStyle.label}
                        </div>
                      </div>
                      {result.attemptNumber && (
                        <div 
                          className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] mb-2 inline-block"
                          style={{ color: '#6B7280' }}
                        >
                          Attempt #{result.attemptNumber}
                        </div>
                      )}
                      <div className="text-sm font-bold text-slate-900 mb-1">{result.name}</div>
                      <div className="text-xs text-slate-600">{result.date}</div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold ${
                      result.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <TrendingUp className={`w-3.5 h-3.5 ${result.trend === 'down' ? 'rotate-180' : ''}`} />
                      {result.improvement}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Score</div>
                      <div className="text-3xl font-bold text-slate-900">{result.score}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Percentile</div>
                      <div className="text-3xl font-bold" style={{ color: '#5B5F8D' }}>{result.percentile}%</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => viewDetailedAnalysis(result)}
                    className="w-full px-4 py-2.5 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    View Detailed Analysis
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredResults.length === 0 && (
        <div className="text-center py-12 bg-white border-2 border-slate-200">
          <div className="text-slate-400 mb-2">
            <BookOpen className="w-12 h-12 mx-auto" />
          </div>
          <div className="text-sm font-bold text-slate-900 mb-1">No tests found</div>
          <div className="text-xs text-slate-600">Try selecting a different filter</div>
        </div>
      )}
    </div>
  );
}

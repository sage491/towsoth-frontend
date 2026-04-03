import {
  TrendingUp,
  Clock,
  Target,
  AlertCircle,
  ChevronLeft,
  Play,
  FileText,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAnalyticsViewContent, type AnalyticsHeatmapTopic, type AnalyticsSnapshot } from '@/services/subjectResourceService';

interface AnalyticsViewProps {
  subject: {
    id: number;
    name: string;
    mastery: number;
    trend: string;
    currentFocus: string;
    chapter: string;
    retention: number;
    weakClusters: string[];
    learningLoop: {
      watched: { current: number; total: number };
      practiced: { current: number; total: number };
      revised: { current: number; total: number };
      tested: { current: number; total: number };
    };
  };
  onBack: () => void;
  onStartRevision: () => void;
  onFixGap: (gap: string) => void;
  onTakeTest: () => void;
}

export function AnalyticsView({
  subject,
  onBack,
  onStartRevision,
  onFixGap,
  onTakeTest,
}: AnalyticsViewProps) {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [topics, setTopics] = useState<AnalyticsHeatmapTopic[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getAnalyticsViewContent()
      .then((data) => {
        if (!isMounted) return;
        setSnapshot(data.snapshot);
        setTopics(data.topics);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsContentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);
  // Calculate percentages
  const watchPercent = Math.round(
    (subject.learningLoop.watched.current / subject.learningLoop.watched.total) * 100
  );
  const practicePercent = Math.round(
    (subject.learningLoop.practiced.current / subject.learningLoop.practiced.total) * 100
  );
  const revisePercent = Math.round(
    (subject.learningLoop.revised.current / subject.learningLoop.revised.total) * 100
  );
  const testPercent = Math.round(
    (subject.learningLoop.tested.current / subject.learningLoop.tested.total) * 100
  );

  // Find weakest loop
  const loopStats = [
    { name: 'Watch', percent: watchPercent },
    { name: 'Practice', percent: practicePercent },
    { name: 'Revise', percent: revisePercent },
    { name: 'Test', percent: testPercent },
  ];
  const weakestLoop = loopStats.reduce((min, loop) =>
    loop.percent < min.percent ? loop : min
  );

  if (isContentLoading || !snapshot) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header - Sticky */}
      <div className="bg-white border border-slate-200 p-5 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <div className="text-xs text-slate-500 mb-1">
                {subject.name} → {subject.chapter}
              </div>
              <h2 className="text-lg font-bold text-slate-900">Analytics</h2>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-slate-500">Mastery</div>
              <div className="text-2xl font-bold text-slate-900">
                {subject.mastery}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Retention</div>
              <div className="text-2xl font-bold text-slate-900">
                {subject.retention}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Status</div>
              <div
                className={`text-sm font-bold uppercase tracking-wide ${
                  subject.trend === 'rising'
                    ? 'text-emerald-600'
                    : subject.trend === 'dropping'
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}
              >
                {subject.trend}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-slate-500" />
            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
              Accuracy
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{snapshot.accuracy}</div>
          <div className="text-xs text-slate-600">
            {subject.learningLoop.practiced.current} questions solved
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
              Avg Time/Q
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{snapshot.avgTimePerQuestion}</div>
          <div className="text-xs text-slate-600">{snapshot.avgTimeTarget}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
              Score Trend
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-1">{snapshot.scoreTrendIndicator}</div>
          <div className="text-xs text-slate-600">{snapshot.scoreTrendLabel}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
              Rank Impact
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">{snapshot.rankImpact}</div>
          <div className="text-xs text-slate-600">{snapshot.rankImpactLabel}</div>
        </div>
      </div>

      {/* Topic Heatmap */}
      <div className="bg-white border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Topic Strength Heatmap
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500"></div>
              <span className="text-slate-600">Strong (75%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500"></div>
              <span className="text-slate-600">Moderate (60-75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500"></div>
              <span className="text-slate-600">Weak (&lt;60%)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {topics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (topic.strength === 'weak') {
                  onFixGap(topic.name);
                }
              }}
              className={`p-3 border-2 transition-all text-left ${
                topic.strength === 'strong'
                  ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-500'
                  : topic.strength === 'moderate'
                  ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-500'
                  : 'bg-red-50 border-red-200 hover:border-red-500 cursor-pointer'
              }`}
            >
              <div className="text-xs font-semibold text-slate-900 mb-2">
                {topic.name}
              </div>
              <div className="text-lg font-bold text-slate-900">
                {topic.accuracy}%
              </div>
              {topic.strength === 'weak' && (
                <div className="text-[10px] text-red-700 font-semibold mt-1 uppercase">
                  Click to fix
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Loop Analysis */}
      <div className="bg-white border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
          Learning Loop Analysis
        </h3>

        <div className="space-y-4">
          {/* Watch */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Watch
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {watchPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3">
              <div
                className={`h-3 ${
                  watchPercent >= 75
                    ? 'bg-emerald-500'
                    : watchPercent >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${watchPercent}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {subject.learningLoop.watched.current} /{' '}
              {subject.learningLoop.watched.total} videos completed
            </div>
          </div>

          {/* Practice */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Practice
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {practicePercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3">
              <div
                className={`h-3 ${
                  practicePercent >= 75
                    ? 'bg-emerald-500'
                    : practicePercent >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${practicePercent}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {subject.learningLoop.practiced.current} /{' '}
              {subject.learningLoop.practiced.total} problems solved
            </div>
          </div>

          {/* Revise */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Revise
                </span>
                {revisePercent < 50 && (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <span className="text-sm font-bold text-slate-900">
                {revisePercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3">
              <div
                className={`h-3 ${
                  revisePercent >= 75
                    ? 'bg-emerald-500'
                    : revisePercent >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${revisePercent}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {subject.learningLoop.revised.current} /{' '}
              {subject.learningLoop.revised.total} sessions done
            </div>
          </div>

          {/* Test */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Test
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {testPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3">
              <div
                className={`h-3 ${
                  testPercent >= 75
                    ? 'bg-emerald-500'
                    : testPercent >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${testPercent}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {subject.learningLoop.tested.current} /{' '}
              {subject.learningLoop.tested.total} tests taken
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4">
          <div className="text-xs font-semibold text-blue-900 mb-1">
            AI Insight
          </div>
          <div className="text-xs text-blue-800">
            {weakestLoop.name} is your weakest link at {weakestLoop.percent}%.
            Fixing it improves retention fastest.
          </div>
        </div>
      </div>

      {/* Smart Action Panel */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-blue-600 p-6">
        <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-3">
          What should you do next?
        </div>

        <div className="space-y-3">
          {/* Primary CTA - Based on weakest link */}
          {revisePercent < 50 && (
            <button
              onClick={onStartRevision}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-between"
            >
              <span>Start 10-min Revision</span>
              <span className="text-xs bg-blue-500 px-2 py-1">
                Recommended
              </span>
            </button>
          )}

          {/* Fix Critical Gap */}
          {subject.weakClusters.length > 0 && (
            <button
              onClick={() => onFixGap(subject.weakClusters[0])}
              className={`w-full px-6 py-4 text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-between ${
                revisePercent >= 50
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300'
              }`}
            >
              <span>Fix Critical Gap ({subject.weakClusters[0]})</span>
              {revisePercent >= 50 && (
                <span className="text-xs bg-blue-500 px-2 py-1">
                  Recommended
                </span>
              )}
            </button>
          )}

          {/* Take Test */}
          <button
            onClick={onTakeTest}
            className="w-full px-6 py-4 bg-white hover:bg-slate-50 text-slate-900 text-sm font-bold uppercase tracking-wide transition-colors border-2 border-slate-300"
          >
            Take Predictive Test
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          AI prioritizes actions based on your learning patterns and retention
          curve.
        </div>
      </div>
    </div>
  );
}

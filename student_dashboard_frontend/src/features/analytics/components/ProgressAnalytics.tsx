import { TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { sharedProgressData } from '@/data/progressData';

export function ProgressAnalytics() {
  const progressData = {
    overall: sharedProgressData.overall,
    weeklyTrend: sharedProgressData.weeklyTrend,
    milestones: sharedProgressData.milestones,
    subjectProgress: sharedProgressData.subjectProgress,
    studyMetrics: {
      totalHours: sharedProgressData.monthly.totalHours,
      targetHours: sharedProgressData.monthly.totalTargetHours,
      consistency: sharedProgressData.monthly.consistency,
      focusQuality: sharedProgressData.monthly.focusQuality,
    },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Progress Analytics</h1>
        <p className="text-sm text-slate-600">
          Calm, reflective view of your journey toward your goal
        </p>
      </div>

      {/* Cross-reference banner */}
      <div className="bg-blue-50 border border-blue-200 p-4 mb-6 flex items-start gap-3">
        <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs font-bold text-blue-900 mb-1">Analytics vs Tracking</div>
          <p className="text-xs text-blue-800 leading-relaxed">
            This page shows <strong>high-level progress trends and goal milestones</strong>. 
            For detailed graphs, heatmaps, and daily breakdowns, visit <strong>Progress Tracking</strong>.
          </p>
        </div>
      </div>

      {/* Progress vs Target Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border-2 border-slate-200 p-6">
          <div className="text-xs text-slate-600 mb-2">Current Pace</div>
          <div className="text-3xl font-bold text-slate-900 mb-3">{progressData.overall.currentPace}%</div>
          <div className="w-full bg-slate-200 h-2.5 mb-3">
            <div className="bg-slate-900 h-2.5" style={{ width: `${progressData.overall.currentPace}%` }} />
          </div>
          <div className="text-xs text-slate-600">Progress rate this month</div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-6">
          <div className="text-xs text-slate-600 mb-2">Required Pace</div>
          <div className="text-3xl font-bold text-slate-900 mb-3">{progressData.overall.requiredPace}%</div>
          <div className="w-full bg-slate-200 h-2.5 mb-3">
            <div className="bg-blue-600 h-2.5" style={{ width: `${progressData.overall.requiredPace}%` }} />
          </div>
          <div className="text-xs text-slate-600">Needed to stay on track</div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-6">
          <div className="text-xs text-slate-600 mb-2">Status</div>
          <div className="flex items-center gap-2 mb-4 mt-2">
            {progressData.overall.status === 'on-track' ? (
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            )}
            <span className={`text-sm font-bold ${
              progressData.overall.status === 'on-track' ? 'text-emerald-600' : 'text-orange-600'
            }`}>
              {progressData.overall.status === 'on-track' ? 'On Track' : 'Slightly Behind'}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            Gap: {progressData.overall.requiredPace - progressData.overall.currentPace}% to close
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white border-2 border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Weekly Progress Trend</h3>
        <p className="text-xs text-slate-600 mb-5">
          Comparing actual progress against target over the past 4 weeks
        </p>

        <div className="space-y-4">
          {progressData.weeklyTrend.map((week, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{week.week}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600">Actual: <strong>{week.actual}%</strong></span>
                  <span className="text-xs text-slate-400">Target: {week.target}%</span>
                </div>
              </div>
              <div className="relative h-3 bg-slate-200">
                <div 
                  className={`h-3 ${week.actual >= week.target ? 'bg-emerald-600' : 'bg-orange-600'}`}
                  style={{ width: `${week.actual}%` }}
                />
                <div 
                  className="absolute top-0 h-3 border-r-2 border-blue-600"
                  style={{ left: `${week.target}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Milestones */}
      <div className="bg-white border-2 border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Key Milestones</h3>
        <p className="text-xs text-slate-600 mb-5">
          Track progress toward your major goals and deadlines
        </p>

        <div className="space-y-4">
          {progressData.milestones.map((milestone, idx) => (
            <div key={idx} className="border-l-4 border-slate-300 pl-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 mb-1">{milestone.name}</div>
                  <div className="text-xs text-slate-600">Due: {milestone.dueDate}</div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold ${
                  milestone.status === 'on-track' ? 'bg-emerald-100 text-emerald-800' :
                  milestone.status === 'behind' ? 'bg-red-100 text-red-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {milestone.status === 'on-track' ? 'On Track' :
                   milestone.status === 'behind' ? 'Behind' : 'Needs Attention'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-600">Target: <strong>{milestone.target}</strong></span>
                <span className="text-slate-400">•</span>
                <span className={`font-bold ${
                  milestone.status === 'on-track' ? 'text-emerald-600' :
                  milestone.status === 'behind' ? 'text-red-600' :
                  'text-orange-600'
                }`}>
                  Current: {milestone.actual}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject-wise Progress */}
      <div className="bg-white border-2 border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Subject Completion Status</h3>
        <p className="text-xs text-slate-600 mb-5">
          Syllabus coverage across all subjects
        </p>

        <div className="space-y-4">
          {progressData.subjectProgress.map((subject, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{subject.subject}</span>
                <span className={`text-xs font-bold ${subject.onTrack ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {subject.completion}% complete
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5">
                <div 
                  className={`h-2.5 ${subject.onTrack ? 'bg-emerald-600' : 'bg-orange-600'}`}
                  style={{ width: `${subject.completion}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Metrics */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white border-2 border-slate-200 p-6">
          <div className="text-xs text-slate-600 mb-2">Total Study Hours</div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{progressData.studyMetrics.totalHours}h</div>
          <div className="text-xs text-slate-600 mb-3">Target: {progressData.studyMetrics.targetHours}h</div>
          <div className="w-full bg-slate-200 h-2">
            <div 
              className="bg-slate-900 h-2" 
              style={{ width: `${(progressData.studyMetrics.totalHours / progressData.studyMetrics.targetHours) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-6">
          <div className="text-xs text-slate-600 mb-2">Consistency Score</div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{progressData.studyMetrics.consistency}%</div>
          <div className="text-xs text-slate-600 mb-3">Daily study habit strength</div>
          <div className="w-full bg-slate-200 h-2">
            <div className="bg-slate-900 h-2" style={{ width: `${progressData.studyMetrics.consistency}%` }} />
          </div>
        </div>
      </div>

      {/* Burnout Risk Indicator */}
      <div className={`border-l-4 p-5 ${
        progressData.overall.burnoutRisk === 'low' ? 'bg-emerald-50 border-emerald-600' :
        progressData.overall.burnoutRisk === 'medium' ? 'bg-orange-50 border-orange-600' :
        'bg-red-50 border-red-600'
      }`}>
        <div className="flex items-start gap-3">
          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            progressData.overall.burnoutRisk === 'low' ? 'text-emerald-600' :
            progressData.overall.burnoutRisk === 'medium' ? 'text-orange-600' :
            'text-red-600'
          }`} />
          <div>
            <div className={`text-xs font-bold mb-2 ${
              progressData.overall.burnoutRisk === 'low' ? 'text-emerald-900' :
              progressData.overall.burnoutRisk === 'medium' ? 'text-orange-900' :
              'text-red-900'
            }`}>
              Burnout Risk: {progressData.overall.burnoutRisk === 'low' ? 'Low' : progressData.overall.burnoutRisk === 'medium' ? 'Medium' : 'High'}
            </div>
            <p className={`text-xs leading-relaxed ${
              progressData.overall.burnoutRisk === 'low' ? 'text-emerald-800' :
              progressData.overall.burnoutRisk === 'medium' ? 'text-orange-800' :
              'text-red-800'
            }`}>
              {progressData.overall.burnoutRisk === 'low' && 
                'Your study pace is sustainable. You\'re maintaining good balance between effort and rest.'}
              {progressData.overall.burnoutRisk === 'medium' && 
                'Consider taking regular breaks. High intensity can lead to fatigue.'}
              {progressData.overall.burnoutRisk === 'high' && 
                'Warning: Your pace may not be sustainable. Schedule recovery time.'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Strategic Reflection */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-5 mt-6">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-blue-900 mb-2">Calm Reflection</div>
            <p className="text-xs text-blue-800 leading-relaxed">
              You're 5% behind target pace but within catchable range. The gap is small. 
              Focus on consistency over intensity—adding just 30 minutes per day gets you back on track by month-end. 
              No need to rush. Steady progress wins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
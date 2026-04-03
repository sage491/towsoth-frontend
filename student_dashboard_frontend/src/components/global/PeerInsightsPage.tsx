import { useState } from 'react';
import { TrendingUp, Users, Lightbulb, BarChart3, ArrowRight, AlertTriangle } from 'lucide-react';

interface StudentCluster {
  exam: string;
  rankRange: string;
  avgStudyHours: number;
  memberCount: number;
  commonWeakTopics: string[];
  topResources: string[];
  avgAccuracy: number;
}

interface InsightCard {
  id: string;
  insight: string;
  confidence: 'High' | 'Medium' | 'Low';
  category: string;
  actionable: string;
  impact: string;
}

interface GapMetric {
  metric: string;
  yourValue: string;
  peerMedian: string;
  status: 'aligned' | 'gap' | 'ahead';
  difference: string;
}

export function PeerInsightsPage() {
  const [appliedInsights, setAppliedInsights] = useState<Set<string>>(new Set());

  // Mock data
  const cluster: StudentCluster = {
    exam: 'JEE Advanced',
    rankRange: '200–500',
    avgStudyHours: 6.8,
    memberCount: 847,
    commonWeakTopics: [
      'Thermodynamics',
      'Coordinate Geometry',
      'Organic Mechanisms',
    ],
    topResources: [
      'HC Verma (Physics)',
      'Cengage (Mathematics)',
      'NCERT (Chemistry)',
    ],
    avgAccuracy: 78,
  };

  const insights: InsightCard[] = [
    {
      id: '1',
      insight: 'Students in top 10% revise Thermodynamics every 5 days',
      confidence: 'High',
      category: 'Revision Strategy',
      actionable: 'Add Thermodynamics to your 5-day revision cycle',
      impact: 'Retention +18%',
    },
    {
      id: '2',
      insight: 'High scorers attempt PYQs 3 weeks earlier in preparation',
      confidence: 'High',
      category: 'Study Timeline',
      actionable: 'Start PYQ practice earlier in your schedule',
      impact: 'Accuracy +12%',
    },
    {
      id: '3',
      insight: 'Accuracy matters more than speed until rank 300',
      confidence: 'Medium',
      category: 'Test Strategy',
      actionable: 'Prioritize accuracy over speed in current phase',
      impact: 'Score stability +15%',
    },
    {
      id: '4',
      insight: 'Top performers solve 40% more numerical problems in Physics',
      confidence: 'High',
      category: 'Practice Pattern',
      actionable: 'Increase numerical problem solving in Physics',
      impact: 'Problem speed +20%',
    },
    {
      id: '5',
      insight: 'Mistake analysis done within 24 hours shows better retention',
      confidence: 'Medium',
      category: 'Learning Method',
      actionable: 'Review mistakes immediately after practice',
      impact: 'Retention +14%',
    },
  ];

  const gaps: GapMetric[] = [
    {
      metric: 'Daily Study Hours',
      yourValue: '6.2h',
      peerMedian: '6.8h',
      status: 'gap',
      difference: '-0.6h below median',
    },
    {
      metric: 'Revision Frequency',
      yourValue: 'Every 8 days',
      peerMedian: 'Every 5 days',
      status: 'gap',
      difference: '3 days slower',
    },
    {
      metric: 'PYQ Practice Start',
      yourValue: 'Week 8',
      peerMedian: 'Week 5',
      status: 'gap',
      difference: '3 weeks late',
    },
    {
      metric: 'Test Accuracy',
      yourValue: '81%',
      peerMedian: '78%',
      status: 'ahead',
      difference: '+3% above median',
    },
    {
      metric: 'Problem Solving Speed',
      yourValue: '3.2 min/Q',
      peerMedian: '3.5 min/Q',
      status: 'ahead',
      difference: '0.3 min faster',
    },
  ];

  const handleApplyInsight = (insightId: string) => {
    setAppliedInsights(new Set(appliedInsights).add(insightId));
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aligned':
        return 'border-slate-200 bg-white';
      case 'gap':
        return 'border-amber-200 bg-amber-50';
      case 'ahead':
        return 'border-emerald-200 bg-emerald-50';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'gap':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'ahead':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-6 h-6" style={{ color: '#5B5F8D' }} />
            <h1 className="text-2xl font-bold text-slate-900">Peer Insights</h1>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            What are students like you doing differently? No leaderboard hype. No comparison addiction. Only insight.
          </p>
        </div>

        {/* Safety Banner */}
        <div className="mb-8 p-4 bg-slate-100 border-l-4 border-slate-800">
          <div className="text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">
            Privacy First
          </div>
          <div className="text-xs text-slate-700">
            All comparisons are private • No student names shown • Data is anonymized and aggregated
          </div>
        </div>

        {/* Similar Student Cluster */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Your Student Cluster
            </h2>
          </div>

          <div className="p-6 border-2 border-slate-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-xs text-slate-600 mb-3 uppercase tracking-wide font-semibold">
                  Cluster Profile
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Exam</span>
                    <span className="font-bold text-slate-900">{cluster.exam}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Rank Range</span>
                    <span className="font-bold text-slate-900">{cluster.rankRange}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Similar Students</span>
                    <span className="font-bold text-slate-900">
                      {cluster.memberCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Avg Study Hours</span>
                    <span className="font-bold text-slate-900">
                      {cluster.avgStudyHours}h/day
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Avg Accuracy</span>
                    <span className="font-bold text-slate-900">{cluster.avgAccuracy}%</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-600 mb-3 uppercase tracking-wide font-semibold">
                  Common Patterns
                </div>
                <div className="mb-4">
                  <div className="text-xs text-slate-600 mb-2">Common Weak Topics</div>
                  <div className="flex flex-wrap gap-1">
                    {cluster.commonWeakTopics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-2">Top Resources Used</div>
                  <div className="flex flex-wrap gap-1">
                    {cluster.topResources.map((resource, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 text-center">
                This cluster is algorithmically matched based on exam, rank, and study patterns
              </div>
            </div>
          </div>
        </div>

        {/* Insight Cards */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Actionable Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-5 border-2 transition-all ${
                  appliedInsights.has(insight.id)
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-1 border font-semibold ${getConfidenceColor(
                        insight.confidence
                      )}`}
                    >
                      {insight.confidence} Confidence
                    </span>
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200">
                      {insight.category}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-1">
                    {insight.insight}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-slate-600 mb-1">Recommended Action:</div>
                  <div className="text-xs text-slate-900 mb-2">{insight.actionable}</div>
                  <div className="text-xs text-emerald-600 font-semibold">
                    Expected Impact: {insight.impact}
                  </div>
                </div>

                {appliedInsights.has(insight.id) ? (
                  <button className="w-full px-4 py-2 bg-slate-800 text-white text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2">
                    <span>✓</span>
                    Applied to Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleApplyInsight(insight.id)}
                    className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                  >
                    Apply This
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gap Comparison */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Gap Comparison (Private)
            </h2>
          </div>

          <div className="space-y-3">
            {gaps.map((gap, idx) => (
              <div
                key={idx}
                className={`p-4 border-2 transition-all ${getStatusColor(gap.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(gap.status)}
                      <div className="text-sm font-bold text-slate-900">
                        {gap.metric}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-slate-600 mb-1">Your Value</div>
                        <div className="font-bold text-slate-900">{gap.yourValue}</div>
                      </div>
                      <div>
                        <div className="text-slate-600 mb-1">Peer Median</div>
                        <div className="font-bold text-slate-900">{gap.peerMedian}</div>
                      </div>
                      <div>
                        <div className="text-slate-600 mb-1">Difference</div>
                        <div
                          className={`font-bold ${
                            gap.status === 'gap'
                              ? 'text-amber-600'
                              : gap.status === 'ahead'
                              ? 'text-emerald-600'
                              : 'text-slate-900'
                          }`}
                        >
                          {gap.difference}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600">
            <div className="text-xs font-semibold text-blue-900 mb-1">
              AI Analysis Summary
            </div>
            <div className="text-xs text-blue-800">
              You have 3 gaps to address and 2 areas where you're ahead. Focus on increasing study hours (+0.6h) and
              starting PYQ practice earlier. Your accuracy is above median — maintain this strength.
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-white border-2 border-slate-200">
          <div className="text-xs text-slate-600 text-center">
            These insights are algorithmically generated and private. No student names are ever shown.
          </div>
        </div>
      </div>
    </div>
  );
}
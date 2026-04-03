import { TrendingUp, TrendingDown, Brain, Clock, CheckCircle2, Activity, AlertCircle, ArrowUpRight, Calendar, Flame, Award } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, PieChart, Pie } from 'recharts';
import { useAnalyticsData } from '@/features/analytics/hooks';
import type { RoutePath } from '@/shared/config/routes';

interface AnalyticsPageProps {
  onNavigate?: (page: RoutePath) => void;
}

export function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  const { weeklyProgress, subjectData: subjectQuery, activityDistribution, dailyActivity, conceptProgress } = useAnalyticsData();
  const weeklyProgressData = weeklyProgress.data ?? [];
  const subjectData = subjectQuery.data ?? [];
  const activityDistributionData = activityDistribution.data ?? [];
  const dailyActivityData = dailyActivity.data ?? [];
  const conceptProgressData = conceptProgress.data ?? [];

  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6">
        {/* Professional Header */}
        <div className="border-l-4 pl-4 md:pl-6 py-3 md:py-4" style={{ borderColor: 'var(--accent-primary)', background: 'var(--bg-card)' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Performance Analytics
              </h1>
              <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                Data-driven insights into your learning patterns and outcomes
              </p>
            </div>
            <div className="grid grid-cols-2 lg:flex lg:items-center gap-2 md:gap-4">
              <div className="text-center px-3 md:px-5 py-2 md:py-3 border-2" style={{ borderColor: 'var(--border-medium)', background: 'var(--bg-secondary)' }}>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  Weekly Hours
                </div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  18.5
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" style={{ color: '#10b981' }} />
                  <span className="text-xs font-bold" style={{ color: '#10b981' }}>+2.3h</span>
                </div>
              </div>
              <div className="text-center px-3 md:px-5 py-2 md:py-3 border-2" style={{ borderColor: 'var(--border-medium)', background: 'var(--bg-secondary)' }}>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  Accuracy
                </div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  84%
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3" style={{ color: '#f59e0b' }} />
                  <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>-3%</span>
                </div>
              </div>
              <div className="text-center px-3 md:px-5 py-2 md:py-3 border-2" style={{ borderColor: 'var(--border-medium)', background: 'var(--bg-secondary)' }}>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  Momentum
                </div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#10b981' }}>
                  Rising
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Flame className="w-3 h-3" style={{ color: '#10b981' }} />
                  <span className="text-xs font-bold" style={{ color: '#10b981' }}>+12%</span>
                </div>
              </div>
              <div className="text-center px-3 md:px-5 py-2 md:py-3 border-2" style={{ borderColor: 'var(--border-medium)', background: 'var(--bg-secondary)' }}>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  Discipline
                </div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  8.7/10
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Award className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>Top 15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* LEFT: Visual Analytics (2/3 width on large screens) */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            {/* Monthly Progress Trend - Line + Bar Chart */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-primary)' }}>
                    Monthly Progress Trend
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Performance score correlated with study hours
                  </p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 border" style={{ background: '#f0fdf4', borderColor: '#10b981' }}>
                  <ArrowUpRight className="w-4 h-4" style={{ color: '#10b981' }} />
                  <span className="text-sm font-bold" style={{ color: '#10b981' }}>+12 pts</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border-medium)' }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border-medium)' }}
                    label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-tertiary)', fontSize: 12 } }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border-medium)' }}
                    label={{ value: 'Hours', angle: 90, position: 'insideRight', style: { fill: 'var(--text-tertiary)', fontSize: 12 } }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 0,
                      fontSize: 12
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="score"
                    stroke="#5B5F8D"
                    strokeWidth={3}
                    dot={{ fill: '#5B5F8D', r: 5 }}
                    name="Performance Score"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="hours"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#10b981', r: 4 }}
                    name="Study Hours"
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 p-3 border-l-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Insight:</strong> Your performance score correlates strongly with study hours (r=0.94).
                  Increasing weekly hours by 2-3 hours could yield 8-10 point improvement.
                </p>
              </div>
            </div>

            {/* Subject Mastery Radar + Concept Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Radar Chart */}
              <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <div className="mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                    Subject Mastery Map
                  </h3>
                </div>

                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={subjectData}>
                    <PolarGrid stroke="var(--border-medium)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                    />
                    <Radar
                      name="Mastery"
                      dataKey="mastery"
                      stroke="#5B5F8D"
                      fill="#5B5F8D"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-medium)',
                        fontSize: 12
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Concept Progress List */}
              <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <div className="mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                    Topic Strength Analysis
                  </h3>
                </div>

                <div className="space-y-3">
                  {conceptProgressData.map((concept, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: concept.status === 'strong' ? '#10b981' : concept.status === 'good' ? '#5B5F8D' : '#ef4444'
                            }}
                          />
                          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                            {concept.topic}
                          </span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          {concept.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                        <div
                          className="h-1.5 transition-all"
                          style={{
                            width: `${concept.progress}%`,
                            background: concept.status === 'strong' ? '#10b981' : concept.status === 'good' ? '#5B5F8D' : '#ef4444'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Activity Pattern - Dual Axis Bar Chart */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-primary)' }}>
                  7-Day Activity & Accuracy Pattern
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Study hours vs accuracy by day of week
                </p>
              </div>

              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dailyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border-medium)' }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border-medium)' }}
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-tertiary)', fontSize: 12 } }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[70, 90]}
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border-medium)' }}
                    label={{ value: 'Accuracy %', angle: 90, position: 'insideRight', style: { fill: 'var(--text-tertiary)', fontSize: 12 } }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-medium)',
                      fontSize: 12
                    }}
                  />
                  <Bar yAxisId="left" dataKey="hours" fill="#5B5F8D" name="Study Hours" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="accuracy" fill="#10b981" name="Accuracy %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 p-3 border-l-2" style={{ background: 'var(--bg-secondary)', borderColor: '#f59e0b' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Pattern Detected:</strong> Wednesday shows peak performance (4.1h, 88% accuracy).
                  Saturday's low activity (1.5h) may indicate rest or scheduling conflict.
                </p>
              </div>
            </div>

            {/* Time Distribution - Pie Chart */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  Time Allocation Breakdown
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="w-full min-w-0">
                  <div className="mx-auto w-full max-w-[420px] h-[300px] sm:h-[340px] md:h-[360px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={260} minHeight={260}>
                    <PieChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
                      <Pie
                        data={activityDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius="82%"
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {activityDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-medium)',
                          fontSize: 12
                        }}
                      />
                    </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-3">
                  {activityDistributionData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: item.color }}
                        />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          {item.hours}h
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {item.value}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 border-l-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Recommendation:</strong> Practice (40%) is well-balanced.
                  Consider increasing revision from 15% to 25% for better retention.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Intelligence Panel (1/3 width) */}
          <div className="xl:col-span-1 space-y-4 md:space-y-6">
            {/* Key Metrics Summary */}
            <div className="p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  Key Metrics
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Concepts Mastered</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>47</span>
                    <span className="text-xs font-bold" style={{ color: '#10b981' }}>+8 this week</span>
                  </div>
                </div>

                <div className="p-3 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Current Streak</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>14</span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>days</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <Flame className="w-3 h-3" style={{ color: '#f59e0b' }} />
                    <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>Top 15% discipline</span>
                  </div>
                </div>

                <div className="p-3 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Focus Duration</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>52</span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>min avg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="p-5 border-l-4" style={{ background: 'var(--bg-card)', borderColor: '#10b981' }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  Top Strengths
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Organic Chemistry:</span> 90% accuracy
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Calculus:</span> Fast problem solver
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Consistency:</span> 14-day streak maintained
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="p-5 border-l-4" style={{ background: 'var(--bg-card)', borderColor: '#f59e0b' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5" style={{ color: '#f59e0b' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  Needs Attention
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Biology:</span> Requires daily practice
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Test Speed:</span> 28% below target
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Revision Time:</span> Increase to 25%
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="p-5 border-l-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--accent-primary)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  Next Best Action
                </div>
              </div>
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Increase Daily Revision
              </div>
              <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                Students with 25% revision time retain 35% more concepts. Add 15-min daily revision blocks.
              </div>
              <button
                className="w-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                onClick={() => onNavigate?.('revision-plan')}
              >
                Create Revision Plan
              </button>
            </div>

            {/* Peak Performance Hours */}
            <div className="p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  Peak Hours
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Most Productive</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>7-9 PM</span>
                </div>
                <div className="flex items-center justify-between p-2 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Best Accuracy</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>Morning</span>
                </div>
              </div>
            </div>

            {/* 30-Day Projection */}
            <div className="p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  30-Day Forecast
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Expected Mastery</span>
                    <span className="text-sm font-bold" style={{ color: '#10b981' }}>78%</span>
                  </div>
                  <div className="w-full h-1.5" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-1.5" style={{ width: '78%', background: '#10b981' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Rank Improvement</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>+42 positions</span>
                </div>
              </div>
              <div className="mt-3 p-2 text-[10px]" style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
                Projection based on current learning velocity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Zap, Calendar, Grid3x3, List } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { sharedProgressData } from '@/data/progressData';
import type { ProgressTooltipEntry, ProgressTooltipProps } from '@/features/student/progress/types';

type ViewMode = 'summary' | 'graphs' | 'combined';
type TimeRange = '7d' | '14d' | '30d';
type Subject = 'all' | 'physics' | 'chemistry' | 'mathematics';
type MetricFocus = 'effort' | 'performance' | 'consistency';
type DisplayMode = 'list' | 'grid';

export function ProgressTracking() {
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [timeRange, setTimeRange] = useState<TimeRange>('14d');
  const [subject, setSubject] = useState<Subject>('all');
  const [metricFocus, setMetricFocus] = useState<MetricFocus>('effort');
  const [weeklyDisplayMode, setWeeklyDisplayMode] = useState<DisplayMode>('grid');
  const [testsDisplayMode, setTestsDisplayMode] = useState<DisplayMode>('grid');
  const [topicsDisplayMode, setTopicsDisplayMode] = useState<DisplayMode>('grid');

  // Use shared data from central store
  const weeklyData = sharedProgressData.weeklyData;
  const syllabusData = sharedProgressData.syllabusData;
  const testData = sharedProgressData.testData;
  const weakTopicsData = sharedProgressData.weakTopicsData;
  const weakTopicsDetailed = sharedProgressData.weakTopicsDetailed;
  const testsDetailed = sharedProgressData.testsDetailed;
  const dailySessionsDetailed = sharedProgressData.dailySessionsDetailed;
  const heatmapData = sharedProgressData.heatmapData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'due-soon':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'good':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'excellent':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'average':
        return 'bg-slate-50 border-slate-200 text-slate-700';
      case 'ahead':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'on-track':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'behind':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return 'Critical';
      case 'due-soon':
        return 'Due Soon';
      case 'good':
        return 'Good';
      case 'excellent':
        return 'Excellent';
      case 'average':
        return 'Average';
      case 'ahead':
        return 'Ahead';
      case 'on-track':
        return 'On Track';
      case 'behind':
        return 'Behind';
      default:
        return status;
    }
  };

  const ViewToggle = ({
    mode,
    onModeChange,
  }: {
    mode: DisplayMode;
    onModeChange: (mode: DisplayMode) => void;
  }) => (
    <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 p-0.5">
      <button
        onClick={() => onModeChange('grid')}
        className={`p-1.5 transition-all ${
          mode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Grid view"
      >
        <Grid3x3 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onModeChange('list')}
        className={`p-1.5 transition-all ${
          mode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
        }`}
        title="List view"
      >
        <List className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: ProgressTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 px-3 py-2 text-xs">
          <div className="font-semibold text-slate-900 mb-1">{label}</div>
          {payload.map((entry: ProgressTooltipEntry, index: number) => (
            <div key={index} className="text-slate-600">
              {entry.name}: <span className="font-bold text-slate-900">{entry.value}</span>
              {entry.name.includes('Study') || entry.name.includes('actual') || entry.name.includes('target') ? 'h' : ''}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getHeatmapColor = (hours: number) => {
    if (hours === 0) return '#e5e7eb'; // grey
    if (hours < 4) return '#d1fae5'; // very light green
    if (hours < 6) return '#a7f3d0'; // light green
    if (hours < 7) return '#6ee7b7'; // medium green
    return '#34d399'; // dark green
  };

  return (
    <div>
      {/* Header with View Mode Toggle */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Progress Tracking</h1>
          <p className="text-sm text-slate-600">
            Compare your actual progress against target milestones
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200">
          <button
            onClick={() => setViewMode('summary')}
            className="px-3 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: viewMode === 'summary' ? '#1e293b' : 'transparent',
              color: viewMode === 'summary' ? '#ffffff' : '#64748b',
            }}
          >
            Summary
          </button>
          <button
            onClick={() => setViewMode('graphs')}
            className="px-3 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: viewMode === 'graphs' ? '#1e293b' : 'transparent',
              color: viewMode === 'graphs' ? '#ffffff' : '#64748b',
            }}
          >
            Graphs
          </button>
          <button
            onClick={() => setViewMode('combined')}
            className="px-3 py-1.5 text-xs font-semibold transition-all"
            style={{
              background: viewMode === 'combined' ? '#1e293b' : 'transparent',
              color: viewMode === 'combined' ? '#ffffff' : '#64748b',
            }}
          >
            Combined
          </button>
        </div>
      </div>

      {/* Cross-reference banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 mb-6 flex items-start gap-3">
        <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs font-bold text-emerald-900 mb-1">Tracking vs Analytics</div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            This page shows <strong>detailed graphs, heatmaps, and daily breakdowns</strong>. 
            For high-level progress trends, milestones, and a calm reflection view, visit <strong>Progress Analytics</strong>.
          </p>
        </div>
      </div>

      {/* Filters (only in graphs/combined mode) */}
      {(viewMode === 'graphs' || viewMode === 'combined') && (
        <div className="mb-6 p-4 bg-white border border-slate-200 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Time:</span>
            <div className="flex items-center gap-1">
              {(['7d', '14d', '30d'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 py-1 text-xs font-semibold transition-all ${
                    timeRange === range
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Subject:</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="px-2 py-1 text-xs bg-slate-100 border border-slate-200 text-slate-900 font-semibold"
            >
              <option value="all">All</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="mathematics">Mathematics</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Focus:</span>
            <div className="flex items-center gap-1">
              {(['effort', 'performance', 'consistency'] as MetricFocus[]).map((focus) => (
                <button
                  key={focus}
                  onClick={() => setMetricFocus(focus)}
                  className={`px-2 py-1 text-xs font-semibold transition-all capitalize ${
                    metricFocus === focus
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {focus}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Weekly Progress Summary - Only in Summary and Combined */}
        {(viewMode === 'summary' || viewMode === 'combined') && (
          <div className="bg-white border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-900">This Week's Performance</h3>
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold">
                Ahead of Plan
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-xs text-slate-600 mb-2">Study Time</div>
                <div className="text-2xl font-bold text-slate-900 mb-1">40h 15m</div>
                <div className="text-xs text-emerald-600 font-semibold">+2h 15m vs target</div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-2">Topics Covered</div>
                <div className="text-2xl font-bold text-slate-900 mb-1">8</div>
                <div className="text-xs text-emerald-600 font-semibold">+2 vs target</div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-2">Practice Sets</div>
                <div className="text-2xl font-bold text-slate-900 mb-1">12</div>
                <div className="text-xs text-slate-600">Target: 10</div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Effort vs Target Graph - Only in Graphs and Combined */}
        {(viewMode === 'graphs' || viewMode === 'combined') && (
          <div className="bg-white border-2 border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Weekly Effort vs Target</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#1e293b"
                  strokeWidth={2}
                  dot={{ fill: '#1e293b', r: 4 }}
                  name="Actual Study Time"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-slate-500 text-center mt-3">
              Consistent weekday effort • Weekend dip detected
            </div>
          </div>
        )}

        {/* Monthly Trajectory Summary - Only in Summary and Combined */}
        {(viewMode === 'summary' || viewMode === 'combined') && (
          <div className="bg-white border-2 border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Monthly Trajectory</h3>
            <div className="bg-slate-50 border border-slate-200 p-5 space-y-4">
              {[
                { metric: 'Syllabus Completion', actual: 67, target: 65, status: 'good' },
                { metric: 'Test Average', actual: 82, target: 85, status: 'behind' },
                { metric: 'Weak Topics', actual: 3, target: 2, status: 'behind', inverted: true },
                { metric: 'Study Consistency', actual: 95, target: 90, status: 'good' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-700 font-semibold">{item.metric}</span>
                    <span
                      className={`font-bold ${
                        item.status === 'good' ? 'text-emerald-600' : 'text-orange-600'
                      }`}
                    >
                      {item.actual}
                      {item.inverted ? '' : '%'} / {item.target}
                      {item.inverted ? '' : '%'}
                    </span>
                  </div>
                  <div className="w-full bg-white border border-slate-200 h-3">
                    <div
                      className={`h-full ${
                        item.status === 'good' ? 'bg-emerald-600' : 'bg-orange-600'
                      }`}
                      style={{
                        width: `${
                          item.inverted
                            ? (item.target / item.actual) * 100
                            : (item.actual / item.target) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Trajectory Graphs */}
        {(viewMode === 'graphs' || viewMode === 'combined') && (
          <div className="space-y-6">
            {/* Syllabus Completion Trend */}
            <div className="bg-white border-2 border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Syllabus Completion Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={syllabusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: 'Completion %', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="stepAfter"
                    dataKey="planned"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Planned"
                  />
                  <Line
                    type="stepAfter"
                    dataKey="actual"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-xs text-slate-500 text-center mt-3">
                Ahead in early weeks • Slight slowdown in W5-W6
              </div>
            </div>

            {/* Test Average Trend */}
            <div className="bg-white border-2 border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Test Average Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={testData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    domain={[60, 100]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: 'Score', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    name="Score"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-xs text-slate-500 text-center mt-3">
                Steady improvement • +16 points since first test
              </div>
            </div>

            {/* Weak Topics Load */}
            <div className="bg-white border-2 border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Weak Topics Load</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weakTopicsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: 'Error Frequency', position: 'insideBottom', fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="topic"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    width={150}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="errors" fill="#f97316" name="Errors" />
                </BarChart>
              </ResponsiveContainer>
              <div className="text-xs text-slate-500 text-center mt-3">
                Click any bar to open Mistake Analysis for that topic
              </div>
            </div>
          </div>
        )}

        {/* Consistency Heatmap */}
        {(viewMode === 'graphs' || viewMode === 'combined') && (
          <div className="bg-white border-2 border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Study Consistency Heatmap</h3>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Day labels */}
                <div className="flex mb-2">
                  <div className="w-16"></div>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div
                      key={day}
                      className="w-12 text-center text-xs text-slate-600 font-semibold"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Heatmap rows */}
                {heatmapData.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex mb-1">
                    <div className="w-16 text-xs text-slate-600 font-semibold flex items-center">
                      Week {weekIdx + 1}
                    </div>
                    {week.map((hours, dayIdx) => (
                      <div
                        key={dayIdx}
                        className="w-12 h-12 mr-1 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-75 group relative"
                        style={{ backgroundColor: getHeatmapColor(hours) }}
                        title={`${hours}h`}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          {hours}h
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4" style={{ backgroundColor: '#e5e7eb' }}></div>
                <span>No study</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4" style={{ backgroundColor: '#d1fae5' }}></div>
                <span>&lt; 4h</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4" style={{ backgroundColor: '#a7f3d0' }}></div>
                <span>4-6h</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4" style={{ backgroundColor: '#6ee7b7' }}></div>
                <span>6-7h</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4" style={{ backgroundColor: '#34d399' }}></div>
                <span>7h+</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 text-center mt-3">
              Weekday discipline strong • Weekend consistency needs attention
            </div>
          </div>
        )}

        {/* Daily Study Sessions - Grid/List View */}
        {(viewMode === 'graphs' || viewMode === 'combined') && (
          <div className="bg-white border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Daily Study Sessions</h3>
              <ViewToggle mode={weeklyDisplayMode} onModeChange={setWeeklyDisplayMode} />
            </div>

            {weeklyDisplayMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailySessionsDetailed.map((session, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border-2 transition-all ${getStatusColor(session.status)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{session.day}</div>
                        <div className="text-xs text-slate-500">{session.date}</div>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-bold border ${getStatusColor(session.status)}`}>
                        {getStatusBadge(session.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Study Time</span>
                        <span className="font-bold text-slate-900">{session.hours}h</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Target</span>
                        <span className="font-bold text-slate-900">{session.target}h</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Sessions</span>
                        <span className="font-bold text-slate-900">{session.sessions}</span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="text-xs text-slate-600 mb-1">Topics Covered:</div>
                      <div className="flex flex-wrap gap-1">
                        {session.topTopics.map((topic, topicIdx) => (
                          <span key={topicIdx} className="text-xs px-2 py-0.5 bg-white border border-slate-200 text-slate-700">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {dailySessionsDetailed.map((session, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="min-w-[100px]">
                          <div className="text-sm font-bold text-slate-900">{session.day}</div>
                          <div className="text-xs text-slate-500">{session.date}</div>
                        </div>
                        <div className="text-xs text-slate-600">
                          <span className="font-bold text-slate-900">{session.hours}h</span> / {session.target}h
                        </div>
                        <div className="text-xs text-slate-600">
                          {session.sessions} sessions
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-1">
                            {session.topTopics.map((topic, topicIdx) => (
                              <span key={topicIdx} className="text-xs px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-bold border ${getStatusColor(session.status)}`}>
                        {getStatusBadge(session.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Tests - Grid/List View */}
        {(viewMode === 'graphs' || viewMode === 'combined') && (
          <div className="bg-white border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Test Performance</h3>
              <ViewToggle mode={testsDisplayMode} onModeChange={setTestsDisplayMode} />
            </div>

            {testsDisplayMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testsDetailed.map((test, idx) => (
                  <div key={idx} className={`p-4 border-2 transition-all ${getStatusColor(test.status)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900 mb-1">{test.name}</div>
                        <div className="text-xs text-slate-500">{test.date}</div>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-bold border ${getStatusColor(test.status)}`}>
                        {getStatusBadge(test.status)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-baseline gap-2 mb-1">
                        <div className="text-2xl font-bold text-slate-900">{test.score}</div>
                        <div className="text-xs text-slate-500">/ {test.maxScore}</div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Accuracy</span>
                        <span className="font-bold text-slate-900">{test.accuracy}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2 mb-3">
                      <div className="bg-emerald-600 h-2" style={{ width: `${test.score}%` }}></div>
                    </div>

                    <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                      View Analysis
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {testsDetailed.map((test, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="min-w-[200px]">
                          <div className="text-sm font-bold text-slate-900">{test.name}</div>
                          <div className="text-xs text-slate-500">{test.date}</div>
                        </div>
                        <div className="text-xs text-slate-600">
                          Score: <span className="font-bold text-slate-900">{test.score}</span>/{test.maxScore}
                        </div>
                        <div className="text-xs text-slate-600">
                          Accuracy: <span className="font-bold text-slate-900">{test.accuracy}%</span>
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-slate-200 h-2">
                            <div className="bg-emerald-600 h-2" style={{ width: `${test.score}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-bold border ${getStatusColor(test.status)}`}>
                        {getStatusBadge(test.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Weak Topics - Grid/List View (Revision Style) */}
        {(viewMode === 'graphs' || viewMode === 'combined') && (
          <div className="bg-white border-2 border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Topics Requiring Attention</h3>
              <ViewToggle mode={topicsDisplayMode} onModeChange={setTopicsDisplayMode} />
            </div>

            {topicsDisplayMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weakTopicsDetailed.map((topic, idx) => (
                  <div key={idx} className={`p-4 border-2 transition-all ${getStatusColor(topic.status)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900 mb-1">{topic.topic}</div>
                        <div className="text-xs text-slate-500">Last practiced: {topic.lastPracticed}</div>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-bold border ${getStatusColor(topic.status)}`}>
                        {getStatusBadge(topic.status)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">Next Review:</span>
                        <span className="font-bold text-slate-900">{topic.nextReview}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">Errors:</span>
                        <span className="font-bold text-orange-600">{topic.errorCount}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">Retention Strength</span>
                        <span className="font-bold text-slate-900">{topic.retentionStrength}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2">
                        <div 
                          className={`h-2 ${topic.retentionStrength >= 75 ? 'bg-emerald-600' : topic.retentionStrength >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                          style={{ width: `${topic.retentionStrength}%` }}
                        ></div>
                      </div>
                    </div>

                    <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                      Start Revision
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {weakTopicsDetailed.map((topic, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-[180px]">
                        <div className="text-sm font-bold text-slate-900">{topic.topic}</div>
                        <div className="text-xs text-slate-500">Last practiced: {topic.lastPracticed} • Next: {topic.nextReview}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600">Retention Strength</span>
                          <span className="font-bold text-slate-900">{topic.retentionStrength}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2">
                          <div 
                            className={`h-2 ${topic.retentionStrength >= 75 ? 'bg-emerald-600' : topic.retentionStrength >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                            style={{ width: `${topic.retentionStrength}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-600">
                        <span className="font-bold text-orange-600">{topic.errorCount}</span> errors
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-bold border whitespace-nowrap ${getStatusColor(topic.status)}`}>
                        {getStatusBadge(topic.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Strategic Insight */}
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-5">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-bold text-emerald-900 mb-2">AI Strategic Insight</div>
              <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                You're ahead of schedule in study time but slightly behind in test performance.
                Shift focus from volume to quality. Prioritize mistake analysis over new content for
                the next 2 weeks.
              </p>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                Apply Suggested Adjustment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
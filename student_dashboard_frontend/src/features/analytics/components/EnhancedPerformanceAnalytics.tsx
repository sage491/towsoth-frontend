import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ViewMode = 'overview' | 'detailed' | 'visual';

export function EnhancedPerformanceAnalytics() {
  const [selectedTest, setSelectedTest] = useState('mock-3');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  useEffect(() => {
    const saved = localStorage.getItem('towsoth_analytics_view') as ViewMode | null;
    if (saved) setViewMode(saved);
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('towsoth_analytics_view', mode);
  };

  // Test data
  const testData = {
    'mock-3': {
      name: 'Physics Mock Test #3',
      date: 'Jan 28, 2026',
      score: 85,
      maxScore: 100,
      percentile: 92,
      accuracy: 78,
      speed: 72,
      attemptEfficiency: 85,
      mistakeClusters: [
        { type: 'Conceptual', count: 5, topics: ['Lenz Law', 'Faraday Law'], marksLost: 12, percentage: 42, color: '#dc2626' },
        { type: 'Careless', count: 3, topics: ['Sign Errors', 'Unit Conversion'], marksLost: 6, percentage: 27, color: '#f59e0b' },
        { type: 'Time Pressure', count: 2, topics: ['Complex Numericals'], marksLost: 5, percentage: 18, color: '#6b7280' },
      ],
      topicBreakdown: [
        { topic: 'Electromagnetic Induction', attempted: 8, correct: 5, marksLost: 6, accuracy: 63 },
        { topic: 'Rotational Dynamics', attempted: 10, correct: 8, marksLost: 4, accuracy: 80 },
        { topic: 'Thermodynamics', attempted: 6, correct: 5, marksLost: 2, accuracy: 83 },
        { topic: 'Wave Optics', attempted: 9, correct: 7, marksLost: 3, accuracy: 78 },
      ],
      aiInsight: 'Improving Electromagnetic Induction accuracy by 15% could add ~8 marks to your score.',
      trendData: [
        { test: 'Mock #1', score: 72, percentile: 85 },
        { test: 'Mock #2', score: 78, percentile: 88 },
        { test: 'Mock #3', score: 85, percentile: 92 },
      ]
    },
    'chem-unit': {
      name: 'Chemistry Unit Test',
      date: 'Jan 25, 2026',
      score: 78,
      maxScore: 100,
      percentile: 88,
      accuracy: 72,
      speed: 68,
      attemptEfficiency: 81,
      mistakeClusters: [
        { type: 'Conceptual', count: 6, topics: ['Organic Mechanisms', 'Reaction Pathways'], marksLost: 14, percentage: 48, color: '#dc2626' },
        { type: 'Time Pressure', count: 4, topics: ['Multi-step Problems'], marksLost: 8, percentage: 31, color: '#f59e0b' },
        { type: 'Careless', count: 2, topics: ['Formula Mistakes'], marksLost: 4, percentage: 15, color: '#6b7280' },
      ],
      topicBreakdown: [
        { topic: 'Organic Chemistry', attempted: 12, correct: 7, marksLost: 10, accuracy: 58 },
        { topic: 'Chemical Bonding', attempted: 8, correct: 6, marksLost: 4, accuracy: 75 },
        { topic: 'Periodic Table', attempted: 7, correct: 7, marksLost: 0, accuracy: 100 },
        { topic: 'Thermochemistry', attempted: 9, correct: 7, marksLost: 4, accuracy: 78 },
      ],
      aiInsight: 'Focus on Organic Chemistry mechanisms. This topic alone accounts for 45% of your lost marks.',
      trendData: [
        { test: 'Unit #1', score: 70, percentile: 82 },
        { test: 'Unit #2', score: 75, percentile: 85 },
        { test: 'Unit #3', score: 78, percentile: 88 },
      ]
    },
    'math-full': {
      name: 'Math Full Test',
      date: 'Jan 22, 2026',
      score: 92,
      maxScore: 100,
      percentile: 95,
      accuracy: 85,
      speed: 78,
      attemptEfficiency: 89,
      mistakeClusters: [
        { type: 'Careless', count: 4, topics: ['Calculation Errors', 'Algebraic Mistakes'], marksLost: 8, percentage: 50, color: '#f59e0b' },
        { type: 'Conceptual', count: 2, topics: ['Integration Techniques'], marksLost: 5, percentage: 31, color: '#dc2626' },
        { type: 'Time Pressure', count: 1, topics: ['Complex Word Problems'], marksLost: 3, percentage: 19, color: '#6b7280' },
      ],
      topicBreakdown: [
        { topic: 'Calculus', attempted: 15, correct: 13, marksLost: 4, accuracy: 87 },
        { topic: 'Algebra', attempted: 12, correct: 11, marksLost: 2, accuracy: 92 },
        { topic: '3D Geometry', attempted: 10, correct: 8, marksLost: 4, accuracy: 80 },
        { topic: 'Probability', attempted: 8, correct: 7, marksLost: 2, accuracy: 88 },
      ],
      aiInsight: 'Strong performance overall. Reducing careless errors could push you to 98+ score.',
      trendData: [
        { test: 'Test #1', score: 85, percentile: 90 },
        { test: 'Test #2', score: 88, percentile: 92 },
        { test: 'Test #3', score: 92, percentile: 95 },
      ]
    }
  };

  const currentTest = testData[selectedTest as keyof typeof testData];

  return (
    <div>
      {/* Header with View Toggle */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Performance Analytics
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Deep analysis of test performance and mistake patterns
          </p>
        </div>

        {/* View Toggle */}
        <div className="overflow-x-auto whitespace-nowrap min-w-max md:min-w-0 md:overflow-visible">
          <div
          className="inline-flex items-center gap-1 p-1 md:ml-6"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-soft)',
          }}
        >
          <button
            onClick={() => handleViewChange('overview')}
            title="Overview"
            className="px-3 py-2 text-xs font-medium transition-all"
            style={{
              background: viewMode === 'overview' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'overview' ? '#ffffff' : 'var(--text-tertiary)',
            }}
          >
            Overview
          </button>
          <button
            onClick={() => handleViewChange('detailed')}
            title="Detailed"
            className="px-3 py-2 text-xs font-medium transition-all"
            style={{
              background: viewMode === 'detailed' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'detailed' ? '#ffffff' : 'var(--text-tertiary)',
            }}
          >
            Detailed
          </button>
          <button
            onClick={() => handleViewChange('visual')}
            title="Charts"
            className="px-3 py-2 text-xs font-medium transition-all"
            style={{
              background: viewMode === 'visual' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'visual' ? '#ffffff' : 'var(--text-tertiary)',
            }}
          >
            Charts
          </button>
          </div>
        </div>
      </div>

      {/* Test Selector */}
      <div className="mb-6">
        <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
          Select Test
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(testData).map(([key, test]) => (
            <button
              key={key}
              onClick={() => setSelectedTest(key)}
              className="px-4 py-3 text-left transition-all flex-1 min-w-0"
              style={{
                background: selectedTest === key ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: selectedTest === key ? '#ffffff' : 'var(--text-primary)',
                border: selectedTest === key ? 'none' : '1px solid var(--border-soft)',
              }}
            >
              <div className="text-xs font-bold mb-1">{test.name}</div>
              <div className="text-xs opacity-70">{test.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <>
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>Score</div>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {currentTest.score}/{currentTest.maxScore}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{currentTest.percentile}th percentile</div>
            </div>

            <div className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>Accuracy</div>
              <div className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{currentTest.accuracy}%</div>
              <div className="w-full h-2" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-2 transition-all" style={{ width: `${currentTest.accuracy}%`, background: 'var(--accent-primary)' }} />
              </div>
            </div>

            <div className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>Speed</div>
              <div className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{currentTest.speed}%</div>
              <div className="w-full h-2" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-2 transition-all" style={{ width: `${currentTest.speed}%`, background: 'var(--accent-primary)' }} />
              </div>
            </div>

            <div className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>Efficiency</div>
              <div className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{currentTest.attemptEfficiency}%</div>
              <div className="w-full h-2" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-2 transition-all" style={{ width: `${currentTest.attemptEfficiency}%`, background: 'var(--accent-primary)' }} />
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <div className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Top Mistake Type</h3>
              {currentTest.mistakeClusters.slice(0, 1).map((cluster, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{cluster.type} Errors</span>
                    <span className="text-sm font-bold text-red-600">-{cluster.marksLost} marks</span>
                  </div>
                  <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {cluster.topics.join(', ')}
                  </div>
                  <div className="w-full h-2" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-2 bg-red-600" style={{ width: `${cluster.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Weakest Topic</h3>
              {currentTest.topicBreakdown.slice(0, 1).map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.topic}</span>
                    <span className="text-sm font-bold text-red-600">-{item.marksLost} marks</span>
                  </div>
                  <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {item.correct}/{item.attempted} correct ({item.accuracy}%)
                  </div>
                  <button className="w-full px-3 py-2 text-xs font-bold transition-opacity hover:opacity-90" style={{ background: 'var(--accent-primary)', color: '#ffffff' }}>
                    View Fix Plan
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="p-5" style={{ background: '#eff6ff', borderLeft: '4px solid #2563eb' }}>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2563eb' }} />
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: '#1e3a8a' }}>AI Strategic Insight</div>
                <p className="text-xs leading-relaxed" style={{ color: '#1e40af' }}>
                  {currentTest.aiInsight}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detailed Mode */}
      {viewMode === 'detailed' && (
        <>
          {/* Mistake Clusters */}
          <div className="p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Mistake Pattern Analysis</h3>
            <div className="space-y-4">
              {currentTest.mistakeClusters.map((cluster, idx) => (
                <div key={idx} className="pl-4" style={{ borderLeft: '4px solid var(--border-medium)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{cluster.type} Errors</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{cluster.count} mistakes</span>
                      <span className="text-sm font-bold text-red-600">-{cluster.marksLost} marks</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto whitespace-nowrap min-w-max md:min-w-0 md:overflow-visible mb-2">
                    <div className="inline-flex gap-2">
                    {cluster.topics.map((topic, tidx) => (
                      <span key={tidx} className="px-2 py-1 text-xs font-semibold" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        {topic}
                      </span>
                    ))}
                    </div>
                  </div>
                  <div className="w-full h-2" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-2 bg-red-600" style={{ width: `${cluster.percentage}%` }} />
                  </div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>{cluster.percentage}% of total errors</div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Breakdown */}
          <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Marks Lost by Topic</h3>
            <div className="space-y-4">
              {currentTest.topicBreakdown.map((item, idx) => (
                <div key={idx} className="p-4" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{item.topic}</div>
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {item.correct}/{item.attempted} correct
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-600 mb-1">-{item.marksLost} marks</div>
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.accuracy}% accuracy</div>
                    </div>
                  </div>
                  
                  <div className="w-full h-2 mb-3" style={{ background: 'var(--border-soft)' }}>
                    <div 
                      className="h-2 transition-all"
                      style={{
                        width: `${item.accuracy}%`,
                        background: item.accuracy < 65 ? '#dc2626' : item.accuracy < 80 ? '#f59e0b' : '#10b981'
                      }}
                    />
                  </div>

                  {item.marksLost >= 4 && (
                    <button className="w-full px-3 py-2 text-xs font-bold transition-opacity hover:opacity-90" style={{ background: 'var(--accent-primary)', color: '#ffffff' }}>
                      View Fix Plan
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Visual Mode */}
      {viewMode === 'visual' && (
        <>
          {/* Score Trend Chart */}
          <div className="p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Performance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={currentTest.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
                <XAxis dataKey="test" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-medium)',
                    borderRadius: 0
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="#5B5F8D" strokeWidth={2} name="Score" />
                <Line type="monotone" dataKey="percentile" stroke="#10b981" strokeWidth={2} name="Percentile" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            {/* Mistake Distribution */}
            <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Mistake Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={currentTest.mistakeClusters}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.type}: ${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {currentTest.mistakeClusters.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Topic Accuracy */}
            <div className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Topic-wise Accuracy</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={currentTest.topicBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
                  <XAxis dataKey="topic" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
                  <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--bg-card)', 
                      border: '1px solid var(--border-medium)',
                      borderRadius: 0
                    }} 
                  />
                  <Bar dataKey="accuracy" fill="#5B5F8D" name="Accuracy %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

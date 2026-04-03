import { useState } from 'react';
import { Zap } from 'lucide-react';

export function PerformanceAnalytics() {
  const [selectedTest, setSelectedTest] = useState('mock-3');

  // Realistic dummy data - non-perfect performance
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
        { 
          type: 'Conceptual', 
          count: 5, 
          topics: ['Lenz Law', 'Faraday Law'],
          marksLost: 12,
          percentage: 42
        },
        { 
          type: 'Careless', 
          count: 3, 
          topics: ['Sign Errors', 'Unit Conversion'],
          marksLost: 6,
          percentage: 27
        },
        { 
          type: 'Time Pressure', 
          count: 2, 
          topics: ['Complex Numericals'],
          marksLost: 5,
          percentage: 18
        },
      ],
      topicBreakdown: [
        { topic: 'Electromagnetic Induction', attempted: 8, correct: 5, marksLost: 6, accuracy: 63 },
        { topic: 'Rotational Dynamics', attempted: 10, correct: 8, marksLost: 4, accuracy: 80 },
        { topic: 'Thermodynamics', attempted: 6, correct: 5, marksLost: 2, accuracy: 83 },
        { topic: 'Wave Optics', attempted: 9, correct: 7, marksLost: 3, accuracy: 78 },
      ],
      aiInsight: 'Improving Electromagnetic Induction accuracy by 15% could add ~8 marks to your score.'
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
        { 
          type: 'Conceptual', 
          count: 6, 
          topics: ['Organic Mechanisms', 'Reaction Pathways'],
          marksLost: 14,
          percentage: 48
        },
        { 
          type: 'Time Pressure', 
          count: 4, 
          topics: ['Multi-step Problems'],
          marksLost: 8,
          percentage: 31
        },
        { 
          type: 'Careless', 
          count: 2, 
          topics: ['Formula Mistakes'],
          marksLost: 4,
          percentage: 15
        },
      ],
      topicBreakdown: [
        { topic: 'Organic Chemistry', attempted: 12, correct: 7, marksLost: 10, accuracy: 58 },
        { topic: 'Chemical Bonding', attempted: 8, correct: 6, marksLost: 4, accuracy: 75 },
        { topic: 'Periodic Table', attempted: 7, correct: 7, marksLost: 0, accuracy: 100 },
        { topic: 'Thermochemistry', attempted: 9, correct: 7, marksLost: 4, accuracy: 78 },
      ],
      aiInsight: 'Focus on Organic Chemistry mechanisms. This topic alone accounts for 45% of your lost marks.'
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
        { 
          type: 'Careless', 
          count: 4, 
          topics: ['Calculation Errors', 'Algebraic Mistakes'],
          marksLost: 8,
          percentage: 50
        },
        { 
          type: 'Conceptual', 
          count: 2, 
          topics: ['Integration Techniques'],
          marksLost: 5,
          percentage: 31
        },
        { 
          type: 'Time Pressure', 
          count: 1, 
          topics: ['Complex Word Problems'],
          marksLost: 3,
          percentage: 19
        },
      ],
      topicBreakdown: [
        { topic: 'Calculus', attempted: 15, correct: 13, marksLost: 4, accuracy: 87 },
        { topic: 'Algebra', attempted: 12, correct: 11, marksLost: 2, accuracy: 92 },
        { topic: '3D Geometry', attempted: 10, correct: 8, marksLost: 4, accuracy: 80 },
        { topic: 'Probability', attempted: 8, correct: 7, marksLost: 2, accuracy: 88 },
      ],
      aiInsight: 'Strong performance overall. Reducing careless errors could push you to 98+ score.'
    }
  };

  const currentTest = testData[selectedTest as keyof typeof testData];
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Performance Analytics</h1>
        <p className="text-sm text-slate-600">
          Deep analysis of test performance and mistake patterns
        </p>
      </div>

      {/* Test Selector */}
      <div className="mb-6">
        <div className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Select Test</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(testData).map(([key, test]) => (
            <button
              key={key}
              onClick={() => setSelectedTest(key)}
              className="px-4 py-3 text-left transition-all min-w-0"
              style={{
                background: selectedTest === key ? 'var(--accent-primary)' : '#ffffff',
                color: selectedTest === key ? '#ffffff' : 'var(--text-primary)',
                border: selectedTest === key ? 'none' : '2px solid var(--border-soft)',
                flex: '1'
              }}
            >
              <div className="text-xs font-bold mb-1">{test.name}</div>
              <div className="text-xs opacity-70">{test.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-slate-200 p-5">
          <div className="text-xs text-slate-600 mb-2">Score</div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{currentTest.score}/{currentTest.maxScore}</div>
          <div className="text-xs text-slate-600">{currentTest.percentile}th percentile</div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-5">
          <div className="text-xs text-slate-600 mb-2">Accuracy</div>
          <div className="text-3xl font-bold text-slate-900 mb-3">{currentTest.accuracy}%</div>
          <div className="w-full bg-slate-200 h-2">
            <div className="bg-slate-900 h-2" style={{ width: `${currentTest.accuracy}%` }} />
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-5">
          <div className="text-xs text-slate-600 mb-2">Speed</div>
          <div className="text-3xl font-bold text-slate-900 mb-3">{currentTest.speed}%</div>
          <div className="w-full bg-slate-200 h-2">
            <div className="bg-slate-900 h-2" style={{ width: `${currentTest.speed}%` }} />
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-5">
          <div className="text-xs text-slate-600 mb-2">Attempt Efficiency</div>
          <div className="text-3xl font-bold text-slate-900 mb-3">{currentTest.attemptEfficiency}%</div>
          <div className="w-full bg-slate-200 h-2">
            <div className="bg-slate-900 h-2" style={{ width: `${currentTest.attemptEfficiency}%` }} />
          </div>
        </div>
      </div>

      {/* Mistake Clusters */}
      <div className="bg-white border-2 border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Mistake Pattern Analysis</h3>
        <p className="text-xs text-slate-600 mb-5">
          Understanding why you lost marks helps target improvement efforts
        </p>

        <div className="space-y-4">
          {currentTest.mistakeClusters.map((cluster, idx) => (
            <div key={idx} className="border-l-4 border-slate-300 pl-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{cluster.type} Errors</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600">{cluster.count} mistakes</span>
                  <span className="text-sm font-bold text-red-600">-{cluster.marksLost} marks</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {cluster.topics.map((topic, tidx) => (
                  <span key={tidx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold">
                    {topic}
                  </span>
                ))}
              </div>
              <div className="w-full bg-slate-200 h-2">
                <div className="bg-red-600 h-2" style={{ width: `${cluster.percentage}%` }} />
              </div>
              <div className="mt-1 text-xs text-slate-600">{cluster.percentage}% of total errors</div>
            </div>
          ))}
        </div>
      </div>

      {/* Marks Lost Analysis */}
      <div className="bg-white border-2 border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Marks Lost by Topic</h3>
        <p className="text-xs text-slate-600 mb-5">
          Topic-wise breakdown showing where improvement will have maximum impact
        </p>

        <div className="space-y-4">
          {currentTest.topicBreakdown.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 mb-1">{item.topic}</div>
                  <div className="text-xs text-slate-600">
                    {item.correct}/{item.attempted} correct
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600 mb-1">-{item.marksLost} marks</div>
                  <div className="text-xs text-slate-600">{item.accuracy}% accuracy</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 bg-slate-200 h-2 mr-3">
                  <div 
                    className={`h-2 ${item.accuracy < 65 ? 'bg-red-600' : item.accuracy < 80 ? 'bg-orange-600' : 'bg-emerald-600'}`}
                    style={{ width: `${item.accuracy}%` }} 
                  />
                </div>
              </div>

              {item.marksLost >= 6 && (
                <button className="mt-3 w-full px-3 py-2 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800">
                  View Fix Plan
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-5">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-blue-900 mb-2">AI Strategic Insight</div>
            <p className="text-xs text-blue-800 leading-relaxed">
              {currentTest.aiInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Target, AlertCircle, BookOpen, Play, Clock } from 'lucide-react';

interface LearningAnalyticsProps {
  subject?: 'physics' | 'chemistry' | 'math';
}

export function LearningAnalytics({ subject = 'physics' }: LearningAnalyticsProps) {
  const [selectedSubject, setSelectedSubject] = useState(subject);

  // Realistic dummy data - non-perfect scores
  const subjectData = {
    physics: {
      name: 'Physics',
      mastery: 62,
      retention: 58,
      practiceAccuracy: 67,
      timeSpent: '24h 35m',
      weakTopics: [
        { name: 'Electromagnetic Induction', severity: 'High', accuracy: 45, lastPracticed: '2 days ago' },
        { name: 'Rotational Dynamics', severity: 'Medium', accuracy: 58, lastPracticed: '1 day ago' },
        { name: 'Wave Optics', severity: 'Low', accuracy: 64, lastPracticed: '4 days ago' },
      ],
      strongTopics: [
        { name: 'Thermodynamics', accuracy: 88 },
        { name: 'Modern Physics', accuracy: 82 },
        { name: 'Kinematics', accuracy: 79 },
      ],
      learningLoop: {
        learn: 78,
        practice: 65,
        test: 58,
        bottleneck: 'test'
      },
      timeVsOutcome: [
        { topic: 'EM Induction', timeSpent: 180, accuracy: 45 },
        { topic: 'Thermodynamics', timeSpent: 120, accuracy: 88 },
        { topic: 'Rotation', timeSpent: 150, accuracy: 58 },
        { topic: 'Waves', timeSpent: 90, accuracy: 64 },
      ]
    },
    chemistry: {
      name: 'Chemistry',
      mastery: 71,
      retention: 64,
      practiceAccuracy: 73,
      timeSpent: '19h 42m',
      weakTopics: [
        { name: 'Organic Mechanisms', severity: 'High', accuracy: 52, lastPracticed: '1 day ago' },
        { name: 'Chemical Bonding', severity: 'Medium', accuracy: 61, lastPracticed: '3 days ago' },
      ],
      strongTopics: [
        { name: 'Periodic Table', accuracy: 91 },
        { name: 'Stoichiometry', accuracy: 85 },
        { name: 'Thermochemistry', accuracy: 80 },
      ],
      learningLoop: {
        learn: 82,
        practice: 71,
        test: 69,
        bottleneck: 'practice'
      },
      timeVsOutcome: [
        { topic: 'Organic', timeSpent: 200, accuracy: 52 },
        { topic: 'Periodic Table', timeSpent: 100, accuracy: 91 },
        { topic: 'Bonding', timeSpent: 140, accuracy: 61 },
        { topic: 'Stoichiometry', timeSpent: 80, accuracy: 85 },
      ]
    },
    math: {
      name: 'Mathematics',
      mastery: 68,
      retention: 72,
      practiceAccuracy: 70,
      timeSpent: '28h 18m',
      weakTopics: [
        { name: 'Integration by Parts', severity: 'Medium', accuracy: 58, lastPracticed: '2 days ago' },
        { name: 'Complex Numbers', severity: 'Medium', accuracy: 60, lastPracticed: '1 day ago' },
        { name: '3D Geometry', severity: 'Low', accuracy: 66, lastPracticed: '5 days ago' },
      ],
      strongTopics: [
        { name: 'Differential Equations', accuracy: 86 },
        { name: 'Trigonometry', accuracy: 84 },
        { name: 'Matrices', accuracy: 81 },
      ],
      learningLoop: {
        learn: 85,
        practice: 68,
        test: 66,
        bottleneck: 'test'
      },
      timeVsOutcome: [
        { topic: 'Integration', timeSpent: 220, accuracy: 58 },
        { topic: 'Diff Equations', timeSpent: 180, accuracy: 86 },
        { topic: 'Complex', timeSpent: 160, accuracy: 60 },
        { topic: 'Matrices', timeSpent: 110, accuracy: 81 },
      ]
    }
  };

  const currentData = subjectData[selectedSubject];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Learning Analytics</h1>
        <p className="text-sm text-slate-600">
          Deep insights into your learning effectiveness and mastery patterns
        </p>
      </div>

      {/* Subject Selector */}
      <div className="mb-6 flex flex-wrap gap-3">
        {(['physics', 'chemistry', 'math'] as const).map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className="px-4 py-2 text-xs font-bold transition-all"
            style={{
              background: selectedSubject === subj ? 'var(--accent-primary)' : '#ffffff',
              color: selectedSubject === subj ? '#ffffff' : 'var(--text-secondary)',
              border: selectedSubject === subj ? 'none' : '2px solid var(--border-soft)'
            }}
          >
            {subj === 'physics' ? 'Physics' : subj === 'chemistry' ? 'Chemistry' : 'Mathematics'}
          </button>
        ))}
      </div>

      {/* Mastery Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-slate-200 p-5">
          <div className="text-xs text-slate-600 mb-2">Overall Mastery</div>
          <div className="text-3xl font-bold text-slate-900 mb-3">{currentData.mastery}%</div>
          <div className="w-full bg-slate-200 h-2">
            <div
              className="bg-slate-900 h-2"
              style={{ width: `${currentData.mastery}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Deep understanding level
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-5">
          <div className="text-xs text-slate-600 mb-2">Retention Rate</div>
          <div className="text-3xl font-bold text-slate-900 mb-3">{currentData.retention}%</div>
          <div className="w-full bg-slate-200 h-2">
            <div
              className={`h-2 ${currentData.retention < 60 ? 'bg-orange-600' : 'bg-slate-900'}`}
              style={{ width: `${currentData.retention}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Memory strength over time
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-5">
          <div className="text-xs text-slate-600 mb-2">Practice Accuracy</div>
          <div className="text-3xl font-bold text-slate-900 mb-3">{currentData.practiceAccuracy}%</div>
          <div className="w-full bg-slate-200 h-2">
            <div
              className="bg-slate-900 h-2"
              style={{ width: `${currentData.practiceAccuracy}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Success rate in practice
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 p-5">
          <div className="text-xs text-slate-600 mb-2">Time Invested</div>
          <div className="text-3xl font-bold text-slate-900 mb-3">{currentData.timeSpent}</div>
          <div className="flex items-center gap-2 mt-3">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-600">Last 30 days</span>
          </div>
        </div>
      </div>

      {/* Learn → Practice → Test Loop */}
      <div className="bg-white border-2 border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Learn → Practice → Test Loop</h3>
        <p className="text-xs text-slate-600 mb-5">
          Effectiveness at each stage of your learning process
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className={`p-4 border-2 ${currentData.learningLoop.bottleneck === 'learn' ? 'border-orange-600 bg-orange-50' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-bold text-slate-900">Learn</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-2">{currentData.learningLoop.learn}%</div>
            <div className="w-full bg-slate-200 h-2">
              <div className="bg-slate-900 h-2" style={{ width: `${currentData.learningLoop.learn}%` }} />
            </div>
          </div>

          <div className={`p-4 border-2 ${currentData.learningLoop.bottleneck === 'practice' ? 'border-orange-600 bg-orange-50' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Play className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-bold text-slate-900">Practice</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-2">{currentData.learningLoop.practice}%</div>
            <div className="w-full bg-slate-200 h-2">
              <div className="bg-slate-900 h-2" style={{ width: `${currentData.learningLoop.practice}%` }} />
            </div>
          </div>

          <div className={`p-4 border-2 ${currentData.learningLoop.bottleneck === 'test' ? 'border-orange-600 bg-orange-50' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-bold text-slate-900">Test</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-2">{currentData.learningLoop.test}%</div>
            <div className="w-full bg-slate-200 h-2">
              <div className="bg-slate-900 h-2" style={{ width: `${currentData.learningLoop.test}%` }} />
            </div>
          </div>
        </div>

        {currentData.learningLoop.bottleneck && (
          <div className="bg-orange-50 border-l-4 border-orange-600 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-orange-900 mb-1">Bottleneck Identified</div>
                <p className="text-xs text-orange-800">
                  Your {currentData.learningLoop.bottleneck} stage needs attention. 
                  {currentData.learningLoop.bottleneck === 'test' && ' Consider taking more self-assessment tests to build exam confidence.'}
                  {currentData.learningLoop.bottleneck === 'practice' && ' Increase practice volume to strengthen application skills.'}
                  {currentData.learningLoop.bottleneck === 'learn' && ' Review fundamental concepts before moving to practice.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time vs Outcome Analysis */}
      <div className="bg-white border-2 border-slate-200 p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Time Investment vs Outcome</h3>
        <p className="text-xs text-slate-600 mb-5">
          Efficiency of your study time by topic
        </p>

        <div className="space-y-4">
          {currentData.timeVsOutcome.map((item, idx) => (
            <div key={idx} className="border-l-4 border-slate-300 pl-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{item.topic}</span>
                <span className={`text-xs font-bold ${item.accuracy < 60 ? 'text-red-600' : item.accuracy > 80 ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {item.accuracy}% accuracy
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span>{item.timeSpent} mins invested</span>
                <span className="text-slate-400">•</span>
                <span className={item.accuracy < 60 && item.timeSpent > 150 ? 'text-orange-600 font-bold' : ''}>
                  {item.accuracy < 60 && item.timeSpent > 150 ? 'High time, low output' : 'Reasonable efficiency'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak vs Strong Topics */}
      <div className="grid grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4">Weak Topics</h3>
          <div className="space-y-3">
            {currentData.weakTopics.map((topic, idx) => (
              <div key={idx} className="bg-white border-2 border-red-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900 mb-1">{topic.name}</div>
                    <div className="text-xs text-slate-600">Last: {topic.lastPracticed}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold ${
                    topic.severity === 'High' ? 'bg-red-100 text-red-800' :
                    topic.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {topic.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-600">Accuracy</span>
                  <span className="text-sm font-bold text-red-600">{topic.accuracy}%</span>
                </div>
                <button className="w-full px-3 py-2 bg-red-600 text-white text-xs font-bold hover:bg-red-700">
                  Fix Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Topics */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4">Strong Topics</h3>
          <div className="space-y-3">
            {currentData.strongTopics.map((topic, idx) => (
              <div key={idx} className="bg-white border-2 border-emerald-200 p-4">
                <div className="text-sm font-bold text-slate-900 mb-3">{topic.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Accuracy</span>
                  <span className="text-sm font-bold text-emerald-600">{topic.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

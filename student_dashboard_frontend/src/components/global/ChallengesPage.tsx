import { useState } from 'react';
import { Zap, TrendingUp, Clock, Users, Target, Award, AlertCircle } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  duration: string;
  expectedImpact: string;
  participants: number;
  deadline: string;
  progress?: number;
  status: 'available' | 'active' | 'completed';
}

interface MicroChallenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  target: string;
  recommended: boolean;
}

interface ChallengeResult {
  id: string;
  challengeTitle: string;
  percentile: number;
  improvementDelta: string;
  completedAt: string;
  insight: string;
}

export function ChallengesPage() {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [hasAcceptedMicroToday, setHasAcceptedMicroToday] = useState(false);

  // Mock data
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Thermodynamics Mastery Sprint',
      topic: 'Thermodynamics',
      difficulty: 'Advanced',
      duration: '3 days',
      expectedImpact: '+8–12 marks',
      participants: 142,
      deadline: '2 days left',
      status: 'available',
    },
    {
      id: '2',
      title: 'Organic Reaction Speed Drill',
      topic: 'Organic Chemistry',
      difficulty: 'Intermediate',
      duration: '5 days',
      expectedImpact: '+6–10 marks',
      participants: 218,
      deadline: '4 days left',
      status: 'available',
    },
    {
      id: '3',
      title: 'Calculus Accuracy Boost',
      topic: 'Calculus',
      difficulty: 'Advanced',
      duration: '4 days',
      expectedImpact: '+10–15 marks',
      participants: 89,
      deadline: '1 day left',
      status: 'available',
    },
  ];

  const microChallenges: MicroChallenge[] = [
    {
      id: '1',
      title: '10 PYQs in 20 Minutes',
      description: 'Past year questions from Thermodynamics',
      duration: '20 min',
      target: 'Speed',
      recommended: true,
    },
    {
      id: '2',
      title: 'Accuracy Drill: 85%+',
      description: 'Coordinate Geometry fundamentals',
      duration: '15 min',
      target: 'Accuracy',
      recommended: false,
    },
    {
      id: '3',
      title: 'Concept Clarity Sprint',
      description: 'Quick revision of 5 core concepts',
      duration: '12 min',
      target: 'Clarity',
      recommended: false,
    },
  ];

  const pastResults: ChallengeResult[] = [
    {
      id: '1',
      challengeTitle: 'Electromagnetism Speed Test',
      percentile: 78,
      improvementDelta: '+12% speed',
      completedAt: '3 days ago',
      insight: 'Your problem-solving speed improved by 12%. Consider similar drills for Optics.',
    },
    {
      id: '2',
      challengeTitle: 'Algebra Accuracy Focus',
      percentile: 65,
      improvementDelta: '+8% accuracy',
      completedAt: '1 week ago',
      insight: 'Accuracy increased in inequality problems. Weak area: Complex numbers.',
    },
  ];

  const handleJoinChallenge = (challengeId: string) => {
    if (!activeChallenge) {
      setActiveChallenge(challengeId);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Foundation':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-slate-50 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-6 h-6" style={{ color: '#5B5F8D' }} />
            <h1 className="text-2xl font-bold text-slate-900">Challenges</h1>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Time-bound performance sharpening. Not pressure. No infinite streaks. Only focused improvement.
          </p>
        </div>

        {/* Safety Banner */}
        <div className="mb-6 p-4 bg-slate-100 border-l-4 border-slate-800">
          <div className="text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">
            Challenge Rules
          </div>
          <div className="text-xs text-slate-700">
            Max 1 active challenge • Auto-exit after completion • No streak pressure • Private results only
          </div>
        </div>

        {activeChallenge && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-600">
            <div className="text-xs font-semibold text-amber-900 mb-1">
              Active Challenge in Progress
            </div>
            <div className="text-xs text-amber-800">
              Complete your current challenge before joining a new one.
            </div>
          </div>
        )}

        {/* Active Challenges Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Active Challenges
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-5 border-2 transition-all ${
                  activeChallenge === challenge.id
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mb-3">
                  <div className="text-sm font-bold text-slate-900 mb-2">
                    {challenge.title}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-1 border font-semibold ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200">
                      {challenge.topic}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Duration</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {challenge.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Expected Impact</span>
                    </div>
                    <span className="font-bold text-emerald-600">
                      {challenge.expectedImpact}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Users className="w-3.5 h-3.5" />
                      <span>Participants</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {challenge.participants}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Deadline</span>
                    </div>
                    <span className="font-bold text-red-600">
                      {challenge.deadline}
                    </span>
                  </div>
                </div>

                {activeChallenge === challenge.id ? (
                  <div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-bold text-slate-900">68%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2">
                        <div
                          className="bg-slate-800 h-2 transition-all"
                          style={{ width: '68%' }}
                        ></div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-3 bg-slate-800 text-white text-xs font-bold uppercase tracking-wide">
                      Continue Challenge
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    disabled={!!activeChallenge}
                    className={`w-full px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${
                      activeChallenge
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                    }`}
                  >
                    Join Challenge
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Micro-Challenges Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Micro-Challenges (Daily Optional)
            </h2>
          </div>

          {hasAcceptedMicroToday && (
            <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-600">
              <div className="text-xs font-semibold text-amber-900">
                You've started a micro-challenge today. Come back tomorrow for more.
              </div>
            </div>
          )}

          <div className="space-y-3">
            {microChallenges.map((micro, index) => (
              <div
                key={micro.id}
                className={`p-4 border-2 transition-all ${
                  micro.recommended && index === 0
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm font-bold text-slate-900">
                        {micro.title}
                      </div>
                      {micro.recommended && (
                        <span className="text-xs px-2 py-0.5 bg-slate-800 text-white font-semibold">
                          AI Suggested
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 mb-2">
                      {micro.description}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{micro.duration}</span>
                      <span>•</span>
                      <span className="font-semibold">Target: {micro.target}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setHasAcceptedMicroToday(true)}
                    disabled={hasAcceptedMicroToday}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ml-4 ${
                      hasAcceptedMicroToday
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                    }`}
                  >
                    Start Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results View Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Your Results (Private)
            </h2>
          </div>

          <div className="space-y-4">
            {pastResults.map((result) => (
              <div
                key={result.id}
                className="p-5 border-2 border-slate-200 bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900 mb-1">
                      {result.challengeTitle}
                    </div>
                    <div className="text-xs text-slate-500">
                      Completed {result.completedAt}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1">Percentile</div>
                    <div className="text-xl font-bold text-slate-900">
                      {result.percentile}
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1">Improvement</div>
                    <div className="text-xl font-bold text-emerald-600">
                      {result.improvementDelta}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border-l-4 border-blue-600">
                  <div className="text-xs font-semibold text-blue-900 mb-1">
                    AI Insight
                  </div>
                  <div className="text-xs text-blue-800">{result.insight}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-white border-2 border-slate-200">
          <div className="text-xs text-slate-600 text-center">
            Challenges are optional. They auto-hide during Focus Mode.
          </div>
        </div>
      </div>
    </div>
  );
}
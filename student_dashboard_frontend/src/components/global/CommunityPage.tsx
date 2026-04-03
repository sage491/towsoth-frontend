import { useState } from 'react';
import { Users, ChevronDown, ChevronUp, BookOpen, HelpCircle, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CommunityDoubt, CommunityStrategyPost, CommunityStudyCircle } from '@/features/student/community/types';

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  sectionKey: string;
  description: string;
}

export function CommunityPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [hasPostedDoubtToday] = useState(false);
  const [activeCircle, setActiveCircle] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Mock data
  const studyCircles: CommunityStudyCircle[] = [
    {
      id: '1',
      name: 'JEE Advanced Physics Focus',
      exam: 'JEE Advanced',
      subject: 'Physics',
      phase: 'Revision',
      memberCount: 8,
      avgStudyHours: 6.2,
      currentFocus: ['Electromagnetism', 'Thermodynamics'],
      lastActive: '2 hours ago',
      isJoined: false,
    },
    {
      id: '2',
      name: 'NEET Biology Mastery',
      exam: 'NEET',
      subject: 'Biology',
      phase: 'Practice',
      memberCount: 12,
      avgStudyHours: 5.8,
      currentFocus: ['Human Physiology', 'Genetics'],
      lastActive: '5 hours ago',
      isJoined: false,
    },
    {
      id: '3',
      name: 'JEE Maths Problem Solving',
      exam: 'JEE Advanced',
      subject: 'Mathematics',
      phase: 'Deep Practice',
      memberCount: 7,
      avgStudyHours: 7.1,
      currentFocus: ['Calculus', 'Coordinate Geometry'],
      lastActive: '1 hour ago',
      isJoined: false,
    },
  ];

  const strategyPosts: CommunityStrategyPost[] = [
    {
      id: '1',
      title: 'How I improved from 120 → 168 in Physics',
      author: 'Anonymous Student',
      improvement: '+48 marks',
      readTime: '6 min',
      topics: ['Strategy', 'Physics', 'Revision'],
      verified: true,
    },
    {
      id: '2',
      title: 'My weekly revision system that works',
      author: 'Anonymous Student',
      improvement: 'Retention +32%',
      readTime: '4 min',
      topics: ['Strategy', 'Time Management'],
      verified: true,
    },
    {
      id: '3',
      title: 'Reducing silly mistakes: A systematic approach',
      author: 'Anonymous Student',
      improvement: 'Accuracy +15%',
      readTime: '5 min',
      topics: ['Strategy', 'Accuracy'],
      verified: false,
    },
  ];

  const recentDoubts: CommunityDoubt[] = [
    {
      id: '1',
      question: 'How to approach complex integration by parts problems?',
      subject: 'Mathematics',
      similarDoubts: 3,
      status: 'answered',
      answers: 2,
    },
    {
      id: '2',
      question: 'Confusion in Lenz Law direction determination',
      subject: 'Physics',
      similarDoubts: 5,
      status: 'answered',
      answers: 4,
    },
    {
      id: '3',
      question: 'Difference between photosynthesis C3 and C4 pathways',
      subject: 'Biology',
      similarDoubts: 2,
      status: 'pending',
      answers: 1,
    },
  ];

  const handleJoinCircle = (circleId: string) => {
    if (!activeCircle) {
      setActiveCircle(circleId);
    }
  };

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    description 
  }: SectionHeaderProps) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-4 border-2 border-slate-200 hover:border-slate-300 transition-colors bg-white"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-700" />
        <div className="text-left">
          <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            {title}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {description}
          </div>
        </div>
      </div>
      {expandedSection === sectionKey ? (
        <ChevronUp className="w-5 h-5 text-slate-600" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-6 h-6" style={{ color: '#5B5F8D' }} />
            <h1 className="text-2xl font-bold text-slate-900">Community</h1>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Purposeful exposure to peer learning. Not social media. No infinite scroll. Only insight.
          </p>
        </div>

        {/* Safety Banner */}
        <div className="mb-6 p-4 bg-slate-100 border-l-4 border-slate-800">
          <div className="text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">
            Community Rules
          </div>
          <div className="text-xs text-slate-700">
            One active study circle • One doubt per day • No free chat • Moderated content only
          </div>
        </div>

        <div className="space-y-4">
          {/* Study Circles Section */}
          <div>
            <SectionHeader
              title="Study Circles"
              icon={Users}
              sectionKey="circles"
              description="Small, focused groups (5–12 students)"
            />
            
            {expandedSection === 'circles' && (
              <div className="border-2 border-t-0 border-slate-200 p-6 bg-white">
                {activeCircle && (
                  <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-600">
                    <div className="text-xs font-semibold text-amber-900">
                      You have 1 active circle. Leave it to join another.
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyCircles.map((circle) => (
                    <div
                      key={circle.id}
                      className={`p-4 border-2 transition-all ${
                        activeCircle === circle.id
                          ? 'border-slate-800 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="mb-3">
                        <div className="text-sm font-bold text-slate-900 mb-1">
                          {circle.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{circle.exam}</span>
                          <span>•</span>
                          <span>{circle.subject}</span>
                          <span>•</span>
                          <span>{circle.memberCount} members</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Avg Study Hours</span>
                          <span className="font-bold text-slate-900">
                            {circle.avgStudyHours}h/day
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Phase</span>
                          <span className="font-bold text-slate-900">
                            {circle.phase}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Last Active</span>
                          <span className="font-bold text-slate-900">
                            {circle.lastActive}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs text-slate-600 mb-1">Current Focus:</div>
                        <div className="flex flex-wrap gap-1">
                          {circle.currentFocus.map((topic, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {activeCircle === circle.id ? (
                        <button className="w-full px-4 py-2 bg-slate-800 text-white text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          Active Circle
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinCircle(circle.id)}
                          disabled={!!activeCircle}
                          className={`w-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                            activeCircle
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              : 'bg-slate-800 hover:bg-slate-900 text-white'
                          }`}
                        >
                          Join Circle
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Strategy Boards Section */}
          <div>
            <SectionHeader
              title="Strategy Boards"
              icon={BookOpen}
              sectionKey="strategy"
              description="Curated, structured learning posts"
            />
            
            {expandedSection === 'strategy' && (
              <div className="border-2 border-t-0 border-slate-200 p-6 bg-white">
                <div className="space-y-3">
                  {strategyPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 border-2 border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-slate-900">
                              {post.title}
                            </h3>
                            {post.verified && (
                              <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{post.author}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-semibold">
                              {post.improvement}
                            </span>
                            <span>•</span>
                            <span>{post.readTime} read</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                        Read Strategy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Doubt Exchange Section */}
          <div>
            <SectionHeader
              title="Doubt Exchange"
              icon={HelpCircle}
              sectionKey="doubts"
              description="Limited, AI-assisted doubt resolution"
            />
            
            {expandedSection === 'doubts' && (
              <div className="border-2 border-t-0 border-slate-200 p-6 bg-white">
                {hasPostedDoubtToday && (
                  <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-600">
                    <div className="text-xs font-semibold text-amber-900">
                      Daily limit reached. You can post another doubt tomorrow.
                    </div>
                  </div>
                )}

                {!hasPostedDoubtToday && (
                  <div className="mb-4 p-4 border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors cursor-pointer">
                    <div className="text-center">
                      <HelpCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <div className="text-xs font-semibold text-slate-900 mb-1">
                        Post a Doubt
                      </div>
                      <div className="text-xs text-slate-500 mb-3">
                        AI will suggest similar doubts first • 1 doubt per day
                      </div>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                        Ask Doubt
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                    Recent Doubts
                  </div>
                  {recentDoubts.map((doubt) => (
                    <div
                      key={doubt.id}
                      className="p-4 border-2 border-slate-200 hover:border-slate-300 transition-all"
                    >
                      <div className="mb-2">
                        <div className="text-sm font-semibold text-slate-900 mb-1">
                          {doubt.question}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200">
                            {doubt.subject}
                          </span>
                          <span>•</span>
                          <span>{doubt.similarDoubts} similar doubts</span>
                          <span>•</span>
                          <span
                            className={
                              doubt.status === 'answered'
                                ? 'text-emerald-600 font-semibold'
                                : 'text-amber-600 font-semibold'
                            }
                          >
                            {doubt.answers} {doubt.answers === 1 ? 'answer' : 'answers'}
                          </span>
                        </div>
                      </div>

                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                        View Answers
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-white border-2 border-slate-200">
          <div className="text-xs text-slate-600 text-center">
            This is not social media. These features auto-hide during Focus Mode.
          </div>
        </div>
      </div>
    </div>
  );
}
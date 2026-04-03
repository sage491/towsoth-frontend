import { Play, FileText, Target, AlertCircle, Brain, Clock, CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PracticeWorkspace, MicroFixSession, LearningLoopPanel, AnalyticsView } from '@/features/subjects/components';
import { useSubjectsData } from '@/features/subjects/hooks';
import { SubjectsPageSubject } from './types';
import { buildRecursiveLearningReport } from '@/features/subjects/intelligence/recursiveLearningEngine';
import { generateLearningNarrative, getFallbackNarrative } from '@/features/subjects/intelligence/learningCoachLlm';

interface SubjectsPageProps {
  onNavigateToDashboard?: () => void;
}

export function SubjectsPage({ onNavigateToDashboard }: SubjectsPageProps) {
  const { subjects: subjectsQuery } = useSubjectsData();
  const subjects = (subjectsQuery.data ?? []) as SubjectsPageSubject[];

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const recursiveReport = useMemo(() => buildRecursiveLearningReport(subjects), [subjects]);
  const [llmCoachText, setLlmCoachText] = useState<string>(getFallbackNarrative(recursiveReport));

  useEffect(() => {
    let active = true;
    setLlmCoachText(getFallbackNarrative(recursiveReport));
    generateLearningNarrative(recursiveReport).then((message) => {
      if (!active) return;
      setLlmCoachText(message);
    });
    return () => {
      active = false;
    };
  }, [recursiveReport]);
  const [activeWorkspace, setActiveWorkspace] = useState<{
    type: 'practice' | 'fix' | 'loop' | 'analytics';
    subject?: SubjectsPageSubject;
    gapTopic?: string;
    loopType?: 'watch' | 'practice' | 'revise' | 'test';
  } | null>(null);

  const handleStartPractice = (subject: SubjectsPageSubject) => {
    setActiveWorkspace({ type: 'practice', subject });
  };

  const handleFixGap = (subject: SubjectsPageSubject, gapTopic: string) => {
    setActiveWorkspace({ type: 'fix', subject, gapTopic });
  };

  const handleOpenLoopPanel = (
    subject: SubjectsPageSubject,
    loopType: 'watch' | 'practice' | 'revise' | 'test'
  ) => {
    setActiveWorkspace({ type: 'loop', subject, loopType });
  };

  const handleOpenAnalytics = (subject: SubjectsPageSubject) => {
    setActiveWorkspace({ type: 'analytics', subject });
  };

  const handleContinueLearning = (subject: SubjectsPageSubject) => {
    // Smart routing logic
    const practicePercent = (subject.learningLoop.practiced.current / subject.learningLoop.practiced.total) * 100;
    const hasGaps = subject.weakClusters.length > 0;
    const revisionOverdue = subject.learningLoop.revised.current < subject.learningLoop.revised.total;

    if (practicePercent < 80) {
      handleStartPractice(subject);
    } else if (hasGaps) {
      handleFixGap(subject, subject.weakClusters[0]);
    } else if (revisionOverdue) {
      handleOpenLoopPanel(subject, 'revise');
    } else {
      handleOpenLoopPanel(subject, 'test');
    }
  };

  return (
    <div className="space-y-5">
      {/* Workspaces - Full Screen Overlays */}
      {activeWorkspace?.type === 'practice' && activeWorkspace.subject && (
        <PracticeWorkspace
          subject={activeWorkspace.subject.name}
          topic={activeWorkspace.subject.currentFocus}
          chapter={activeWorkspace.subject.chapter}
          questionCount={25}
          difficulty="adaptive"
          onClose={() => setActiveWorkspace(null)}
          onNavigateToDashboard={onNavigateToDashboard}
        />
      )}

      {activeWorkspace?.type === 'fix' && activeWorkspace.subject && activeWorkspace.gapTopic && (
        <MicroFixSession
          subject={activeWorkspace.subject.name}
          chapter={activeWorkspace.subject.chapter}
          gapTopic={activeWorkspace.gapTopic}
          onClose={() => setActiveWorkspace(null)}
          onNavigateToDashboard={onNavigateToDashboard}
          onComplete={() => {
            // Gap marked as improving
            alert('Gap improvement tracked!');
          }}
        />
      )}

      {activeWorkspace?.type === 'loop' && activeWorkspace.subject && activeWorkspace.loopType && (
        <LearningLoopPanel
          type={activeWorkspace.loopType}
          subject={activeWorkspace.subject.name}
          chapter={activeWorkspace.subject.chapter}
          data={activeWorkspace.subject.learningLoop}
          onClose={() => setActiveWorkspace(null)}
          onNavigateToDashboard={onNavigateToDashboard}
        />
      )}

      {/* Analytics View - Replaces Main Content */}
      {activeWorkspace?.type === 'analytics' && activeWorkspace.subject ? (
        <AnalyticsView
          subject={activeWorkspace.subject}
          onBack={() => setActiveWorkspace(null)}
          onStartRevision={() => handleOpenLoopPanel(activeWorkspace.subject!, 'revise')}
          onFixGap={(gap) => handleFixGap(activeWorkspace.subject!, gap)}
          onTakeTest={() => handleOpenLoopPanel(activeWorkspace.subject!, 'test')}
        />
      ) : (
        <>
          {/* Page Header */}
          <div className="border-l-4 border-blue-600 pl-4">
            <h1 className="text-xl font-bold text-slate-900">Subject Mastery System</h1>
            <p className="text-sm text-slate-600">Living learning loops • Adaptive difficulty • Intelligent recommendations</p>
          </div>

          {/* Main Layout: Left = Subjects, Right = AI */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* LEFT: Subject Cards (2/3 width) */}
            <div className="col-span-2 space-y-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className={`bg-white border-2 transition-all cursor-pointer ${
                    selectedSubject === subject.id
                      ? 'border-blue-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedSubject(subject.id === selectedSubject ? null : subject.id)}
                >
                  {/* Subject Header - Always Visible */}
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-lg font-bold text-slate-900">{subject.name}</h2>
                          <div
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                              subject.trend === 'rising'
                                ? 'bg-emerald-100 text-emerald-700'
                                : subject.trend === 'dropping'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {subject.trend}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 mb-3">
                          <span className="font-semibold">{subject.chapter}</span> • {subject.currentFocus}
                        </div>
                        <div className="w-full bg-slate-100 h-2 mb-2">
                          <div
                            className={`h-2 ${
                              subject.mastery >= 80
                                ? 'bg-emerald-500'
                                : subject.mastery >= 65
                                ? 'bg-blue-500'
                                : 'bg-orange-500'
                            }`}
                            style={{ width: `${subject.mastery}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Mastery: {subject.mastery}%</span>
                          <span>Last studied: {subject.lastStudied}</span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Retention</div>
                        <div className="text-3xl font-bold text-slate-900">{subject.retention}%</div>
                      </div>
                    </div>

                    {/* Next Action */}
                    <div className="flex items-center justify-between bg-blue-50 p-3 border-l-2 border-blue-500">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-slate-900">Next: {subject.nextAction}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartPractice(subject);
                        }}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors"
                      >
                        Start
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedSubject === subject.id && (
                    <div className="p-5 space-y-5">
                      {/* Learning Loop Progress */}
                      <div>
                        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                          Learning Loop Progress
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenLoopPanel(subject, 'watch');
                            }}
                            className="bg-slate-50 p-3 border border-slate-200 hover:border-blue-500 transition-all cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Play className="w-3.5 h-3.5 text-slate-600" />
                              <span className="text-[10px] uppercase text-slate-500 font-semibold">Watch</span>
                            </div>
                            <div className="text-lg font-bold text-slate-900">
                              {subject.learningLoop.watched.current}/{subject.learningLoop.watched.total}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">videos completed</div>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenLoopPanel(subject, 'practice');
                            }}
                            className="bg-slate-50 p-3 border border-slate-200 hover:border-blue-500 transition-all cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-3.5 h-3.5 text-slate-600" />
                              <span className="text-[10px] uppercase text-slate-500 font-semibold">Practice</span>
                            </div>
                            <div className="text-lg font-bold text-slate-900">
                              {subject.learningLoop.practiced.current}/{subject.learningLoop.practiced.total}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">problems solved</div>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenLoopPanel(subject, 'revise');
                            }}
                            className="bg-slate-50 p-3 border border-slate-200 hover:border-blue-500 transition-all cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-3.5 h-3.5 text-slate-600" />
                              <span className="text-[10px] uppercase text-slate-500 font-semibold">Revise</span>
                            </div>
                            <div className="text-lg font-bold text-slate-900">
                              {subject.learningLoop.revised.current}/{subject.learningLoop.revised.total}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">sessions done</div>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenLoopPanel(subject, 'test');
                            }}
                            className="bg-slate-50 p-3 border border-slate-200 hover:border-blue-500 transition-all cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                              <span className="text-[10px] uppercase text-slate-500 font-semibold">Test</span>
                            </div>
                            <div className="text-lg font-bold text-slate-900">
                              {subject.learningLoop.tested.current}/{subject.learningLoop.tested.total}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">tests taken</div>
                          </button>
                        </div>
                      </div>

                      {/* Weak Concepts - Critical Only */}
                      {subject.weakClusters.length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <h3 className="text-xs uppercase tracking-wider text-red-700 font-semibold">
                              Critical Gaps ({subject.weakClusters.length})
                            </h3>
                          </div>
                          <div className="space-y-2">
                            {subject.weakClusters.map((concept, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-3 border border-red-200">
                                <span className="text-xs font-semibold text-slate-900">{concept}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFixGap(subject, concept);
                                  }}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wide transition-colors"
                                >
                                  Fix Now
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <button
                          className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wide transition-colors"
                          onClick={() => handleContinueLearning(subject)}
                        >
                          Continue Learning
                        </button>
                        <button className="px-4 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold uppercase tracking-wide transition-colors">
                          Take Test
                        </button>
                        <button
                          className="px-4 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold uppercase tracking-wide transition-colors"
                          onClick={() => handleOpenAnalytics(subject)}
                        >
                          View Analytics
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT: AI Intelligence Panel (1/3 width) */}
            <div className="col-span-1 space-y-4">
              {/* AI Learning Recommendation */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold">
                    AI Recommends
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-900 mb-2">
                  Focus on {recursiveReport.focusSubject} today
                </div>
                <div className="text-xs text-slate-700 leading-relaxed mb-3">
                  {llmCoachText}
                </div>
                <div className="text-[11px] text-blue-800 font-semibold mb-2">
                  Knowledge score: {recursiveReport.overallKnowledgeScore}%
                </div>
                {recursiveReport.personalizedPlan[0] && (
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                    Start {recursiveReport.personalizedPlan[0].subject}
                  </button>
                )}
              </div>

              {/* What to Study Next */}
              <div className="bg-white border border-slate-200 p-5">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
                  Personalized Content Queue
                </div>
                <div className="space-y-3">
                  {recursiveReport.personalizedPlan.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                      <div className="flex-shrink-0 w-6 h-6 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-900">{item.subject} • {item.contentType}</div>
                        <div className="text-[10px] text-slate-600 mt-0.5">{item.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.reason}</div>
                      </div>
                      <div
                        className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700"
                      >
                        {item.minutes}m
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-white border border-slate-200 p-5">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
                  Error Intelligence
                </div>
                <div className="space-y-3">
                  {recursiveReport.errors.slice(0, 4).map((error) => (
                    <div key={`${error.subject}-${error.topic}`} className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">{error.topic}</span>
                      <span className="text-xs font-bold text-slate-900">
                        {error.category} ({Math.round(error.confidence * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concept Dependencies */}
              <div className="bg-purple-50 border border-purple-200 p-5">
                <div className="text-xs uppercase tracking-wider text-purple-700 font-semibold mb-3">
                  Dependency Alert
                </div>
                {recursiveReport.propagatedWeaknesses.slice(0, 2).map((item) => (
                  <div key={`${item.dependsOn}-${item.blockedTopic}`} className="mb-3 last:mb-0">
                    <div className="text-xs text-slate-900 font-semibold mb-1">
                      Master {item.dependsOn} first
                    </div>
                    <div className="text-[10px] text-slate-600 mb-2">
                      Required before: {item.blockedTopic}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-purple-200 h-1">
                        <div className="bg-purple-600 h-1" style={{ width: `${item.impactScore}%` }}></div>
                      </div>
                      <span className="text-[10px] text-purple-700 font-semibold">{item.impactScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
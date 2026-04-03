import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Target, Brain, Plus, Trash2, CheckCircle2, AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getRevisionPlannerConfig } from '@/services/plannerService';
import type { RevisionPlannerConfig } from '@/services/plannerService';
import type { NavigateToRoute } from '@/shared/config/routes';

interface RevisionPlanPageProps {
  onNavigate: NavigateToRoute;
}

interface RevisionBlock {
  id: string;
  subject: string;
  topics: string[];
  duration: number;
  timeSlot: string;
  priority: 'high' | 'medium' | 'low';
}

export function RevisionPlanPage({ onNavigate }: RevisionPlanPageProps) {
  const [plannerConfig, setPlannerConfig] = useState<RevisionPlannerConfig | null>(null);
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [planName, setPlanName] = useState('My Revision Plan');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [duration, setDuration] = useState(15);
  const [timeSlot, setTimeSlot] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [revisionBlocks, setRevisionBlocks] = useState<RevisionBlock[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getRevisionPlannerConfig()
      .then((config) => {
        if (!isMounted) return;
        setPlannerConfig(config);
        setSelectedSubject(config.subjects[0] ?? '');
        setTimeSlot(config.timeSlots[0] ?? '');
      })
      .finally(() => {
        if (!isMounted) return;
        setIsConfigLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const subjects = plannerConfig?.subjects ?? [];
  const topicsBySubject = plannerConfig?.topicsBySubject ?? {};
  const timeSlots = plannerConfig?.timeSlots ?? [];

  const handleAddBlock = () => {
    if (!selectedSubject || !timeSlot) {
      return;
    }

    if (selectedTopics.length === 0) {
      alert('Please select at least one topic');
      return;
    }

    const newBlock: RevisionBlock = {
      id: Date.now().toString(),
      subject: selectedSubject,
      topics: [...selectedTopics],
      duration,
      timeSlot,
      priority,
    };

    setRevisionBlocks([...revisionBlocks, newBlock]);
    setSelectedTopics([]);
  };

  const handleDeleteBlock = (id: string) => {
    setRevisionBlocks(revisionBlocks.filter(block => block.id !== id));
  };

  const handleToggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSavePlan = () => {
    if (revisionBlocks.length === 0) {
      alert('Please add at least one revision block');
      return;
    }

    // Save to localStorage
    const savedPlans = JSON.parse(localStorage.getItem('revision_plans') || '[]');
    const newPlan = {
      id: Date.now().toString(),
      name: planName,
      blocks: revisionBlocks,
      createdAt: new Date().toISOString(),
      totalDuration: revisionBlocks.reduce((sum, block) => sum + block.duration, 0),
    };
    savedPlans.push(newPlan);
    localStorage.setItem('revision_plans', JSON.stringify(savedPlans));

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onNavigate?.('analytics');
    }, 2000);
  };

  const totalDuration = revisionBlocks.reduce((sum, block) => sum + block.duration, 0);
  const highPriorityCount = revisionBlocks.filter(b => b.priority === 'high').length;

  if (isConfigLoading) {
    return (
      <div className="p-4 sm:p-6 min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1600px] mx-auto space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 pl-4 sm:pl-6 py-4" style={{ borderColor: 'var(--accent-primary)', background: 'var(--bg-card)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate?.('analytics')}
              className="p-2 hover:opacity-70 transition-opacity"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </button>
            <div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Create Revision Plan
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Design your personalized revision strategy with smart scheduling
              </p>
            </div>
          </div>
          <button
            onClick={handleSavePlan}
            disabled={revisionBlocks.length === 0}
            className="w-full sm:w-auto px-6 py-3 text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
          >
            Save Plan
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="flex items-center gap-3 p-4 border-l-4" style={{ background: '#f0fdf4', borderColor: '#10b981' }}>
            <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
            <div>
              <div className="text-sm font-bold" style={{ color: '#166534' }}>
                Revision Plan Created Successfully!
              </div>
              <div className="text-xs" style={{ color: '#166534' }}>
                Your plan has been saved. Redirecting to analytics...
              </div>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Plan Builder (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Name */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <label className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-4 py-3 text-sm font-medium border-2 focus:outline-none"
                style={{ 
                  background: 'var(--bg-secondary)', 
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Enter plan name"
              />
            </div>

            {/* Add Revision Block */}
            <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <Plus className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  Add Revision Block
                </h3>
              </div>

              <div className="space-y-6">
                {/* Subject Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Subject
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          setSelectedSubject(subject);
                          setSelectedTopics([]);
                        }}
                        className="px-4 py-3 text-sm font-bold border-2 transition-all"
                        style={{
                          background: selectedSubject === subject ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          borderColor: selectedSubject === subject ? 'var(--accent-primary)' : 'var(--border-medium)',
                          color: selectedSubject === subject ? '#ffffff' : 'var(--text-primary)',
                        }}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Topics to Revise
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(topicsBySubject[selectedSubject] ?? []).map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleToggleTopic(topic)}
                        className="px-4 py-3 text-sm font-medium border-2 transition-all text-left"
                        style={{
                          background: selectedTopics.includes(topic) ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          borderColor: selectedTopics.includes(topic) ? 'var(--accent-primary)' : 'var(--border-medium)',
                          color: selectedTopics.includes(topic) ? '#ffffff' : 'var(--text-primary)',
                        }}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration and Time Slot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                      Duration (minutes)
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 text-sm font-medium border-2 focus:outline-none"
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                      <option value={120}>120 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                      Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-4 py-3 text-sm font-medium border-2 focus:outline-none"
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Priority Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['high', 'medium', 'low'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className="px-4 py-3 text-sm font-bold border-2 transition-all"
                        style={{
                          background: priority === p ? (p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#10b981') : 'var(--bg-secondary)',
                          borderColor: priority === p ? (p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#10b981') : 'var(--border-medium)',
                          color: priority === p ? '#ffffff' : 'var(--text-primary)',
                        }}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddBlock}
                  className="w-full px-6 py-3 text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                >
                  <Plus className="w-4 h-4" />
                  Add to Plan
                </button>
              </div>
            </div>

            {/* Revision Blocks List */}
            {revisionBlocks.length > 0 && (
              <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                    Your Revision Schedule ({revisionBlocks.length} blocks)
                  </h3>
                </div>

                <div className="space-y-3">
                  {revisionBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="p-4 border-l-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        borderColor: block.priority === 'high' ? '#ef4444' : block.priority === 'medium' ? '#f59e0b' : '#10b981'
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {block.subject}
                          </span>
                          <span 
                            className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{ 
                              background: block.priority === 'high' ? '#ef4444' : block.priority === 'medium' ? '#f59e0b' : '#10b981',
                              color: '#ffffff'
                            }}
                          >
                            {block.priority}
                          </span>
                        </div>
                        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {block.topics.join(', ')}
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {block.duration} min
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {block.timeSlot}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-2 hover:opacity-70 transition-opacity"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Intelligence Panel (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Plan Summary */}
            <div className="p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  Plan Summary
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Total Blocks</div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {revisionBlocks.length}
                  </div>
                </div>

                <div className="p-3 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Total Duration</div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </div>
                </div>

                <div className="p-3 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>High Priority</div>
                  <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>
                    {highPriorityCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Recommendations */}
            <div className="p-5 border-l-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--accent-primary)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  Smart Tips
                </div>
              </div>
              <div className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>Spaced Repetition:</strong> Review topics after 1 day, 3 days, and 7 days for better retention.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>15-Min Blocks:</strong> Short, focused sessions are 40% more effective than long marathons.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>Peak Hours:</strong> Schedule high-priority topics during your morning peak (7-9 AM).
                  </span>
                </div>
              </div>
            </div>

            {/* Expected Impact */}
            <div className="p-5 border-l-4" style={{ background: 'var(--bg-card)', borderColor: '#10b981' }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5" style={{ color: '#10b981' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  Expected Impact
                </div>
              </div>
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                +35% Retention Rate
              </div>
              <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                Students who follow structured revision plans retain 35% more concepts and score 12% higher on tests.
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-tertiary)' }}>Current Accuracy</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>84%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-tertiary)' }}>Projected Accuracy</span>
                  <span className="font-bold" style={{ color: '#10b981' }}>92%</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            {revisionBlocks.length === 0 && (
              <div className="p-5 border-l-4" style={{ background: 'var(--bg-card)', borderColor: '#f59e0b' }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                    No Blocks Yet
                  </div>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Add at least one revision block to save your plan.
                </div>
              </div>
            )}

            {/* Best Practices */}
            <div className="p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--text-primary)' }}>
                  Best Practices
                </div>
              </div>
              <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div>• Mix subjects to avoid fatigue</div>
                <div>• Test yourself after each block</div>
                <div>• Take 5-min breaks between blocks</div>
                <div>• Review weak topics more frequently</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

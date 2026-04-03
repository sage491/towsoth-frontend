import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, TrendingUp, Clock, Target, Zap, AlertTriangle, Lightbulb, CheckCircle, Circle, AlertCircle, Calculator, GitCompare, Layers, Brain } from 'lucide-react';
import { CareerAssessmentSystem } from '../career/CareerAssessmentSystem';

type Level = 1 | 2 | 3 | 4;
type DepthMode = 1 | 2 | 3 | 4;
type UserStage = 'school' | 'college' | 'jee' | 'neet';
type CareerSortBy = 'match' | 'difficulty' | 'timeline';

const CAREER_SORT_OPTIONS: CareerSortBy[] = ['match', 'difficulty', 'timeline'];

const isCareerSortBy = (value: string): value is CareerSortBy => {
  return CAREER_SORT_OPTIONS.includes(value as CareerSortBy);
};

interface CareerPath {
  id: string;
  title: string;
  positioningStatement: string;
  difficulty: number;
  timeline: string;
  competitionIntensity: number;
  aiMatchConfidence: number;
  requiredSkills: string[];
  topSkills: string[];
  examRequired: string[];
  timeInvestment: string;
  dailyEffort: string;
  alternativeRoutes: string[];
  skillMatch: {
    mathReasoning: number;
    consistency: number;
    memoryRetention: number;
    focusStamina: number;
    analyticalDepth: number;
    applicationSpeed: number;
  };
  workLifeBalance: number;
  incomePotential: number;
  globalMobility: number;
  studyLoad: number;
  aiInsight: string;
  journeyPhases: string[];
  careerOutcomes: string[];
  studyStages: string[];
  subjectAlignment: { subject: string; importance: number }[];
  weakSkills: string[];
  dailyTimeBreakdown: { phase: string; hours: number }[];
}

const careerPaths: CareerPath[] = [
  {
    id: 'engineering',
    title: 'Engineering',
    positioningStatement: 'Analytical problem-solving focused career path',
    difficulty: 7,
    timeline: '4-6 years',
    competitionIntensity: 8,
    aiMatchConfidence: 82,
    requiredSkills: ['Mathematics', 'Physics', 'Problem Solving', 'Logical Thinking'],
    topSkills: ['Mathematics', 'Physics', 'Problem Solving'],
    examRequired: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs'],
    timeInvestment: '4 years undergrad + optional 2 years postgrad',
    dailyEffort: '6-8 hours',
    alternativeRoutes: ['Diploma → Degree', 'Lateral Entry', 'Private Colleges'],
    skillMatch: {
      mathReasoning: 85,
      consistency: 72,
      memoryRetention: 68,
      focusStamina: 78,
      analyticalDepth: 82,
      applicationSpeed: 75,
    },
    workLifeBalance: 6,
    incomePotential: 8,
    globalMobility: 9,
    studyLoad: 8,
    aiInsight: 'High compatibility with your current physics & math performance',
    journeyPhases: ['Foundation Building', 'Entrance Preparation', 'Undergrad Studies', 'Specialization', 'Career Launch'],
    careerOutcomes: ['Software Engineer', 'Product Manager', 'Technical Architect', 'Research Scientist', 'Entrepreneur'],
    studyStages: ['Class 11-12 Basics', 'JEE Preparation (1-2 years)', 'B.Tech (4 years)', 'Optional Masters (2 years)'],
    subjectAlignment: [
      { subject: 'Mathematics', importance: 95 },
      { subject: 'Physics', importance: 90 },
      { subject: 'Chemistry', importance: 65 },
    ],
    weakSkills: ['Speed-Accuracy Balance', 'Consistency in Practice'],
    dailyTimeBreakdown: [
      { phase: 'Concept Study', hours: 3 },
      { phase: 'Problem Solving', hours: 2.5 },
      { phase: 'Mock Tests', hours: 1.5 },
      { phase: 'Revision', hours: 1 },
    ],
  },
  {
    id: 'medicine',
    title: 'Medicine',
    positioningStatement: 'Healthcare and human biology specialization',
    difficulty: 9,
    timeline: '5.5+ years',
    competitionIntensity: 10,
    aiMatchConfidence: 64,
    requiredSkills: ['Biology', 'Chemistry', 'Memory Retention', 'Stamina', 'Empathy'],
    topSkills: ['Biology', 'Chemistry', 'Memory'],
    examRequired: ['NEET UG', 'AIIMS', 'JIPMER'],
    timeInvestment: '5.5 years MBBS + 3 years specialization',
    dailyEffort: '8-10 hours',
    alternativeRoutes: ['Paramedical Sciences', 'Pharmacy', 'Allied Health'],
    skillMatch: {
      mathReasoning: 45,
      consistency: 88,
      memoryRetention: 92,
      focusStamina: 85,
      analyticalDepth: 70,
      applicationSpeed: 65,
    },
    workLifeBalance: 4,
    incomePotential: 9,
    globalMobility: 7,
    studyLoad: 10,
    aiInsight: 'Strong consistency matches medicine requirements well',
    journeyPhases: ['Pre-Medical Foundation', 'NEET Preparation', 'MBBS', 'Internship', 'Specialization'],
    careerOutcomes: ['General Physician', 'Specialist Doctor', 'Surgeon', 'Medical Researcher', 'Hospital Administrator'],
    studyStages: ['Class 11-12 PCB', 'NEET Preparation (1-2 years)', 'MBBS (5.5 years)', 'MD/MS (3 years)'],
    subjectAlignment: [
      { subject: 'Biology', importance: 95 },
      { subject: 'Chemistry', importance: 85 },
      { subject: 'Physics', importance: 50 },
    ],
    weakSkills: ['Speed in MCQ Tests', 'Application Speed'],
    dailyTimeBreakdown: [
      { phase: 'Concept Memorization', hours: 4 },
      { phase: 'Practice Questions', hours: 3 },
      { phase: 'Mock Tests', hours: 2 },
      { phase: 'Revision', hours: 1.5 },
    ],
  },
  {
    id: 'aitech',
    title: 'AI & Technology',
    positioningStatement: 'Cutting-edge tech and software development',
    difficulty: 8,
    timeline: '4-6 years',
    competitionIntensity: 9,
    aiMatchConfidence: 88,
    requiredSkills: ['Mathematics', 'Programming', 'Problem Solving', 'Self-Learning'],
    topSkills: ['Mathematics', 'Programming', 'Logic'],
    examRequired: ['JEE/GATE for CS', 'Coding Assessments', 'Portfolio'],
    timeInvestment: '4 years degree + continuous upskilling',
    dailyEffort: '6-8 hours',
    alternativeRoutes: ['Bootcamps', 'Self-taught Portfolio', 'Certifications'],
    skillMatch: {
      mathReasoning: 88,
      consistency: 70,
      memoryRetention: 65,
      focusStamina: 80,
      analyticalDepth: 90,
      applicationSpeed: 85,
    },
    workLifeBalance: 7,
    incomePotential: 9,
    globalMobility: 10,
    studyLoad: 7,
    aiInsight: 'Highest match - excellent analytical and mathematical foundation',
    journeyPhases: ['Programming Basics', 'CS Fundamentals', 'Specialization', 'Project Building', 'Industry Entry'],
    careerOutcomes: ['Software Engineer', 'ML Engineer', 'Data Scientist', 'AI Researcher', 'Tech Lead'],
    studyStages: ['CS Degree/Bootcamp', 'Self-Learning (Ongoing)', 'Portfolio Building', 'Specialization (AI/ML)'],
    subjectAlignment: [
      { subject: 'Mathematics', importance: 90 },
      { subject: 'Programming', importance: 95 },
      { subject: 'Logic & Algorithms', importance: 85 },
    ],
    weakSkills: ['Consistency in Practice'],
    dailyTimeBreakdown: [
      { phase: 'Theory Study', hours: 2 },
      { phase: 'Coding Practice', hours: 3.5 },
      { phase: 'Project Work', hours: 2 },
      { phase: 'System Design', hours: 1 },
    ],
  },
];

// LocalStorage key for depth preferences
const DEPTH_PREFERENCE_KEY = 'futureIntelligence_depthPreferences';

export function FutureIntelligencePage() {
  const [currentLevel, setCurrentLevel] = useState<Level>(1);
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [depthMode, setDepthMode] = useState<DepthMode>(1);
  const [_userStage] = useState<UserStage>('jee');
  const [dailyHours, setDailyHours] = useState(6);
  const [showAssessment, setShowAssessment] = useState(false);
  
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState<number | null>(null);
  const [filterMatch] = useState<number | null>(null);
  const [filterTimeline] = useState<string>('all');
  const [sortBy, setSortBy] = useState<CareerSortBy>('match');
  
  // Animation state
  const [isTransitioning, setIsTransitioning] = useState(false);

  const userData = {
    currentReadiness: 64,
    currentPace: 72,
    dailyStudyHours: 5.5,
    strengths: ['Analytical Persistence', 'Problem Solving', 'Mathematical Reasoning'],
    weaknesses: ['Physics Conceptual Depth', 'Speed-Accuracy Balance', 'Consistency'],
    studyStreak: 12,
  };

  // Load saved depth preference for this path
  useEffect(() => {
    if (selectedPath) {
      const saved = localStorage.getItem(DEPTH_PREFERENCE_KEY);
      if (saved) {
        try {
          const preferences = JSON.parse(saved);
          if (preferences[selectedPath.id]) {
            setDepthMode(preferences[selectedPath.id]);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [selectedPath]);

  // Save depth preference when changed
  const handleDepthModeChange = (newMode: DepthMode) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setDepthMode(newMode);
      setIsTransitioning(false);
      
      // Save preference
      if (selectedPath) {
        const saved = localStorage.getItem(DEPTH_PREFERENCE_KEY);
        const preferences = saved ? JSON.parse(saved) : {};
        preferences[selectedPath.id] = newMode;
        localStorage.setItem(DEPTH_PREFERENCE_KEY, JSON.stringify(preferences));
      }
    }, 200);
  };

  const handlePathSelect = (path: CareerPath, targetDepth: DepthMode = 1) => {
    setSelectedPath(path);
    setCurrentLevel(2);
    
    // Check if there's a saved preference
    const saved = localStorage.getItem(DEPTH_PREFERENCE_KEY);
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        setDepthMode(preferences[path.id] || targetDepth);
      } catch (e) {
        setDepthMode(targetDepth);
      }
    } else {
      setDepthMode(targetDepth);
    }
  };

  const handleBackToLevel1 = () => {
    setCurrentLevel(1);
    setSelectedPath(null);
    setDepthMode(1);
    setCompareMode(false);
    setSelectedForComparison([]);
  };

  const calculateSuccessProbability = (hours: number) => {
    const baseProb = userData.currentReadiness;
    const hoursMultiplier = (hours - userData.dailyStudyHours) * 2;
    return Math.min(95, Math.max(40, baseProb + hoursMultiplier));
  };

  const toggleCompareSelection = (pathId: string) => {
    if (selectedForComparison.includes(pathId)) {
      setSelectedForComparison(selectedForComparison.filter(id => id !== pathId));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison([...selectedForComparison, pathId]);
    }
  };

  const filteredAndSortedPaths = careerPaths
    .filter(path => {
      if (filterDifficulty && path.difficulty > filterDifficulty) return false;
      if (filterMatch && path.aiMatchConfidence < filterMatch) return false;
      if (filterTimeline !== 'all') {
        if (filterTimeline === 'short' && !path.timeline.includes('3') && !path.timeline.includes('4')) return false;
        if (filterTimeline === 'medium' && !path.timeline.includes('5') && !path.timeline.includes('6')) return false;
        if (filterTimeline === 'long' && !path.timeline.includes('8') && !path.timeline.includes('10') && !path.timeline.includes('12')) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.aiMatchConfidence - a.aiMatchConfidence;
      if (sortBy === 'difficulty') return a.difficulty - b.difficulty;
      if (sortBy === 'timeline') return a.timeline.localeCompare(b.timeline);
      return 0;
    });

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 3) return { label: 'Easy', color: '#059669' };
    if (difficulty <= 6) return { label: 'Moderate', color: '#3B82F6' };
    if (difficulty <= 8) return { label: 'Hard', color: '#F59E0B' };
    return { label: 'Very Hard', color: '#EF4444' };
  };

  const getMatchColor = (confidence: number) => {
    if (confidence >= 75) return 'var(--accent-primary)';
    if (confidence >= 60) return '#3B82F6';
    if (confidence >= 45) return '#F59E0B';
    return '#EF4444';
  };

  const getAIPersonality = (mode: DepthMode) => {
    switch (mode) {
      case 1:
        return 'Explorer Guide';
      case 2:
        return 'Analyst';
      case 3:
        return 'Strategic Coach';
      case 4:
        return 'Precision Advisor';
      default:
        return 'Guide';
    }
  };

  const getAIMessage = (path: CareerPath, mode: DepthMode) => {
    switch (mode) {
      case 1:
        return `${path.title} path focuses on ${path.topSkills[0].toLowerCase()} and ${path.topSkills[1].toLowerCase()}. This journey spans ${path.timeline} with clear milestones.`;
      case 2:
        return `You meet ${Math.round(Object.values(path.skillMatch).reduce((a, b) => a + b, 0) / Object.keys(path.skillMatch).length)}% of current requirements. Strong foundation detected, but ${path.weakSkills[0].toLowerCase()} needs improvement.`;
      case 3:
        return `Increase daily study by 40 minutes to optimize trajectory. Current pace: ${userData.dailyStudyHours}h/day. Recommended: ${(userData.dailyStudyHours + 0.7).toFixed(1)}h/day for 8-12% success boost.`;
      case 4:
        return `Skill gap analysis complete. ${path.weakSkills.length} bottlenecks identified. Priority: ${path.weakSkills[0]}. Simulation shows 6h/day study yields ${calculateSuccessProbability(6)}% success probability.`;
      default:
        return path.aiInsight;
    }
  };

  const depthModes = [
    { id: 1, label: 'Overview', icon: Circle, tooltip: 'Simple high-level view' },
    { id: 2, label: 'Structured Plan', icon: Layers, tooltip: 'Understand requirements' },
    { id: 3, label: 'Strategic Roadmap', icon: Target, tooltip: 'Plan realistically' },
    { id: 4, label: 'Expert Intelligence', icon: Brain, tooltip: 'Advanced planning tools' },
  ];

  // Show assessment if requested
  if (showAssessment) {
    return <CareerAssessmentSystem onClose={() => setShowAssessment(false)} />;
  }

  return (
    <div style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1600px] mx-auto">
        {/* LEVEL 1: GRID VIEW */}
        {currentLevel === 1 && (
          <div>
            {/* Top Bar */}
            <div 
              className="px-4 md:px-6 py-4 mb-4 md:mb-6"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Career Plan
                  </h1>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Discover your ideal career path with AI-powered assessment
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setShowAssessment(true)}
                    className="px-4 md:px-5 py-2.5 text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-hover) 100%)',
                      color: '#ffffff',
                      boxShadow: '0 2px 8px rgba(91, 95, 141, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 95, 141, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(91, 95, 141, 0.3)';
                    }}
                  >
                    <Brain className="w-4 h-4" />
                    <span className="hidden sm:inline">Take Career Assessment</span>
                    <span className="sm:hidden">Take Assessment</span>
                  </button>

                  <button
                    onClick={() => {
                      setCompareMode(!compareMode);
                      setSelectedForComparison([]);
                    }}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      background: compareMode ? 'var(--accent-primary)' : 'transparent',
                      color: compareMode ? '#ffffff' : 'var(--accent-primary)',
                      border: '1px solid var(--accent-primary)',
                    }}
                  >
                    <GitCompare className="w-4 h-4" />
                    {compareMode ? 'Exit Compare' : 'Compare Paths'}
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      if (isCareerSortBy(e.target.value)) {
                        setSortBy(e.target.value);
                      }
                    }}
                    className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <option value="match">Best Match</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="timeline">Timeline</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Max Difficulty:</span>
                  <select
                    value={filterDifficulty || ''}
                    onChange={(e) => setFilterDifficulty(e.target.value ? Number(e.target.value) : null)}
                    className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <option value="">All Levels</option>
                    <option value="5">Easy (≤5)</option>
                    <option value="7">Moderate (≤7)</option>
                    <option value="10">All</option>
                  </select>
                </div>

                <div className="sm:ml-auto text-xs text-center sm:text-left" style={{ color: 'var(--text-tertiary)' }}>
                  {filteredAndSortedPaths.length} paths
                </div>
              </div>

              {compareMode && (
                <div 
                  className="mt-4 p-3 flex items-center justify-between"
                  style={{
                    background: 'var(--accent-soft)',
                    border: '1px solid var(--accent-border)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Select up to 3 paths to compare
                    </span>
                  </div>
                  {selectedForComparison.length >= 2 && (
                    <button
                      className="px-3 py-1.5 text-xs font-bold uppercase"
                      style={{
                        background: 'var(--accent-primary)',
                        color: '#ffffff',
                      }}
                    >
                      View Comparison ({selectedForComparison.length})
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Career Paths Grid */}
            <div className="px-4 md:px-6 pb-12">
              <div className="grid grid-cols-1 gap-4">
                {filteredAndSortedPaths.map((path) => {
                  const difficultyInfo = getDifficultyLabel(path.difficulty);
                  const isSelectedForCompare = selectedForComparison.includes(path.id);

                  return (
                    <div
                      key={path.id}
                      className="group relative transition-all duration-200"
                      style={{
                        background: 'var(--bg-card)',
                        border: '2px solid',
                        borderColor: isSelectedForCompare ? 'var(--accent-primary)' : 'var(--border-soft)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                        if (!isSelectedForCompare) {
                          e.currentTarget.style.borderLeftWidth = '4px';
                          e.currentTarget.style.borderLeftColor = 'var(--accent-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        if (!isSelectedForCompare) {
                          e.currentTarget.style.borderLeftWidth = '2px';
                          e.currentTarget.style.borderLeftColor = 'var(--border-soft)';
                        }
                      }}
                    >
                      {compareMode && (
                        <button
                          onClick={() => toggleCompareSelection(path.id)}
                          className="absolute top-4 left-4 z-10 w-6 h-6 flex items-center justify-center"
                          style={{
                            background: isSelectedForCompare ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                            border: '2px solid',
                            borderColor: isSelectedForCompare ? 'var(--accent-primary)' : 'var(--border-medium)',
                          }}
                        >
                          {isSelectedForCompare && <CheckCircle className="w-4 h-4" style={{ color: '#ffffff' }} />}
                        </button>
                      )}

                      <div className="p-4 md:p-6 flex flex-col lg:flex-row items-start gap-4 md:gap-6">
                        {/* LEFT SECTION */}
                        <div className="w-full lg:flex-shrink-0 lg:w-[280px]">
                          <div className="mb-3">
                            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                              {path.title}
                            </h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {path.positioningStatement}
                            </p>
                          </div>

                          <div 
                            className="p-3"
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-soft)',
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                                Match Score
                              </span>
                              <span 
                                className="text-xl font-bold"
                                style={{ color: getMatchColor(path.aiMatchConfidence) }}
                              >
                                {path.aiMatchConfidence}%
                              </span>
                            </div>
                            <div 
                              className="w-full h-2 mb-2"
                              style={{ background: 'var(--border-soft)' }}
                            >
                              <div
                                className="h-2 transition-all duration-500"
                                style={{
                                  width: `${path.aiMatchConfidence}%`,
                                  background: getMatchColor(path.aiMatchConfidence),
                                }}
                              />
                            </div>
                            <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                              Based on: {path.topSkills.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        </div>

                        {/* MIDDLE SECTION */}
                        <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                              style={{
                                background: 'var(--accent-soft)',
                                border: '1px solid var(--accent-border)',
                              }}
                            >
                              <Clock className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                Timeline
                              </div>
                              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                {path.timeline}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                              style={{
                                background: 'var(--accent-soft)',
                                border: '1px solid var(--accent-border)',
                              }}
                            >
                              <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                Competition
                              </div>
                              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                {path.competitionIntensity}/10
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                              style={{
                                background: 'var(--accent-soft)',
                                border: '1px solid var(--accent-border)',
                              }}
                            >
                              <Zap className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                Daily Effort
                              </div>
                              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                {path.dailyEffort}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                              style={{
                                background: 'var(--accent-soft)',
                                border: '1px solid var(--accent-border)',
                              }}
                            >
                              <Target className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                Difficulty
                              </div>
                              <div 
                                className="text-sm font-bold"
                                style={{ color: difficultyInfo.color }}
                              >
                                {difficultyInfo.label}
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <div className="text-[10px] uppercase font-bold tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                              Key Skills
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {path.topSkills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-[10px] font-semibold"
                                  style={{
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-soft)',
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div 
                            className="col-span-2 p-3"
                            style={{
                              background: 'var(--accent-soft)',
                              border: '1px solid var(--accent-border)',
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
                              <div>
                                <div className="text-[10px] uppercase font-bold tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>
                                  AI Insight
                                </div>
                                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  {path.aiInsight}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT SECTION - DEPTH SELECTOR */}
                        <div className="w-full lg:flex-shrink-0 lg:w-[240px]">
                          <div 
                            className="p-4"
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-soft)',
                            }}
                          >
                            <div className="text-xs font-bold uppercase tracking-wide mb-3 text-center lg:text-left" style={{ color: 'var(--text-primary)' }}>
                              Explore Roadmap
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                              {depthModes.map((mode) => {
                                const Icon = mode.icon;
                                return (
                                  <button
                                    key={mode.id}
                                    onClick={() => handlePathSelect(path, mode.id as DepthMode)}
                                    className="w-full px-3 py-2 text-left text-xs font-semibold transition-all duration-200 flex items-center justify-between group/btn relative"
                                    style={{
                                      background: 'var(--bg-card)',
                                      color: 'var(--text-primary)',
                                      border: '1px solid var(--border-soft)',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = 'var(--accent-soft)';
                                      e.currentTarget.style.borderColor = 'var(--accent-border)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = 'var(--bg-card)';
                                      e.currentTarget.style.borderColor = 'var(--border-soft)';
                                    }}
                                    title={mode.tooltip}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Icon className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                                      <span className="truncate">{mode.label}</span>
                                    </div>
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity flex-shrink-0" />
                                  </button>
                                );
                              })}
                            </div>

                            <div 
                              className="mt-3 p-2 text-[10px]"
                              style={{
                                background: 'var(--accent-soft)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--accent-border)',
                              }}
                            >
                              Choose your preferred depth level
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* LEVEL 2: DEPTH MODE VIEW */}
        {currentLevel === 2 && selectedPath && (
          <div>
            {/* Header */}
            <div 
              className="px-4 md:px-6 py-5 mb-4 md:mb-6"
              style={{
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-soft)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToLevel1}
                    className="p-2 transition-all duration-200"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {selectedPath.title}
                    </h1>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {depthModes.find(m => m.id === depthMode)?.label} • AI: {getAIPersonality(depthMode)}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <span>Future Intelligence</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{selectedPath.title}</span>
                </div>
              </div>

              {/* DEPTH MODE SELECTOR - Segmented Control */}
              <div 
                className="mt-6 grid grid-cols-2 lg:flex lg:items-center gap-1 p-1"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                {depthModes.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = depthMode === mode.id;
                  
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleDepthModeChange(mode.id as DepthMode)}
                      className="lg:flex-1 px-2 md:px-4 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2 relative"
                      style={{
                        background: isActive ? 'var(--accent-soft)' : 'transparent',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                      }}
                      title={mode.tooltip}
                    >
                      <Icon className="w-3 md:w-4 h-3 md:h-4" />
                      <span className="hidden sm:inline">{mode.label}</span>
                      <span className="sm:hidden truncate">{mode.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Message Banner */}
            <div className="px-4 md:px-6 mb-4 md:mb-6">
              <div 
                className="p-4"
                style={{
                  background: 'var(--accent-soft)',
                  border: '1px solid var(--accent-border)',
                  borderLeft: '4px solid var(--accent-primary)',
                }}
              >
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
                  <div>
                    <div className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {getAIPersonality(depthMode)}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {getAIMessage(selectedPath, depthMode)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area with Transition */}
            <div 
              className="px-4 md:px-6 pb-12 transition-opacity duration-200"
              style={{ opacity: isTransitioning ? 0 : 1 }}
            >
              {/* MODE 1: OVERVIEW */}
              {depthMode === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Journey Phases */}
                  <div 
                    className="xl:col-span-2"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        Journey Phases
                      </h2>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        High-level roadmap overview
                      </p>
                    </div>
                    <div className="p-5">
                      <div className="space-y-4">
                        {selectedPath.journeyPhases.map((phase, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                              style={{
                                background: 'var(--accent-soft)',
                                color: 'var(--accent-primary)',
                                border: '2px solid var(--accent-border)',
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                {phase}
                              </h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Career Outcomes */}
                  <div 
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                        Career Outcomes
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="space-y-2">
                        {selectedPath.careerOutcomes.map((outcome, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 text-xs font-semibold"
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-soft)',
                            }}
                          >
                            {outcome}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div 
                    className="col-span-3"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        Timeline Overview
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        {selectedPath.studyStages.map((stage, idx) => (
                          <div key={idx} className="flex-1 text-center">
                            <div 
                              className="px-3 py-2 text-xs font-semibold"
                              style={{
                                background: 'var(--accent-soft)',
                                border: '1px solid var(--accent-border)',
                              }}
                            >
                              {stage}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: STRUCTURED PLAN */}
              {depthMode === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Required Skills with Match */}
                  <div 
                    className="xl:col-span-2"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        Required Skills & Your Match
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="space-y-4">
                        {Object.entries(selectedPath.skillMatch).map(([skill, value]) => (
                          <div key={skill}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs capitalize font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {skill.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-xs font-bold" style={{ color: value < 70 ? '#EF4444' : 'var(--accent-primary)' }}>
                                {value}%
                              </span>
                            </div>
                            <div 
                              className="w-full h-2"
                              style={{ background: 'var(--bg-secondary)' }}
                            >
                              <div
                                className="h-2"
                                style={{
                                  width: `${value}%`,
                                  background: value >= 75 ? 'var(--accent-primary)' : value >= 60 ? '#3B82F6' : '#F59E0B',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Weak Skills Highlight */}
                      {selectedPath.weakSkills.length > 0 && (
                        <div 
                          className="mt-6 p-4"
                          style={{
                            background: '#FEF3C7',
                            border: '1px solid #FDE68A',
                          }}
                        >
                          <div className="text-xs font-bold mb-2" style={{ color: '#78350F' }}>
                            Skills to Develop
                          </div>
                          {selectedPath.weakSkills.map((skill, idx) => (
                            <div key={idx} className="text-xs" style={{ color: '#78350F' }}>
                              • {skill}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subject Alignment */}
                  <div 
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                        Subject Alignment
                      </h2>
                    </div>
                    <div className="p-5 space-y-4">
                      {selectedPath.subjectAlignment.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {item.subject}
                            </span>
                            <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>
                              {item.importance}%
                            </span>
                          </div>
                          <div 
                            className="w-full h-1.5"
                            style={{ background: 'var(--bg-secondary)' }}
                          >
                            <div
                              className="h-1.5"
                              style={{
                                width: `${item.importance}%`,
                                background: 'var(--accent-primary)',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exams Required */}
                  <div 
                    className="col-span-3"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        Exams Required
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {selectedPath.examRequired.map((exam, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 text-xs font-semibold text-center"
                            style={{
                              background: 'var(--accent-soft)',
                              border: '1px solid var(--accent-border)',
                            }}
                          >
                            {exam}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3: STRATEGIC ROADMAP */}
              {depthMode === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Daily Time Breakdown */}
                  <div 
                    className="xl:col-span-2"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        Daily Time Breakdown
                      </h2>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Recommended daily study allocation
                      </p>
                    </div>
                    <div className="p-5">
                      <div className="space-y-4">
                        {selectedPath.dailyTimeBreakdown.map((item, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {item.phase}
                              </span>
                              <span className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>
                                {item.hours}h
                              </span>
                            </div>
                            <div 
                              className="w-full h-3"
                              style={{ background: 'var(--bg-secondary)' }}
                            >
                              <div
                                className="h-3"
                                style={{
                                  width: `${(item.hours / 8) * 100}%`,
                                  background: 'var(--accent-primary)',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div 
                        className="mt-6 p-4"
                        style={{
                          background: 'var(--accent-soft)',
                          border: '1px solid var(--accent-border)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            Total Daily Commitment
                          </span>
                          <span className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                            {selectedPath.dailyTimeBreakdown.reduce((sum, item) => sum + item.hours, 0)}h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Success Probability */}
                  <div 
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                        Success Probability
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="text-center mb-4">
                        <div 
                          className="text-4xl font-bold mb-2"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          {userData.currentReadiness}%
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Current Readiness
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div 
                          className="p-3"
                          style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-soft)',
                          }}
                        >
                          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                            Current pace
                          </p>
                          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                            {userData.currentPace}%
                          </p>
                        </div>

                        <div 
                          className="p-3"
                          style={{
                            background: 'var(--accent-soft)',
                            border: '1px solid var(--accent-border)',
                          }}
                        >
                          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                            With optimization
                          </p>
                          <p className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>
                            {calculateSuccessProbability(dailyHours)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottleneck Warnings */}
                  <div 
                    className="col-span-3"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                      borderLeft: '4px solid #F59E0B',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <AlertTriangle className="w-5 h-5" style={{ color: '#F59E0B' }} />
                        Bottleneck Warnings
                      </h2>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedPath.weakSkills.map((skill, idx) => (
                          <div
                            key={idx}
                            className="p-3"
                            style={{
                              background: '#FEF3C7',
                              border: '1px solid #FDE68A',
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#B45309' }} />
                              <div className="text-xs font-semibold" style={{ color: '#78350F' }}>
                                {skill}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 4: EXPERT INTELLIGENCE */}
              {depthMode === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Effort Simulation */}
                  <div 
                    className="xl:col-span-2"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Calculator className="w-5 h-5" />
                        Effort Simulation Engine
                      </h2>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Adjust daily study hours to see outcome predictions
                      </p>
                    </div>
                    <div className="p-5">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Daily Study Hours
                          </span>
                          <span className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                            {dailyHours}h
                          </span>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max="12"
                          step="0.5"
                          value={dailyHours}
                          onChange={(e) => setDailyHours(Number(e.target.value))}
                          className="w-full"
                          style={{ accentColor: 'var(--accent-primary)' }}
                        />
                        <div className="flex items-center justify-between text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                          <span>3h</span>
                          <span>12h</span>
                        </div>
                      </div>

                      {/* Outcomes */}
                      <div className="space-y-3">
                        {[
                          { hours: 3, outcome: 'Rank 800-1000', prob: 50 },
                          { hours: 5, outcome: 'Rank 600-800', prob: 65 },
                          { hours: 7, outcome: 'Rank 350-550', prob: 78 },
                          { hours: 9, outcome: 'Rank 150-300', prob: 88 },
                        ].map((scenario, idx) => (
                          <div
                            key={idx}
                            className="p-4 flex items-center justify-between"
                            style={{
                              background: Math.round(dailyHours) === scenario.hours ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                              border: '1px solid',
                              borderColor: Math.round(dailyHours) === scenario.hours ? 'var(--accent-border)' : 'var(--border-soft)',
                            }}
                          >
                            <div>
                              <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                                {scenario.hours}h/day → {scenario.outcome}
                              </div>
                              <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                                Success: {scenario.prob}%
                              </div>
                            </div>
                            {Math.round(dailyHours) === scenario.hours && (
                              <div 
                                className="px-2 py-1 text-[9px] font-bold uppercase"
                                style={{
                                  background: 'var(--accent-primary)',
                                  color: '#ffffff',
                                }}
                              >
                                Current
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skill Gap Matrix */}
                  <div 
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div 
                      className="px-5 py-4"
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                    >
                      <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                        Skill Gap Analysis
                      </h2>
                    </div>
                    <div className="p-5 space-y-3">
                      {Object.entries(selectedPath.skillMatch).slice(0, 4).map(([skill, value]) => {
                        const required = 85;
                        const gap = Math.max(0, required - value);
                        
                        return (
                          <div key={skill}>
                            <div className="text-[10px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                              {skill.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="flex items-center gap-2">
                              <div 
                                className="flex-1 h-2"
                                style={{ background: 'var(--bg-secondary)' }}
                              >
                                <div
                                  className="h-2"
                                  style={{
                                    width: `${value}%`,
                                    background: value >= required ? '#10B981' : '#F59E0B',
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-bold" style={{ color: gap > 0 ? '#EF4444' : '#10B981' }}>
                                {gap > 0 ? `-${gap}%` : '✓'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

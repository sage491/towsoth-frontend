import { useState, useEffect } from 'react';
import { Brain, Clock, Target, Award, CheckCircle, AlertCircle, Play, ChevronRight, BarChart3, Zap, Heart, Code, Microscope, Lightbulb, ArrowRight } from 'lucide-react';
import type {
  AssessmentQuestion,
  BehaviorMetrics,
  CareerRecommendation,
  DisciplineData,
  ScoreAnalysis,
} from '@/features/student/career/types';

interface CareerAssessmentSystemProps {
  onClose?: () => void;
}

const assessmentQuestions: AssessmentQuestion[] = [
  // Aptitude
  { id: 'apt1', category: 'aptitude', type: 'mcq', question: 'If a train travels 120 km in 2 hours, what is its average speed?', options: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'], timeLimit: 45 },
  { id: 'apt2', category: 'aptitude', type: 'mcq', question: 'Complete the series: 2, 6, 12, 20, 30, ?', options: ['36', '40', '42', '44'], timeLimit: 60 },
  { id: 'apt3', category: 'aptitude', type: 'mcq', question: 'Which word is the odd one out?', options: ['Happy', 'Joyful', 'Elated', 'Angry'], timeLimit: 30 },
  
  // Interest
  { id: 'int1', category: 'interest', type: 'rating', question: 'How much do you enjoy solving complex mathematical problems?', options: ['Not at all', 'Somewhat', 'Moderately', 'Very much', 'Extremely'], timeLimit: 20 },
  { id: 'int2', category: 'interest', type: 'rating', question: 'How interested are you in understanding how things work mechanically?', options: ['Not at all', 'Somewhat', 'Moderately', 'Very much', 'Extremely'], timeLimit: 20 },
  { id: 'int3', category: 'interest', type: 'rating', question: 'How much do you enjoy learning about human biology and health?', options: ['Not at all', 'Somewhat', 'Moderately', 'Very much', 'Extremely'], timeLimit: 20 },
  { id: 'int4', category: 'interest', type: 'rating', question: 'How interested are you in coding and software development?', options: ['Not at all', 'Somewhat', 'Moderately', 'Very much', 'Extremely'], timeLimit: 20 },
  
  // Personality
  { id: 'per1', category: 'personality', type: 'mcq', question: 'In a group project, you prefer to:', options: ['Lead the team', 'Support the leader', 'Work independently on your part', 'Coordinate between members'], timeLimit: 30 },
  { id: 'per2', category: 'personality', type: 'mcq', question: 'When faced with a difficult problem, you:', options: ['Try multiple approaches quickly', 'Think deeply before attempting', 'Seek help immediately', 'Break it into smaller parts'], timeLimit: 30 },
  { id: 'per3', category: 'personality', type: 'mcq', question: 'You prefer work that is:', options: ['Highly structured and planned', 'Flexible with room for creativity', 'Fast-paced and dynamic', 'Steady and predictable'], timeLimit: 30 },
  
  // Work Style
  { id: 'work1', category: 'workstyle', type: 'mcq', question: 'Your ideal work environment would be:', options: ['Quiet office', 'Collaborative space', 'Remote/flexible', 'Field work'], timeLimit: 25 },
  { id: 'work2', category: 'workstyle', type: 'rating', question: 'How important is work-life balance to you?', options: ['Not important', 'Somewhat', 'Important', 'Very important', 'Critical'], timeLimit: 20 },
  
  // Learning Style
  { id: 'learn1', category: 'learning', type: 'mcq', question: 'You learn best through:', options: ['Reading and writing', 'Visual diagrams', 'Hands-on practice', 'Discussion and teaching'], timeLimit: 25 },
  { id: 'learn2', category: 'learning', type: 'mcq', question: 'When studying, you prefer:', options: ['Short frequent sessions', 'Long deep sessions', 'Group study', 'Learning by doing projects'], timeLimit: 25 },
];

// Mock discipline data (would come from actual student activity)
const mockDisciplineData: DisciplineData = {
  studyConsistency: 78,
  goalCompletionRate: 82,
  punctuality: 88,
  regularPractice: 75,
  revisionFrequency: 70,
  mockTestParticipation: 85,
};

// Mock score analysis (would come from actual test results)
const mockScoreAnalysis: ScoreAnalysis = {
  jeePerformance: 72,
  physicsStrength: 78,
  chemistryStrength: 68,
  mathsStrength: 85,
  improvementRate: 15,
  consistency: 74,
  peakPerformance: 88,
};

export function CareerAssessmentSystem({ onClose }: CareerAssessmentSystemProps) {
  const [stage, setStage] = useState<'intro' | 'assessment' | 'analyzing' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetrics>({
    avgTimePerQuestion: 0,
    questionsSkipped: 0,
    questionsRevisited: 0,
    decisionSpeed: 'medium',
    confidenceLevel: 75,
    stressIndicators: 0,
  });
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<CareerRecommendation | null>(null);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex / assessmentQuestions.length) * 100;

  // Timer countdown
  useEffect(() => {
    if (stage === 'assessment' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && stage === 'assessment' && currentQuestion) {
      // Auto-skip on timeout
      handleNext(true);
    }
  }, [timeRemaining, stage]);

  // Start timer when question changes
  useEffect(() => {
    if (stage === 'assessment' && currentQuestion) {
      setTimeRemaining(currentQuestion.timeLimit || 30);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, stage]);

  const handleStartAssessment = () => {
    setStage('assessment');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (answer: string | string[]) => {
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    
    setAnswers({ ...answers, [currentQuestion.id]: answer });
    
    // Update behavior metrics
    setBehaviorMetrics(prev => ({
      ...prev,
      avgTimePerQuestion: (prev.avgTimePerQuestion * currentQuestionIndex + timeTaken) / (currentQuestionIndex + 1),
    }));
  };

  const handleNext = (skipped: boolean = false) => {
    if (skipped) {
      setBehaviorMetrics(prev => ({ ...prev, questionsSkipped: prev.questionsSkipped + 1 }));
    }

    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Assessment complete
      analyzeAndGenerateRecommendations();
    }
  };

  const analyzeAndGenerateRecommendations = () => {
    setStage('analyzing');
    
    // Simulate analysis delay
    setTimeout(() => {
      const recs = generateRecommendations();
      setRecommendations(recs);
      setStage('results');
    }, 3000);
  };

  const generateRecommendations = (): CareerRecommendation[] => {
    // Calculate scores based on answers, behavior, discipline, and test scores
    
    // Interest scores
    const mathInterest = answers['int1'] ? ['Not at all', 'Somewhat', 'Moderately', 'Very much', 'Extremely'].indexOf(answers['int1'] as string) * 20 : 60;
    const mechanicalInterest = answers['int2'] ? ['Not at all', 'Somewhat', 'Moderately', 'Very much', 'Extremely'].indexOf(answers['int2'] as string) * 20 : 60;
    const biologyInterest = answers['int3'] ? ['Not at all', 'Somewhat', 'Moderately', 'Very much', 'Extremely'].indexOf(answers['int3'] as string) * 20 : 60;
    const codingInterest = answers['int4'] ? ['Not at all', 'Somewhat', 'Moderately', 'Very much', 'Extremely'].indexOf(answers['int4'] as string) * 20 : 60;
    
    // Aptitude scores (simplified)
    const aptitudeScore = (answers['apt1'] === 'C' ? 33 : 0) + (answers['apt2'] === 'C' ? 33 : 0) + (answers['apt3'] === 'D' ? 34 : 0);
    
    // Behavior bonus/penalty
    const behaviorScore = (100 - behaviorMetrics.questionsSkipped * 5) * (behaviorMetrics.confidenceLevel / 100);
    
    // Discipline factor
    const disciplineScore = (
      mockDisciplineData.studyConsistency +
      mockDisciplineData.goalCompletionRate +
      mockDisciplineData.punctuality +
      mockDisciplineData.regularPractice +
      mockDisciplineData.revisionFrequency +
      mockDisciplineData.mockTestParticipation
    ) / 6;
    
    // Generate recommendations
    const allRecommendations: CareerRecommendation[] = [
      {
        career: 'Software Engineering & AI',
        matchScore: Math.round((codingInterest * 0.3 + mockScoreAnalysis.mathsStrength * 0.25 + aptitudeScore * 0.2 + behaviorScore * 0.15 + disciplineScore * 0.1)),
        icon: Code,
        color: '#3B82F6',
        description: 'Build innovative software solutions and AI systems',
        requiredSkills: ['Programming', 'Data Structures', 'Algorithms', 'Problem Solving', 'Mathematics'],
        collegeSuggestions: ['IIT Bombay CSE', 'IIT Delhi CSE', 'IIIT Hyderabad', 'BITS Pilani CSE'],
        branchOptions: ['Computer Science', 'AI & ML', 'Data Science', 'Software Engineering'],
        skillGaps: mockScoreAnalysis.mathsStrength < 80 ? ['Advanced Mathematics'] : [],
        developmentPlan: [
          'Master Python and Java programming',
          'Learn Data Structures & Algorithms',
          'Build 5+ projects for portfolio',
          'Practice competitive programming',
          'Study AI/ML fundamentals'
        ],
        timelineYears: 4,
        avgPackage: '12-45 LPA',
        topColleges: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIIT Hyderabad', 'BITS Pilani']
      },
      {
        career: 'Mechanical Engineering',
        matchScore: Math.round((mechanicalInterest * 0.3 + mockScoreAnalysis.physicsStrength * 0.25 + mockScoreAnalysis.mathsStrength * 0.2 + disciplineScore * 0.15 + aptitudeScore * 0.1)),
        icon: Zap,
        color: '#F59E0B',
        description: 'Design and develop mechanical systems and machines',
        requiredSkills: ['Physics', 'Mathematics', 'CAD Design', 'Thermodynamics', 'Material Science'],
        collegeSuggestions: ['IIT Bombay Mech', 'IIT Madras Mech', 'IIT Kharagpur', 'NIT Trichy'],
        branchOptions: ['Mechanical Engineering', 'Mechatronics', 'Aerospace Engineering', 'Automobile Engineering'],
        skillGaps: mockScoreAnalysis.physicsStrength < 75 ? ['Thermodynamics', 'Fluid Mechanics'] : [],
        developmentPlan: [
          'Strengthen Physics fundamentals',
          'Learn CAD software (AutoCAD, SolidWorks)',
          'Understand manufacturing processes',
          'Study material properties',
          'Work on robotics projects'
        ],
        timelineYears: 4,
        avgPackage: '6-25 LPA',
        topColleges: ['IIT Bombay', 'IIT Madras', 'IIT Kharagpur', 'NIT Trichy', 'BITS Pilani']
      },
      {
        career: 'Medicine (MBBS)',
        matchScore: Math.round((biologyInterest * 0.35 + mockDisciplineData.studyConsistency * 0.25 + disciplineScore * 0.2 + behaviorScore * 0.15 + aptitudeScore * 0.05)),
        icon: Heart,
        color: '#EF4444',
        description: 'Diagnose and treat patients, save lives',
        requiredSkills: ['Biology', 'Chemistry', 'Memory Retention', 'Empathy', 'Stamina', 'Communication'],
        collegeSuggestions: ['AIIMS Delhi', 'AIIMS Bombay', 'CMC Vellore', 'JIPMER', 'KGMU'],
        branchOptions: ['General Medicine', 'Surgery', 'Pediatrics', 'Cardiology', 'Neurology'],
        skillGaps: biologyInterest < 60 ? ['Biology fundamentals', 'Chemistry organic'] : [],
        developmentPlan: [
          'Master NEET syllabus completely',
          'Focus on Biology (50% weightage)',
          'Practice MCQ speed and accuracy',
          'Develop strong revision system',
          'Take regular mock tests',
          'Build mental stamina for long exams'
        ],
        timelineYears: 5.5,
        avgPackage: '8-50 LPA (after PG)',
        topColleges: ['AIIMS Delhi', 'AIIMS Mumbai', 'CMC Vellore', 'JIPMER', 'KGMU']
      },
      {
        career: 'Electrical Engineering',
        matchScore: Math.round((mechanicalInterest * 0.25 + mockScoreAnalysis.physicsStrength * 0.25 + mockScoreAnalysis.mathsStrength * 0.2 + disciplineScore * 0.2 + aptitudeScore * 0.1)),
        icon: Zap,
        color: '#8B5CF6',
        description: 'Work with electrical systems, power, and electronics',
        requiredSkills: ['Physics', 'Mathematics', 'Circuit Design', 'Power Systems', 'Electronics'],
        collegeSuggestions: ['IIT Bombay EE', 'IIT Kanpur EE', 'IIT Madras EE', 'BITS Pilani EEE'],
        branchOptions: ['Electrical Engineering', 'Electronics & Communication', 'Power Engineering', 'Control Systems'],
        skillGaps: mockScoreAnalysis.physicsStrength < 75 ? ['Electromagnetism', 'Circuit Theory'] : [],
        developmentPlan: [
          'Master electromagnetic theory',
          'Learn circuit analysis',
          'Study power systems',
          'Practice electrical simulations',
          'Understand control systems'
        ],
        timelineYears: 4,
        avgPackage: '7-30 LPA',
        topColleges: ['IIT Bombay', 'IIT Kanpur', 'IIT Madras', 'BITS Pilani', 'NIT Trichy']
      },
      {
        career: 'Pure Sciences & Research',
        matchScore: Math.round((mathInterest * 0.3 + mockScoreAnalysis.mathsStrength * 0.25 + mockScoreAnalysis.physicsStrength * 0.2 + disciplineScore * 0.15 + behaviorScore * 0.1)),
        icon: Microscope,
        color: '#10B981',
        description: 'Conduct research in fundamental sciences',
        requiredSkills: ['Deep Analytical Thinking', 'Research Methodology', 'Mathematics', 'Physics/Chemistry', 'Patience'],
        collegeSuggestions: ['IISc Bangalore', 'TIFR Mumbai', 'IIT Bombay MSc', 'IISER Pune'],
        branchOptions: ['Physics', 'Mathematics', 'Chemistry', 'Astrophysics', 'Material Science'],
        skillGaps: mockScoreAnalysis.consistency < 80 ? ['Research methodology', 'Long-term focus'] : [],
        developmentPlan: [
          'Develop deep conceptual understanding',
          'Read research papers regularly',
          'Participate in science olympiads',
          'Learn advanced mathematics',
          'Work on research projects'
        ],
        timelineYears: 7,
        avgPackage: '6-15 LPA (academia), 15-40 LPA (industry R&D)',
        topColleges: ['IISc Bangalore', 'TIFR', 'IIT Bombay', 'IISER Pune', 'IIT Madras']
      },
      {
        career: 'Data Science & Analytics',
        matchScore: Math.round((codingInterest * 0.25 + mathInterest * 0.25 + mockScoreAnalysis.mathsStrength * 0.2 + aptitudeScore * 0.15 + behaviorScore * 0.15)),
        icon: BarChart3,
        color: '#06B6D4',
        description: 'Analyze data to derive business insights',
        requiredSkills: ['Statistics', 'Programming (Python/R)', 'Machine Learning', 'Data Visualization', 'SQL'],
        collegeSuggestions: ['IIT Bombay DS', 'IIT Madras DS', 'ISI Kolkata', 'IIIT Bangalore'],
        branchOptions: ['Data Science', 'Business Analytics', 'Statistics', 'Applied Mathematics'],
        skillGaps: codingInterest < 60 ? ['Programming basics', 'Statistical knowledge'] : [],
        developmentPlan: [
          'Learn Python and R programming',
          'Master statistics and probability',
          'Study machine learning algorithms',
          'Practice on real datasets',
          'Build analytics projects portfolio'
        ],
        timelineYears: 4,
        avgPackage: '10-35 LPA',
        topColleges: ['IIT Bombay', 'IIT Madras', 'ISI Kolkata', 'IIIT Bangalore', 'BITS Pilani']
      }
    ];
    
    // Sort by match score and return top recommendations
    return allRecommendations.sort((a, b) => b.matchScore - a.matchScore);
  };

  if (stage === 'intro') {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1000px] mx-auto px-6 py-12">
          <div 
            className="p-8 text-center"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
            }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6"
              style={{
                background: 'var(--accent-soft)',
                border: '2px solid var(--accent-primary)',
                borderRadius: '50%',
              }}
            >
              <Brain className="w-10 h-10" style={{ color: 'var(--accent-primary)' }} />
            </div>
            
            <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Career Intelligence Assessment
            </h1>
            <p className="text-base mb-8 max-w-[600px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Take our comprehensive assessment to discover your ideal career path. We analyze your aptitude, interests, personality, behavior patterns, discipline, and academic performance to provide personalized recommendations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
                <Target className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {assessmentQuestions.length} Questions
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Multi-category assessment
                </div>
              </div>

              <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
                <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  ~10-15 Minutes
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Timed questions
                </div>
              </div>

              <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
                <Brain className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  AI-Powered Analysis
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Behavioral insights
                </div>
              </div>
            </div>

            <div className="p-6 mb-8 text-left" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
                <div>
                  <div className="text-sm font-bold mb-2" style={{ color: '#92400E' }}>
                    What We Analyze:
                  </div>
                  <ul className="text-sm space-y-1" style={{ color: '#78350F' }}>
                    <li>• <strong>Aptitude:</strong> Logical, numerical, and verbal reasoning</li>
                    <li>• <strong>Interests:</strong> Subject preferences and career inclinations</li>
                    <li>• <strong>Personality:</strong> Leadership, teamwork, and work preferences</li>
                    <li>• <strong>Behavior:</strong> Test-taking patterns and decision-making style</li>
                    <li>• <strong>Discipline:</strong> Study consistency and goal completion habits</li>
                    <li>• <strong>Performance:</strong> JEE/NEET scores and subject strengths</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartAssessment}
              className="px-12 py-4 text-base font-bold uppercase tracking-wide transition-all duration-200 flex items-center gap-3 mx-auto"
              style={{
                background: 'var(--accent-primary)',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Play className="w-5 h-5" />
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'assessment') {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[900px] mx-auto px-6 py-8">
          {/* Progress Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: timeRemaining < 10 ? '#EF4444' : 'var(--accent-primary)' }} />
                <span 
                  className="text-sm font-bold"
                  style={{ color: timeRemaining < 10 ? '#EF4444' : 'var(--text-primary)' }}
                >
                  {timeRemaining}s
                </span>
              </div>
            </div>
            <div className="w-full h-2" style={{ background: 'var(--bg-secondary)' }}>
              <div
                className="h-2 transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'var(--accent-primary)',
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div 
            className="p-8 mb-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
            }}
          >
            <div 
              className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wide"
              style={{
                background: 'var(--accent-soft)',
                color: 'var(--accent-primary)',
              }}
            >
              {currentQuestion.category}
            </div>

            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left transition-all duration-200 flex items-center gap-3"
                    style={{
                      background: isSelected ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-soft)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'var(--border-medium)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'var(--border-soft)';
                      }
                    }}
                  >
                    <div 
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isSelected ? 'var(--accent-primary)' : 'transparent',
                        border: '2px solid',
                        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-medium)',
                        borderRadius: '50%',
                      }}
                    >
                      {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                    </div>
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNext(true)}
              className="px-6 py-3 text-sm font-semibold transition-all duration-200"
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
              }}
            >
              Skip Question
            </button>

            <button
              onClick={() => handleNext(false)}
              disabled={!answers[currentQuestion.id]}
              className="px-8 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-200 flex items-center gap-2"
              style={{
                background: answers[currentQuestion.id] ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: answers[currentQuestion.id] ? '#ffffff' : 'var(--text-tertiary)',
                opacity: answers[currentQuestion.id] ? 1 : 0.5,
                cursor: answers[currentQuestion.id] ? 'pointer' : 'not-allowed',
              }}
            >
              {currentQuestionIndex === assessmentQuestions.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'analyzing') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 relative">
            <div 
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                border: '4px solid var(--bg-secondary)',
                borderTopColor: 'var(--accent-primary)',
              }}
            />
            <Brain className="w-12 h-12" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Analyzing Your Responses
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Processing aptitude, behavior patterns, discipline, and performance data...
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'results') {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Results Header */}
          <div 
            className="p-6 mb-6"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-hover) 100%)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold text-white">
                Assessment Complete!
              </h1>
            </div>
            <p className="text-base text-white/90">
              Based on your responses, behavior, discipline, and academic performance, here are your personalized career recommendations
            </p>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Aptitude Score
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {Math.round((Object.keys(answers).filter(k => k.startsWith('apt')).length / 3) * 100)}%
              </div>
            </div>

            <div className="p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Discipline Score
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {Math.round((mockDisciplineData.studyConsistency + mockDisciplineData.goalCompletionRate) / 2)}%
              </div>
            </div>

            <div className="p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Decision Speed
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {behaviorMetrics.avgTimePerQuestion > 0 ? Math.round(behaviorMetrics.avgTimePerQuestion) : 28}s
              </div>
            </div>

            <div className="p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Confidence Level
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {behaviorMetrics.confidenceLevel}%
              </div>
            </div>
          </div>

          {/* Career Recommendations */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Your Top Career Matches
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                const isExpanded = selectedRecommendation?.career === rec.career;
                
                return (
                  <div
                    key={index}
                    className="transition-all duration-200"
                    style={{
                      background: 'var(--bg-card)',
                      border: '2px solid',
                      borderColor: isExpanded ? rec.color : 'var(--border-soft)',
                    }}
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => setSelectedRecommendation(isExpanded ? null : rec)}
                    >
                      <div className="flex items-start gap-6">
                        <div 
                          className="w-16 h-16 flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${rec.color}15`,
                            border: `2px solid ${rec.color}`,
                          }}
                        >
                          <Icon className="w-8 h-8" style={{ color: rec.color }} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {index === 0 && (
                              <span 
                                className="px-2 py-0.5 text-xs font-bold uppercase"
                                style={{ background: '#FEF3C7', color: '#92400E' }}
                              >
                                Best Match
                              </span>
                            )}
                            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                              {rec.career}
                            </h3>
                          </div>
                          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                            {rec.description}
                          </p>

                          <div className="flex items-center gap-4 mb-3">
                            <div>
                              <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>
                                Match Score:
                              </span>
                              <span className="text-lg font-bold ml-2" style={{ color: rec.color }}>
                                {rec.matchScore}%
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>
                                Timeline:
                              </span>
                              <span className="text-sm font-bold ml-2" style={{ color: 'var(--text-primary)' }}>
                                {rec.timelineYears} years
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>
                                Package:
                              </span>
                              <span className="text-sm font-bold ml-2" style={{ color: 'var(--text-primary)' }}>
                                {rec.avgPackage}
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-2" style={{ background: 'var(--bg-secondary)' }}>
                            <div
                              className="h-2 transition-all duration-500"
                              style={{
                                width: `${rec.matchScore}%`,
                                background: rec.color,
                              }}
                            />
                          </div>
                        </div>

                        <ChevronRight 
                          className="w-5 h-5 flex-shrink-0 transition-transform duration-200"
                          style={{ 
                            color: 'var(--text-tertiary)',
                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div 
                        className="px-6 pb-6"
                        style={{ borderTop: '1px solid var(--border-soft)' }}
                      >
                        <div className="grid grid-cols-2 gap-6 pt-6">
                          {/* Required Skills */}
                          <div>
                            <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                              <Target className="w-4 h-4" style={{ color: rec.color }} />
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {rec.requiredSkills.map((skill, i) => (
                                <span 
                                  key={i}
                                  className="px-3 py-1 text-xs font-semibold"
                                  style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-soft)',
                                    color: 'var(--text-primary)',
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Top Colleges */}
                          <div>
                            <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                              <Award className="w-4 h-4" style={{ color: rec.color }} />
                              Top Colleges
                            </h4>
                            <div className="space-y-1">
                              {rec.topColleges.slice(0, 5).map((college, i) => (
                                <div key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  {i + 1}. {college}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Skill Gaps */}
                          {rec.skillGaps.length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <AlertCircle className="w-4 h-4" style={{ color: '#F59E0B' }} />
                                Skill Gaps to Address
                              </h4>
                              <div className="space-y-1">
                                {rec.skillGaps.map((gap, i) => (
                                  <div 
                                    key={i} 
                                    className="text-xs px-2 py-1"
                                    style={{ 
                                      background: '#FEF3C7',
                                      color: '#92400E',
                                      border: '1px solid #FDE68A'
                                    }}
                                  >
                                    • {gap}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Development Plan */}
                          <div>
                            <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                              <Lightbulb className="w-4 h-4" style={{ color: rec.color }} />
                              Development Roadmap
                            </h4>
                            <div className="space-y-2">
                              {rec.developmentPlan.map((step, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: rec.color }} />
                                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    {step}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          className="mt-6 w-full py-3 text-sm font-bold uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                          style={{
                            background: rec.color,
                            color: '#ffffff',
                          }}
                          onClick={() => {
                            // This would navigate to detailed career planning
                            alert(`Starting detailed planning for ${rec.career}`);
                          }}
                        >
                          Start Career Planning
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setStage('intro')}
              className="px-6 py-3 text-sm font-semibold transition-all duration-200"
              style={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
              }}
            >
              Retake Assessment
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-200"
              style={{
                background: 'var(--accent-primary)',
                color: '#ffffff',
              }}
            >
              Save Results & Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

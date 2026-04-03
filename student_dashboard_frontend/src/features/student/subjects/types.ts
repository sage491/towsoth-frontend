export interface SubjectLearningLoop {
  watched: { current: number; total: number };
  practiced: { current: number; total: number };
  revised: { current: number; total: number };
  tested: { current: number; total: number };
}

export interface SubjectsPageSubject {
  id: number;
  name: string;
  mastery: number;
  trend: 'stable' | 'rising' | 'dropping';
  currentFocus: string;
  chapter: string;
  nextAction: string;
  weakClusters: string[];
  learningLoop: SubjectLearningLoop;
  retention: number;
  lastStudied: string;
}

export interface OptimizedStudyItem {
  subject: string;
  topic: string;
  priority: string;
  color: 'red' | 'orange' | 'blue';
}

export interface MySubjectsCourse {
  id: number;
  code: string;
  title: string;
  instructor: { name: string; avatar: null };
  pattern: 'teal-grid' | 'yellow-triangle' | 'beige-circle' | 'gray-ring' | 'cyan-plaid' | 'pink-gradient';
}

export interface MySubjectsLearningTab {
  id: string;
  label: string;
  icon: 'BookOpen' | 'Play' | 'RefreshCw' | 'ClipboardCheck' | 'TrendingDown' | 'BarChart3' | 'FileText';
}

export interface MySubjectsStudentData {
  recentAccuracy: number;
  studyStreak: number;
  weakTopicsCount: number;
  upcomingTests: number;
  completedToday: number;
}

export interface SubjectLearnLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'practice' | 'reading';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  instructor: string;
  views: number;
  rating: number;
  lastUpdated: string;
}

export interface SubjectLearnModule {
  id: number;
  title: string;
  description: string;
  totalLessons: number;
  duration: string;
  progress: number;
  lessons?: SubjectLearnLesson[];
  locked?: boolean;
  prerequisite?: string;
}

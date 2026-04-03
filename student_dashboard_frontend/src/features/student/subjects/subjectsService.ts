import { MySubjectsCourse, MySubjectsLearningTab, MySubjectsStudentData, OptimizedStudyItem, SubjectsPageSubject } from './types';

type SubjectsDataSource = {
  subjectsPageSubjects: SubjectsPageSubject[];
  optimizedStudyOrder: OptimizedStudyItem[];
  mySubjectsCourses: MySubjectsCourse[];
  mySubjectsLearningTabs: MySubjectsLearningTab[];
  mySubjectsStudentData: MySubjectsStudentData;
};

const createDefaultSubjectsDataSource = (): SubjectsDataSource => ({
  subjectsPageSubjects: [
    {
      id: 1,
      name: 'Physics',
      mastery: 68,
      trend: 'stable',
      currentFocus: 'EM Induction & AC Circuits',
      chapter: 'Electrodynamics',
      nextAction: 'Complete Practice Set (25Q)',
      weakClusters: ['Lenz Law Applications', 'AC Circuit Phasors', 'Transformer Efficiency'],
      learningLoop: {
        watched: { current: 7, total: 12 },
        practiced: { current: 28, total: 45 },
        revised: { current: 3, total: 8 },
        tested: { current: 2, total: 3 },
      },
      retention: 72,
      lastStudied: '2 hours ago',
    },
    {
      id: 2,
      name: 'Chemistry',
      mastery: 82,
      trend: 'rising',
      currentFocus: 'Reaction Mechanisms',
      chapter: 'Organic Chemistry',
      nextAction: 'Watch: SN2 Mechanism Video',
      weakClusters: ['SN1 vs SN2 Selectivity'],
      learningLoop: {
        watched: { current: 9, total: 10 },
        practiced: { current: 38, total: 50 },
        revised: { current: 7, total: 8 },
        tested: { current: 3, total: 3 },
      },
      retention: 88,
      lastStudied: 'Yesterday',
    },
    {
      id: 3,
      name: 'Mathematics',
      mastery: 75,
      trend: 'rising',
      currentFocus: 'Definite Integration',
      chapter: 'Calculus',
      nextAction: 'Revise: Area Under Curves',
      weakClusters: ['Integration by Parts', 'Reduction Formulas'],
      learningLoop: {
        watched: { current: 11, total: 14 },
        practiced: { current: 42, total: 60 },
        revised: { current: 8, total: 10 },
        tested: { current: 2, total: 3 },
      },
      retention: 81,
      lastStudied: 'Today',
    },
    {
      id: 4,
      name: 'Biology',
      mastery: 58,
      trend: 'dropping',
      currentFocus: 'Molecular Basis of Inheritance',
      chapter: 'Genetics',
      nextAction: 'Fix Weak Concepts First',
      weakClusters: ['DNA Replication Enzymes', 'Transcription Factors', 'Post-transcriptional Modification'],
      learningLoop: {
        watched: { current: 6, total: 11 },
        practiced: { current: 22, total: 55 },
        revised: { current: 2, total: 9 },
        tested: { current: 1, total: 3 },
      },
      retention: 64,
      lastStudied: '5 days ago',
    },
  ],
  optimizedStudyOrder: [
    { subject: 'Biology', topic: 'Fix weak concepts', priority: 'Critical', color: 'red' },
    { subject: 'Physics', topic: 'EM Induction practice', priority: 'High', color: 'orange' },
    { subject: 'Maths', topic: 'Integration revision', priority: 'Medium', color: 'blue' },
  ],
  mySubjectsCourses: [
    {
      id: 1,
      code: 'JEE_25PHY-401',
      title: 'ADVANCED MECHANICS & ROTATIONAL DYNAMICS',
      instructor: { name: 'Dr. Rajesh Verma', avatar: null },
      pattern: 'teal-grid'
    },
    {
      id: 2,
      code: 'JEE_25MTH-302',
      title: 'INTEGRAL CALCULUS & DIFFERENTIAL EQUATIONS',
      instructor: { name: 'Prof. Anita Kapoor', avatar: null },
      pattern: 'yellow-triangle'
    },
    {
      id: 3,
      code: 'JEE_25CHM-205',
      title: 'ORGANIC CHEMISTRY - REACTION MECHANISMS',
      instructor: { name: 'Dr. Suresh Patel', avatar: null },
      pattern: 'beige-circle'
    },
    {
      id: 4,
      code: 'NEET_25BIO-108',
      title: 'CELL BIOLOGY AND MOLECULAR GENETICS',
      instructor: { name: 'Dr. Priya Nair', avatar: null },
      pattern: 'gray-ring'
    },
    {
      id: 5,
      code: 'JEE_25PHY-403',
      title: 'ELECTROMAGNETIC THEORY & WAVES',
      instructor: { name: 'Prof. Vikram Singh', avatar: null },
      pattern: 'cyan-plaid'
    },
    {
      id: 6,
      code: 'JEE_25MTH-304',
      title: 'COORDINATE GEOMETRY & VECTOR ALGEBRA',
      instructor: { name: 'Dr. Neha Sharma', avatar: null },
      pattern: 'pink-gradient'
    },
  ],
  mySubjectsLearningTabs: [
    { id: 'learn', label: 'Learn', icon: 'BookOpen' },
    { id: 'practice', label: 'Practice', icon: 'Play' },
    { id: 'revise', label: 'Revise', icon: 'RefreshCw' },
    { id: 'test', label: 'Test', icon: 'ClipboardCheck' },
    { id: 'weak-topics', label: 'Weak Topics', icon: 'TrendingDown' },
    { id: 'analytics', label: 'Learning Analytics', icon: 'BarChart3' },
    { id: 'notes', label: 'Notes & Resources', icon: 'FileText' },
  ],
  mySubjectsStudentData: {
    recentAccuracy: 65,
    studyStreak: 7,
    weakTopicsCount: 3,
    upcomingTests: 2,
    completedToday: 2
  },
});

let subjectsDataSource = createDefaultSubjectsDataSource();

export function configureSubjectsDataSource(patch: Partial<SubjectsDataSource>) {
  subjectsDataSource = {
    ...subjectsDataSource,
    ...patch,
  };
}

export function resetSubjectsDataSource() {
  subjectsDataSource = createDefaultSubjectsDataSource();
}

export function getSubjectsPageSubjects(): SubjectsPageSubject[] {
  return subjectsDataSource.subjectsPageSubjects.map((item) => ({
    ...item,
    weakClusters: [...item.weakClusters],
    learningLoop: {
      watched: { ...item.learningLoop.watched },
      practiced: { ...item.learningLoop.practiced },
      revised: { ...item.learningLoop.revised },
      tested: { ...item.learningLoop.tested },
    },
  }));
}

export function getOptimizedStudyOrder(): OptimizedStudyItem[] {
  return subjectsDataSource.optimizedStudyOrder.map((item) => ({ ...item }));
}

export function getMySubjectsCourses(): MySubjectsCourse[] {
  return subjectsDataSource.mySubjectsCourses.map((item) => ({
    ...item,
    instructor: { ...item.instructor },
  }));
}

export function getMySubjectsLearningTabs(): MySubjectsLearningTab[] {
  return subjectsDataSource.mySubjectsLearningTabs.map((item) => ({ ...item }));
}

export function getMySubjectsStudentData(): MySubjectsStudentData {
  return { ...subjectsDataSource.mySubjectsStudentData };
}

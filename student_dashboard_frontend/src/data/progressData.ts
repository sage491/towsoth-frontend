// Shared progress data for Progress Analytics and Progress Tracking
// This ensures both pages show correlated information

import type { OverallProgress } from '@/features/analytics/components/types';

const overallProgress: OverallProgress = {
  currentPace: 67,
  requiredPace: 72,
  status: 'slightly-behind',
  burnoutRisk: 'low',
  gapPercentage: 5,
};

export const sharedProgressData = {
  // Current period summary
  currentWeek: {
    studyTime: 40.25, // hours (40h 15m)
    targetTime: 38, // hours (6h/day * 7 days = 42h, but adjusted)
    topicsCovered: 8,
    topicsTarget: 6,
    practiceSets: 12,
    practiceSetsTarget: 10,
    status: 'ahead' as const,
  },

  // Monthly metrics
  monthly: {
    syllabusCompletion: 67,
    syllabusTarget: 72,
    testAverage: 82,
    testTarget: 85,
    weakTopics: 3,
    weakTopicsTarget: 2,
    consistency: 78,
    consistencyTarget: 90,
    totalHours: 182,
    totalTargetHours: 195,
    focusQuality: 72,
  },

  // Overall pace calculation
  overall: overallProgress,

  // Weekly study data (last 7 days)
  weeklyData: [
    { day: 'Mon', actual: 7.5, target: 6 },
    { day: 'Tue', actual: 6.2, target: 6 },
    { day: 'Wed', actual: 8.1, target: 6 },
    { day: 'Thu', actual: 5.8, target: 6 },
    { day: 'Fri', actual: 7.2, target: 6 },
    { day: 'Sat', actual: 3.5, target: 6 },
    { day: 'Sun', actual: 2.2, target: 6 },
  ],

  // Weekly trend (last 4 weeks)
  weeklyTrend: [
    { week: 'Week 1', actual: 65, target: 70 },
    { week: 'Week 2', actual: 68, target: 71 },
    { week: 'Week 3', actual: 70, target: 72 },
    { week: 'Week 4', actual: 67, target: 72 },
  ],

  // Syllabus completion trend (6 weeks)
  syllabusData: [
    { week: 'W1', actual: 12, planned: 10 },
    { week: 'W2', actual: 24, planned: 22 },
    { week: 'W3', actual: 38, planned: 35 },
    { week: 'W4', actual: 52, planned: 48 },
    { week: 'W5', actual: 59, planned: 60 },
    { week: 'W6', actual: 67, planned: 72 },
  ],

  // Test performance trend
  testData: [
    { name: 'Test 1', score: 72 },
    { name: 'Test 2', score: 78 },
    { name: 'Test 3', score: 75 },
    { name: 'Test 4', score: 82 },
    { name: 'Test 5', score: 84 },
    { name: 'Test 6', score: 82 },
    { name: 'Test 7', score: 85 },
    { name: 'Test 8', score: 88 },
  ],

  // Subject-wise progress
  subjectProgress: [
    { subject: 'Physics', completion: 78, onTrack: true },
    { subject: 'Chemistry', completion: 71, onTrack: true },
    { subject: 'Mathematics', completion: 68, onTrack: false },
  ],

  // Key milestones
  milestones: [
    { 
      name: 'Complete Physics Syllabus', 
      target: '100%', 
      actual: '78%', 
      dueDate: 'March 15', 
      status: 'on-track' as const 
    },
    { 
      name: 'Improve Test Average to 85%', 
      target: '85%', 
      actual: '82%', 
      dueDate: 'Feb 28', 
      status: 'on-track' as const 
    },
    { 
      name: 'Clear All Weak Topics', 
      target: '0 weak', 
      actual: '3 weak', 
      dueDate: 'March 1', 
      status: 'behind' as const 
    },
    { 
      name: 'Daily Study 6h Consistency', 
      target: '90%', 
      actual: '78%', 
      dueDate: 'Ongoing', 
      status: 'needs-attention' as const 
    },
  ],

  // Weak topics data
  weakTopicsData: [
    { topic: 'Thermodynamics', errors: 18 },
    { topic: 'Organic Mechanisms', errors: 15 },
    { topic: 'Calculus Integration', errors: 12 },
    { topic: 'Electromagnetism', errors: 8 },
    { topic: 'Kinematics', errors: 5 },
  ],

  // Detailed weak topics
  weakTopicsDetailed: [
    {
      topic: 'Thermodynamics',
      lastPracticed: '3 days ago',
      nextReview: 'Today',
      retentionStrength: 45,
      status: 'critical' as const,
      errorCount: 18,
    },
    {
      topic: 'Organic Mechanisms',
      lastPracticed: '1 week ago',
      nextReview: 'Tomorrow',
      retentionStrength: 62,
      status: 'due-soon' as const,
      errorCount: 15,
    },
    {
      topic: 'Calculus Integration',
      lastPracticed: '2 days ago',
      nextReview: 'In 3 days',
      retentionStrength: 78,
      status: 'good' as const,
      errorCount: 12,
    },
    {
      topic: 'Electromagnetism',
      lastPracticed: '4 days ago',
      nextReview: 'In 2 days',
      retentionStrength: 71,
      status: 'good' as const,
      errorCount: 8,
    },
    {
      topic: 'Kinematics',
      lastPracticed: '1 day ago',
      nextReview: 'In 5 days',
      retentionStrength: 85,
      status: 'good' as const,
      errorCount: 5,
    },
  ],

  // Recent test performance details
  testsDetailed: [
    { name: 'Physics Mock #8', date: '2 days ago', score: 88, maxScore: 100, accuracy: 92, status: 'excellent' as const },
    { name: 'Chemistry Practice #12', date: '4 days ago', score: 82, maxScore: 100, accuracy: 85, status: 'good' as const },
    { name: 'Maths Full Length #5', date: '1 week ago', score: 85, maxScore: 100, accuracy: 88, status: 'good' as const },
    { name: 'Physics Chapter Test', date: '10 days ago', score: 82, maxScore: 100, accuracy: 84, status: 'good' as const },
    { name: 'Chemistry Mock #7', date: '12 days ago', score: 84, maxScore: 100, accuracy: 89, status: 'good' as const },
    { name: 'Maths Practice #11', date: '2 weeks ago', score: 75, maxScore: 100, accuracy: 78, status: 'average' as const },
  ],

  // Daily sessions detail
  dailySessionsDetailed: [
    { day: 'Monday', date: 'Jan 27', hours: 7.5, target: 6, sessions: 3, topTopics: ['Thermodynamics', 'Calculus'], status: 'ahead' as const },
    { day: 'Tuesday', date: 'Jan 28', hours: 6.2, target: 6, sessions: 2, topTopics: ['Organic Chemistry'], status: 'on-track' as const },
    { day: 'Wednesday', date: 'Jan 29', hours: 8.1, target: 6, sessions: 4, topTopics: ['Electromagnetism', 'Integration'], status: 'ahead' as const },
    { day: 'Thursday', date: 'Jan 30', hours: 5.8, target: 6, sessions: 2, topTopics: ['Kinematics'], status: 'behind' as const },
    { day: 'Friday', date: 'Jan 31', hours: 7.2, target: 6, sessions: 3, topTopics: ['Organic Mechanisms', 'Functions'], status: 'ahead' as const },
    { day: 'Saturday', date: 'Feb 1', hours: 3.5, target: 6, sessions: 1, topTopics: ['Revision'], status: 'behind' as const },
    { day: 'Sunday', date: 'Feb 2', hours: 2.2, target: 6, sessions: 1, topTopics: ['Light revision'], status: 'behind' as const },
  ],

  // Consistency heatmap (6 weeks)
  heatmapData: [
    [0, 6.5, 7.2, 5.8, 6.8, 3.2, 4.1], // Week 1
    [7.1, 6.3, 8.0, 5.5, 7.5, 0, 5.2], // Week 2
    [6.8, 7.0, 6.2, 7.8, 6.5, 4.5, 3.8], // Week 3
    [7.5, 6.8, 8.2, 6.0, 7.2, 5.5, 0], // Week 4
    [6.5, 7.5, 7.0, 8.5, 6.8, 4.0, 2.5], // Week 5
    [7.5, 6.2, 8.1, 5.8, 7.2, 3.5, 2.2], // Week 6 (current)
  ],

  // AI insights
  insights: {
    tracking: {
      message: "You're ahead of schedule in study time but slightly behind in test performance. Shift focus from volume to quality. Prioritize mistake analysis over new content for the next 2 weeks.",
      action: "Apply Suggested Adjustment"
    },
    analytics: {
      message: "You're 5% behind target pace but within catchable range. The gap is small. Focus on consistency over intensity—adding just 30 minutes per day gets you back on track by month-end. No need to rush. Steady progress wins.",
      tone: "calm"
    }
  }
};

import {
  ActivityDistributionItem,
  ConceptProgressItem,
  DailyActivityItem,
  SubjectMasteryItem,
  WeeklyProgressItem,
} from './types';

type AnalyticsDataSource = {
  weeklyProgressData: WeeklyProgressItem[];
  subjectData: SubjectMasteryItem[];
  activityDistributionData: ActivityDistributionItem[];
  dailyActivityData: DailyActivityItem[];
  conceptProgressData: ConceptProgressItem[];
};

const createDefaultAnalyticsDataSource = (): AnalyticsDataSource => ({
  weeklyProgressData: [
    { week: 'Week 1', score: 58, hours: 15.2 },
    { week: 'Week 2', score: 62, hours: 16.8 },
    { week: 'Week 3', score: 65, hours: 18.1 },
    { week: 'Week 4', score: 71, hours: 18.5 },
  ],
  subjectData: [
    { subject: 'Chemistry', mastery: 82, trend: 'up', delta: '+8%' },
    { subject: 'Mathematics', mastery: 75, trend: 'up', delta: '+5%' },
    { subject: 'Physics', mastery: 68, trend: 'stable', delta: '+1%' },
    { subject: 'Biology', mastery: 58, trend: 'down', delta: '-4%' },
  ],
  activityDistributionData: [
    { name: 'Practice', value: 40, hours: 7.4, color: '#10b981' },
    { name: 'Videos', value: 35, hours: 6.5, color: '#5B5F8D' },
    { name: 'Revision', value: 15, hours: 2.8, color: '#8b5cf6' },
    { name: 'Tests', value: 10, hours: 1.8, color: '#f59e0b' },
  ],
  dailyActivityData: [
    { day: 'Mon', hours: 3.2, accuracy: 85 },
    { day: 'Tue', hours: 2.8, accuracy: 82 },
    { day: 'Wed', hours: 4.1, accuracy: 88 },
    { day: 'Thu', hours: 2.1, accuracy: 79 },
    { day: 'Fri', hours: 3.8, accuracy: 86 },
    { day: 'Sat', hours: 1.5, accuracy: 75 },
    { day: 'Sun', hours: 2.9, accuracy: 83 },
  ],
  conceptProgressData: [
    { topic: 'Organic Chem', progress: 90, status: 'strong' },
    { topic: 'Calculus', progress: 85, status: 'strong' },
    { topic: 'Mechanics', progress: 72, status: 'good' },
    { topic: 'Thermodynamics', progress: 68, status: 'good' },
    { topic: 'Cell Biology', progress: 58, status: 'weak' },
    { topic: 'Genetics', progress: 52, status: 'weak' },
  ],
});

let analyticsDataSource = createDefaultAnalyticsDataSource();

export function configureAnalyticsDataSource(patch: Partial<AnalyticsDataSource>) {
  analyticsDataSource = {
    ...analyticsDataSource,
    ...patch,
  };
}

export function resetAnalyticsDataSource() {
  analyticsDataSource = createDefaultAnalyticsDataSource();
}

export function getWeeklyProgressData(): WeeklyProgressItem[] {
  return analyticsDataSource.weeklyProgressData.map((item) => ({ ...item }));
}

export function getSubjectData(): SubjectMasteryItem[] {
  return analyticsDataSource.subjectData.map((item) => ({ ...item }));
}

export function getActivityDistributionData(): ActivityDistributionItem[] {
  return analyticsDataSource.activityDistributionData.map((item) => ({ ...item }));
}

export function getDailyActivityData(): DailyActivityItem[] {
  return analyticsDataSource.dailyActivityData.map((item) => ({ ...item }));
}

export function getConceptProgressData(): ConceptProgressItem[] {
  return analyticsDataSource.conceptProgressData.map((item) => ({ ...item }));
}

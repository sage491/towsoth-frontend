export {
  type ActivityDistributionItem,
  type ConceptProgressItem,
  type DailyActivityItem,
  type SubjectMasteryItem,
  type WeeklyProgressItem,
} from "@/features/student/analytics/types";
import {
  getActivityDistributionData as getActivityDistributionDataSync,
  getConceptProgressData as getConceptProgressDataSync,
  getDailyActivityData as getDailyActivityDataSync,
  getSubjectData as getSubjectDataSync,
  getWeeklyProgressData as getWeeklyProgressDataSync,
} from "@/features/student/analytics/analyticsService";

export async function getWeeklyProgressData() {
  // Future API call
  // return apiRequest<WeeklyProgressItem[]>("/analytics/weekly-progress");
  return Promise.resolve(getWeeklyProgressDataSync());
}

export async function getSubjectData() {
  // Future API call
  // return apiRequest<SubjectMasteryItem[]>("/analytics/subjects");
  return Promise.resolve(getSubjectDataSync());
}

export async function getActivityDistributionData() {
  // Future API call
  // return apiRequest<ActivityDistributionItem[]>("/analytics/activity-distribution");
  return Promise.resolve(getActivityDistributionDataSync());
}

export async function getDailyActivityData() {
  // Future API call
  // return apiRequest<DailyActivityItem[]>("/analytics/daily-activity");
  return Promise.resolve(getDailyActivityDataSync());
}

export async function getConceptProgressData() {
  // Future API call
  // return apiRequest<ConceptProgressItem[]>("/analytics/concept-progress");
  return Promise.resolve(getConceptProgressDataSync());
}

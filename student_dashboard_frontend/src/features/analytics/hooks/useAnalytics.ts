import { useQuery } from "@tanstack/react-query";
import {
  getActivityDistributionData,
  getConceptProgressData,
  getDailyActivityData,
  getSubjectData,
  getWeeklyProgressData,
} from "@/features/analytics/services";

export function useAnalyticsData() {
  const weeklyProgress = useQuery({ queryKey: ["analytics", "weekly-progress"], queryFn: getWeeklyProgressData });
  const subjectData = useQuery({ queryKey: ["analytics", "subjects"], queryFn: getSubjectData });
  const activityDistribution = useQuery({ queryKey: ["analytics", "activity-distribution"], queryFn: getActivityDistributionData });
  const dailyActivity = useQuery({ queryKey: ["analytics", "daily-activity"], queryFn: getDailyActivityData });
  const conceptProgress = useQuery({ queryKey: ["analytics", "concept-progress"], queryFn: getConceptProgressData });

  return { weeklyProgress, subjectData, activityDistribution, dailyActivity, conceptProgress };
}

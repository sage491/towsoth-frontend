import { mockRevisionPlannerConfig, type RevisionPlannerConfig } from "@/mocks/mockRevisionPlanner";
import { getTodayPoints as getTodayPointsSync, getWeeklyPoints as getWeeklyPointsSync, saveDailyPoints as saveDailyPointsSync } from "@/utils/pointsSystem";
import type { DailyPoints } from "@/utils/pointsSystem";

export type { RevisionPlannerConfig };
export type { DailyPoints };

export async function getRevisionPlannerConfig(): Promise<RevisionPlannerConfig> {
  // Future API call
  // return apiRequest<RevisionPlannerConfig>("/planner/revision-config");
  return Promise.resolve({
    subjects: [...mockRevisionPlannerConfig.subjects],
    topicsBySubject: Object.fromEntries(
      Object.entries(mockRevisionPlannerConfig.topicsBySubject).map(([subject, topics]) => [subject, [...topics]])
    ),
    timeSlots: [...mockRevisionPlannerConfig.timeSlots],
  });
}

export async function getTodayPoints(): Promise<DailyPoints | null> {
  // Future API call
  // return apiRequest<number>("/planner/today-points");
  return Promise.resolve(getTodayPointsSync());
}

export async function getWeeklyPoints(): Promise<{ total: number; average: number; days: DailyPoints[] }> {
  // Future API call
  // return apiRequest<number>("/planner/weekly-points");
  return Promise.resolve(getWeeklyPointsSync());
}

export async function saveDailyPoints(points: number, tasksCompleted: number): Promise<void> {
  // Future API call
  // await apiRequest<void>("/planner/save-points", { method: "POST", body: JSON.stringify({ points, tasksCompleted }) });
  saveDailyPointsSync(points, tasksCompleted);
  return Promise.resolve();
}

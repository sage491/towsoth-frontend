import { useMutation, useQuery } from "@tanstack/react-query";
import { getTodayPoints, getWeeklyPoints, saveDailyPoints } from "@/features/planner/services";
import type { DailyPoints } from "@/services/plannerService";

export function usePlannerSummary() {
  const todayPoints = useQuery<DailyPoints | null>({ queryKey: ["planner", "today-points"], queryFn: () => getTodayPoints() });
  const weeklyPoints = useQuery<{ total: number; average: number; days: DailyPoints[] }>({ queryKey: ["planner", "weekly-points"], queryFn: () => getWeeklyPoints() });

  const savePoints = useMutation({
    mutationFn: async (params: { points: number; tasksCompleted: number }) => {
      await saveDailyPoints(params.points, params.tasksCompleted);
      return true;
    },
  });

  return { todayPoints, weeklyPoints, savePoints };
}

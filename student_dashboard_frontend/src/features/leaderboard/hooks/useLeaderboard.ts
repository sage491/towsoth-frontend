import { useQuery } from "@tanstack/react-query";
import { getLeaderboardSummary } from "@/features/leaderboard/services";

export function useLeaderboardSummary() {
  return useQuery({
    queryKey: ["leaderboard", "summary"],
    queryFn: getLeaderboardSummary,
  });
}

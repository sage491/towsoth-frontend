import { mockLeaderboardSummary, type LeaderboardSummary } from "@/mocks/mockLeaderboard";

export async function getLeaderboardSummary(): Promise<LeaderboardSummary> {
  // Future API call
  // return apiRequest<LeaderboardSummary>("/leaderboard/summary");
  return Promise.resolve({
    users: mockLeaderboardSummary.users,
    categories: [...mockLeaderboardSummary.categories],
  });
}

export interface LeaderboardSummary {
  users: number;
  categories: string[];
}

export const mockLeaderboardSummary: LeaderboardSummary = {
  users: 12453,
  categories: ["overall", "physics", "chemistry", "math"],
};

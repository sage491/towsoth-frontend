export interface LeaderboardEntry {
  rank: number;
  name: string;
  rating: number;
  problemsSolved?: number;
  contests?: number;
}

export interface LeaderboardSummary {
  users: number;
  categories: string[];
}

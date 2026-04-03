export interface LeaderboardEntry {
  id: string;
  name: string;
  rank: number;
  score: number;
  percentile?: number;
  isUser?: boolean;
}

export type ProgressStatus =
  | 'on-track'
  | 'slightly-behind'
  | 'behind'
  | 'ahead';

export type BurnoutRisk =
  | 'low'
  | 'medium'
  | 'high';

export interface OverallProgress {
  currentPace: number;
  requiredPace: number;
  status: ProgressStatus;
  burnoutRisk: BurnoutRisk;
  gapPercentage: number;
}

export interface EnhancedLeaderboardEntry extends Partial<Pick<LeaderboardEntry, 'id' | 'score' | 'percentile' | 'isUser'>> {
  name: string;
  rank: number;
  rating: number;
  problemsSolved: number;
  contests: number;
  movement: number;
  country: string;
  city: string;
  avatar: string;
}

export interface EnhancedLeaderboardSection {
  userRank: number;
  userRating: number;
  totalUsers: number;
  percentile: number;
  movement: number;
  problemsSolved: number;
  contestsParticipated: number;
  topRankers: EnhancedLeaderboardEntry[];
  nearbyRivals: EnhancedLeaderboardEntry[];
}

export interface ProfessionalTopPerformerEntry extends Partial<Pick<LeaderboardEntry, 'id'>> {
  name: string;
  rank: number;
  score: number;
  percentile: number;
}

export interface ProfessionalNearbyPeerEntry extends Partial<Pick<LeaderboardEntry, 'id' | 'isUser'>> {
  name: string;
  rank: number;
  score: number;
  delta: number;
}

export interface ProfessionalEfficiencyBenchmark {
  hoursSpent: number;
  scorePerHour: number;
  avgScorePerHour: number;
  percentile: number;
}

export interface ProfessionalLeaderboardSection {
  userRank: number;
  totalUsers: number;
  percentile: number;
  movement: number;
  weeklyChange: number;
  monthlyChange: number;
  bestRank: number;
  topPerformers: ProfessionalTopPerformerEntry[];
  nearbyPeers: ProfessionalNearbyPeerEntry[];
  efficiencyBenchmark: ProfessionalEfficiencyBenchmark;
}
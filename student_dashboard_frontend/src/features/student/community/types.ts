export interface CommunityStudyCircle {
  id: string;
  name: string;
  exam: string;
  subject: string;
  phase: string;
  memberCount: number;
  avgStudyHours: number;
  currentFocus: string[];
  lastActive: string;
  isJoined: boolean;
}

export interface CommunityStrategyPost {
  id: string;
  title: string;
  author: string;
  improvement: string;
  readTime: string;
  topics: string[];
  verified: boolean;
}

export interface CommunityDoubt {
  id: string;
  question: string;
  subject: string;
  similarDoubts: number;
  status: 'pending' | 'answered';
  answers: number;
}

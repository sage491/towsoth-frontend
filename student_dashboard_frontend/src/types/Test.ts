export type TestType = "recursive" | "mock" | "chapter";

export interface TestResultData {
  name: string;
  date: string;
  score: number;
  percentile: number;
  trend: "up" | "down";
  improvement: string;
  type: TestType;
  chapter?: string;
  attemptNumber?: number;
}

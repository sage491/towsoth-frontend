import { mockLearningHubData, type LearningHubData } from "@/mocks/mockLearningHub";

export type { LearningHubData };

export async function getLearningHubData(): Promise<LearningHubData> {
  // Future API call
  // return apiRequest<LearningHubData>("/learning-hub");
  return Promise.resolve({
    ...mockLearningHubData,
    continueLearning: mockLearningHubData.continueLearning.map((item) => ({ ...item })),
    recommendedForYou: mockLearningHubData.recommendedForYou.map((item) => ({ ...item })),
    revisionBoost: mockLearningHubData.revisionBoost.map((item) => ({ ...item })),
    practiceNow: mockLearningHubData.practiceNow.map((item) => ({ ...item })),
    quickResources: mockLearningHubData.quickResources.map((item) => ({ ...item })),
  });
}

import type { TestResultData } from "@/types/Test";
import type { TestResults } from "@/features/subjects/components";
import { mockCompletedTests, mockRecentTestResults, mockUpcomingTests, type CompletedTestItem, type UpcomingTestItem } from "@/mocks/mockTests";

export type { CompletedTestItem, UpcomingTestItem };

export async function getRecentTestResults(): Promise<TestResultData[]> {
  // Future API call
  // return apiRequest<TestResultData[]>("/tests/recent");
  return Promise.resolve(mockRecentTestResults.map((result) => ({ ...result })));
}

export async function getUpcomingTests(): Promise<UpcomingTestItem[]> {
  // Future API call
  // return apiRequest<UpcomingTestItem[]>("/tests/upcoming");
  return Promise.resolve(mockUpcomingTests.map((test) => ({ ...test })));
}

export async function getCompletedTests(): Promise<CompletedTestItem[]> {
  // Future API call
  // return apiRequest<CompletedTestItem[]>("/tests/completed");
  return Promise.resolve(
    mockCompletedTests.map((test) => ({
      ...test,
      topicBreakdown: test.topicBreakdown.map((item) => ({ ...item })),
      weakConcepts: [...test.weakConcepts],
      aiFixPlan: test.aiFixPlan.map((item) => ({ ...item })),
    }))
  );
}

export function buildMockTestResults(result: TestResultData): TestResults {
  const mockQuestions = [
    { id: "1", number: 1, text: "Question about Electromagnetic Induction", options: ["A", "B", "C", "D"], correctAnswer: 0, topic: "Electromagnetic Induction", difficulty: "Easy" as const, explanation: "Explanation" },
    { id: "2", number: 2, text: "Question about Rotational Dynamics", options: ["A", "B", "C", "D"], correctAnswer: 2, topic: "Rotational Dynamics", difficulty: "Medium" as const, explanation: "Explanation" },
    { id: "3", number: 3, text: "Question about Electromagnetic Induction", options: ["A", "B", "C", "D"], correctAnswer: 3, topic: "Electromagnetic Induction", difficulty: "Hard" as const, explanation: "Explanation" },
    { id: "4", number: 4, text: "Question about Optics", options: ["A", "B", "C", "D"], correctAnswer: 0, topic: "Optics", difficulty: "Easy" as const, explanation: "Explanation" },
    { id: "5", number: 5, text: "Question about Thermodynamics", options: ["A", "B", "C", "D"], correctAnswer: 2, topic: "Thermodynamics", difficulty: "Medium" as const, explanation: "Explanation" },
    { id: "6", number: 6, text: "Question about Rotational Dynamics", options: ["A", "B", "C", "D"], correctAnswer: 1, topic: "Rotational Dynamics", difficulty: "Hard" as const, explanation: "Explanation" },
    { id: "7", number: 7, text: "Question about Waves", options: ["A", "B", "C", "D"], correctAnswer: 1, topic: "Waves", difficulty: "Easy" as const, explanation: "Explanation" },
    { id: "8", number: 8, text: "Question about Electrostatics", options: ["A", "B", "C", "D"], correctAnswer: 0, topic: "Electrostatics", difficulty: "Medium" as const, explanation: "Explanation" },
    { id: "9", number: 9, text: "Question about Optics", options: ["A", "B", "C", "D"], correctAnswer: 0, topic: "Optics", difficulty: "Hard" as const, explanation: "Explanation" },
    { id: "10", number: 10, text: "Question about Modern Physics", options: ["A", "B", "C", "D"], correctAnswer: 3, topic: "Modern Physics", difficulty: "Easy" as const, explanation: "Explanation" },
  ];

  const correctCount = Math.round((result.score / 100) * 10);
  const mockAnswers = mockQuestions.map((question, index) => ({
    questionId: question.id,
    selectedAnswer: index < correctCount ? question.correctAnswer : (question.correctAnswer + 1) % 4,
    isBookmarked: false,
    timeSpent: 180,
  }));

  return {
    subject: result.name.includes("Physics") ? "Physics" : result.name.includes("Chemistry") ? "Chemistry" : "Math",
    topic: result.chapter || "Mixed Topics",
    testName: result.name,
    totalQuestions: 10,
    attempted: 10,
    correct: correctCount,
    incorrect: 10 - correctCount,
    skipped: 0,
    score: correctCount * 10,
    percentage: result.score,
    timeTaken: 1800,
    answers: mockAnswers,
    questions: mockQuestions,
    difficulty: "Medium",
  };
}

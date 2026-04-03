import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EnterpriseTestWindow, TestAnalyticsPage, type TestResults } from '@/features/subjects/components';
import { ROUTES } from '@/shared/config/routes';

function getParam(searchParams: URLSearchParams, key: string, fallback: string) {
  const value = searchParams.get(key);
  return value && value.trim().length > 0 ? value : fallback;
}

export function TestWindowPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  const subject = getParam(searchParams, 'subject', 'Physics');
  const topic = getParam(searchParams, 'topic', 'Practice Test');

  const returnTo = useMemo(() => {
    const candidate = searchParams.get('returnTo');

    if (!candidate || !candidate.startsWith('/student/')) {
      return ROUTES.student['tests-guidelines'];
    }

    return candidate;
  }, [searchParams]);

  if (testResults) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-[1600px] mx-auto">
          <TestAnalyticsPage
            results={testResults}
            onBack={() => {
              setTestResults(null);
              navigate(returnTo);
            }}
            onRetakeTest={() => {
              setTestResults(null);
            }}
            onReviewAnswers={() => {
            }}
            onStartPractice={() => {
              setTestResults(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <EnterpriseTestWindow
      subject={subject}
      topic={topic}
      onBack={() => navigate(returnTo)}
      onSubmit={(results) => setTestResults(results)}
    />
  );
}

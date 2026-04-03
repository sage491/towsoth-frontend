import { Suspense, lazy, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { PreferencesProvider } from "./contexts/PreferencesContext";
import { MotivationToneProvider } from "./contexts/MotivationToneContext";
import { getPathFromPage } from "./routes/pageRoutes";
import { StudentLayout } from "./layouts/StudentLayout";
import { PageWrapper } from "./layouts/PageWrapper";
import { ROUTES, STUDENT_ROUTE_SEGMENTS } from "./shared/config/routes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { RoutePath } from "./shared/config/routes";
import { LoginScreen } from "./components/auth/LoginScreen";
import { AppRole, AuthSession, getStoredSession, setStoredSession } from "./auth/auth";

const APP_ROLE: AppRole = 'STUDENT';
const APP_TITLE = 'Student Command Dashboard';

const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const MySubjectsWorkspace = lazy(() => import("@/features/subjects/MySubjectsWorkspace").then((module) => ({ default: module.MySubjectsWorkspace })));
const TestsGuidelinesWorkspace = lazy(() => import("@/features/tests/TestsGuidelinesWorkspace").then((module) => ({ default: module.TestsGuidelinesWorkspace })));
const PlanJourneyWorkspace = lazy(() => import("@/features/dashboard/PlanJourneyWorkspace").then((module) => ({ default: module.PlanJourneyWorkspace })));
const TowsothGlobalWorkspace = lazy(() => import("@/features/leaderboard/TowsothGlobalWorkspace").then((module) => ({ default: module.TowsothGlobalWorkspace })));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage").then((module) => ({ default: module.SettingsPage })));
const AnalyticsPage = lazy(() => import("@/features/analytics/AnalyticsPage").then((module) => ({ default: module.AnalyticsPage })));
const LeaderboardPage = lazy(() => import("@/features/leaderboard/LeaderboardPage").then((module) => ({ default: module.LeaderboardPage })));
const LearningHubPage = lazy(() => import("@/features/learning/LearningHubPage").then((module) => ({ default: module.LearningHubPage })));
const RevisionPlanPage = lazy(() => import("@/features/revision/RevisionPlanPage").then((module) => ({ default: module.RevisionPlanPage })));
const TestWindowPage = lazy(() => import("@/features/tests/TestWindowPage").then((module) => ({ default: module.TestWindowPage })));

function AppContent() {
  const [, setMySubjectsCourseSelected] = useState(false);
  const navigate = useNavigate();
  const suspenseFallback = <div>Loading...</div>;

  const handleNavigate = (page: RoutePath) => {
    navigate(getPathFromPage(page));
  };

  return (
    <Routes>
      <Route
        path={ROUTES.root}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student.dashboard} replace />
          </Suspense>
        )}
      />

      <Route
        path={ROUTES.studentWildcard}
        element={(
          <Suspense fallback={suspenseFallback}>
            <ErrorBoundary>
              <StudentLayout />
            </ErrorBoundary>
          </Suspense>
        )}
      >
        <Route
          index
          element={(
            <Suspense fallback={suspenseFallback}>
              <Navigate to={STUDENT_ROUTE_SEGMENTS.dashboard} replace />
            </Suspense>
          )}
        />

        {/* Dashboard - Smart Launcher */}
        <Route
          path={STUDENT_ROUTE_SEGMENTS.dashboard}
          element={
            <Suspense fallback={suspenseFallback}>
              <div className="p-4 md:p-6">
                <PageWrapper className="px-0 pb-0">
                  <DashboardPage onNavigate={handleNavigate} />
                </PageWrapper>
              </div>
            </Suspense>
          }
        />

        {/* Settings - Global Page */}
        <Route
          path={STUDENT_ROUTE_SEGMENTS.settings}
          element={(
            <Suspense fallback={suspenseFallback}>
              <PageWrapper className="px-0 pb-0">
                <SettingsPage />
              </PageWrapper>
            </Suspense>
          )}
        />

        {/* Analytics - Global Page */}
        <Route
          path={STUDENT_ROUTE_SEGMENTS.analytics}
          element={(
            <Suspense fallback={suspenseFallback}>
              <PageWrapper className="px-0 pb-0">
                <AnalyticsPage onNavigate={handleNavigate} />
              </PageWrapper>
            </Suspense>
          )}
        />

        {/* Leaderboard - Global Page */}
        <Route
          path={STUDENT_ROUTE_SEGMENTS.leaderboard}
          element={(
            <Suspense fallback={suspenseFallback}>
              <PageWrapper className="px-0 pb-0">
                <LeaderboardPage />
              </PageWrapper>
            </Suspense>
          )}
        />

        {/* Learning Hub - Global Page */}
        <Route
          path={STUDENT_ROUTE_SEGMENTS["learning-hub"]}
          element={(
            <Suspense fallback={suspenseFallback}>
              <PageWrapper className="px-0 pb-0">
                <LearningHubPage onNavigate={handleNavigate} />
              </PageWrapper>
            </Suspense>
          )}
        />

        {/* Revision Plan - Global Page */}
        <Route
          path={STUDENT_ROUTE_SEGMENTS["revision-plan"]}
          element={(
            <Suspense fallback={suspenseFallback}>
              <PageWrapper className="px-0 pb-0">
                <RevisionPlanPage onNavigate={handleNavigate} />
              </PageWrapper>
            </Suspense>
          )}
        />

        {/* Workspaces - Full Screen Mini-Applications with Own Sidebars */}
        <Route
          path={STUDENT_ROUTE_SEGMENTS["my-subjects"]}
          element={(
            <Suspense fallback={suspenseFallback}>
              <MySubjectsWorkspace onNavigate={handleNavigate} setCourseSelected={setMySubjectsCourseSelected} />
            </Suspense>
          )}
        />
        <Route
          path={`${STUDENT_ROUTE_SEGMENTS["my-subjects"]}/:subjectSlug`}
          element={(
            <Suspense fallback={suspenseFallback}>
              <MySubjectsWorkspace onNavigate={handleNavigate} setCourseSelected={setMySubjectsCourseSelected} />
            </Suspense>
          )}
        />
        <Route
          path={`${STUDENT_ROUTE_SEGMENTS["my-subjects"]}/:subjectSlug/:topicSlug`}
          element={(
            <Suspense fallback={suspenseFallback}>
              <MySubjectsWorkspace onNavigate={handleNavigate} setCourseSelected={setMySubjectsCourseSelected} />
            </Suspense>
          )}
        />
        <Route
          path={`${STUDENT_ROUTE_SEGMENTS["my-subjects"]}/:subjectSlug/:topicSlug/:subtopicSlug`}
          element={(
            <Suspense fallback={suspenseFallback}>
              <MySubjectsWorkspace onNavigate={handleNavigate} setCourseSelected={setMySubjectsCourseSelected} />
            </Suspense>
          )}
        />
        <Route
          path={STUDENT_ROUTE_SEGMENTS["tests-guidelines"]}
          element={(
            <Suspense fallback={suspenseFallback}>
              <Navigate to={`${ROUTES.student["tests-guidelines"]}/upcoming`} replace />
            </Suspense>
          )}
        />
        <Route
          path={`${STUDENT_ROUTE_SEGMENTS["tests-guidelines"]}/:section`}
          element={(
            <Suspense fallback={suspenseFallback}>
              <TestsGuidelinesWorkspace onNavigate={handleNavigate} />
            </Suspense>
          )}
        />
        <Route
          path={STUDENT_ROUTE_SEGMENTS["test-window"]}
          element={(
            <Suspense fallback={suspenseFallback}>
              <TestWindowPage />
            </Suspense>
          )}
        />
        <Route
          path={STUDENT_ROUTE_SEGMENTS["plan-journey"]}
          element={(
            <Suspense fallback={suspenseFallback}>
              <Navigate to={`${ROUTES.student["plan-journey"]}/tasks`} replace />
            </Suspense>
          )}
        />
        <Route
          path={`${STUDENT_ROUTE_SEGMENTS["plan-journey"]}/:section`}
          element={(
            <Suspense fallback={suspenseFallback}>
              <PlanJourneyWorkspace onNavigate={handleNavigate} />
            </Suspense>
          )}
        />
        <Route
          path={STUDENT_ROUTE_SEGMENTS["towsoth-global"]}
          element={(
            <Suspense fallback={suspenseFallback}>
              <Navigate to={`${ROUTES.student["towsoth-global"]}/challenges`} replace />
            </Suspense>
          )}
        />
        <Route
          path={`${STUDENT_ROUTE_SEGMENTS["towsoth-global"]}/:section`}
          element={(
            <Suspense fallback={suspenseFallback}>
              <TowsothGlobalWorkspace onNavigate={handleNavigate} />
            </Suspense>
          )}
        />
      </Route>

      <Route
        path={ROUTES.legacy.dashboard}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student.dashboard} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy.settings}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student.settings} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy.analytics}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student.analytics} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy.leaderboard}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student.leaderboard} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy["learning-hub"]}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student["learning-hub"]} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy["revision-plan"]}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student["revision-plan"]} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy["my-subjects"]}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student["my-subjects"]} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy["tests-guidelines"]}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={`${ROUTES.student["tests-guidelines"]}/upcoming`} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy["test-window"]}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student["test-window"]} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy["plan-journey"]}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={`${ROUTES.student["plan-journey"]}/tasks`} replace />
          </Suspense>
        )}
      />
      <Route
        path={ROUTES.legacy["towsoth-global"]}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={`${ROUTES.student["towsoth-global"]}/challenges`} replace />
          </Suspense>
        )}
      />

      <Route
        path={ROUTES.wildcard}
        element={(
          <Suspense fallback={suspenseFallback}>
            <Navigate to={ROUTES.student.dashboard} replace />
          </Suspense>
        )}
      />
    </Routes>
  );
}

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const storedSession = getStoredSession();
    return storedSession && storedSession.role === APP_ROLE ? storedSession : null;
  });

  if (!session) {
    return (
      <LoginScreen
        appTitle={APP_TITLE}
        appRole={APP_ROLE}
        onAuthenticated={(authenticatedSession) => {
          setStoredSession(authenticatedSession);
          setSession(authenticatedSession);
        }}
      />
    );
  }

  return (
    <PreferencesProvider>
      <MotivationToneProvider>
        <AppContent />
      </MotivationToneProvider>
    </PreferencesProvider>
  );
}
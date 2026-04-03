export const STUDENT_ROUTE_SEGMENTS = {
  dashboard: "dashboard",
  settings: "settings",
  analytics: "analytics",
  leaderboard: "leaderboard",
  "learning-hub": "learning-hub",
  "revision-plan": "revision-plan",
  "my-subjects": "my-subjects",
  "tests-guidelines": "tests-guidelines",
  "test-window": "test-window",
  "plan-journey": "plan-journey",
  "towsoth-global": "towsoth-global",
} as const;

export const ROUTES = {
  root: "/",
  wildcard: "*",
  studentBase: "/student",
  studentWildcard: "/student/*",
  student: {
    dashboard: "/student/dashboard",
    settings: "/student/settings",
    analytics: "/student/analytics",
    leaderboard: "/student/leaderboard",
    "learning-hub": "/student/learning-hub",
    "revision-plan": "/student/revision-plan",
    "my-subjects": "/student/my-subjects",
    "tests-guidelines": "/student/tests-guidelines",
    "test-window": "/student/test-window",
    "plan-journey": "/student/plan-journey",
    "towsoth-global": "/student/towsoth-global",
  },
  legacy: {
    dashboard: "/dashboard",
    settings: "/settings",
    analytics: "/analytics",
    leaderboard: "/leaderboard",
    "learning-hub": "/learning-hub",
    "revision-plan": "/revision-plan",
    "my-subjects": "/my-subjects",
    "tests-guidelines": "/tests-guidelines",
    "test-window": "/test-window",
    "plan-journey": "/plan-journey",
    "towsoth-global": "/towsoth-global",
  },
} as const;

export type RoutePath = (typeof STUDENT_ROUTE_SEGMENTS)[keyof typeof STUDENT_ROUTE_SEGMENTS];

export type NavigateToRoute = (page: RoutePath) => void;

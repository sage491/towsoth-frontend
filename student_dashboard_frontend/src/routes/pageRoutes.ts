import { ROUTES, type RoutePath } from "../shared/config/routes";

export const pagePathMap: Record<RoutePath, string> = {
  dashboard: ROUTES.student.dashboard,
  settings: ROUTES.student.settings,
  analytics: ROUTES.student.analytics,
  leaderboard: ROUTES.student.leaderboard,
  "learning-hub": ROUTES.student["learning-hub"],
  "revision-plan": ROUTES.student["revision-plan"],
  "my-subjects": ROUTES.student["my-subjects"],
  "tests-guidelines": ROUTES.student["tests-guidelines"],
  "test-window": ROUTES.student["test-window"],
  "plan-journey": ROUTES.student["plan-journey"],
  "towsoth-global": ROUTES.student["towsoth-global"],
};

export function getPathFromPage(page: RoutePath) {
  return pagePathMap[page] || pagePathMap.dashboard;
}

export function getPageFromPath(pathname: string): RoutePath {
  const routePaths = Object.keys(pagePathMap) as RoutePath[];
  const matchedPage = routePaths.find((page) => {
    const pagePath = pagePathMap[page];
    return pathname === pagePath || pathname.startsWith(`${pagePath}/`);
  });

  if (!matchedPage) {
    const legacyPathMap: Record<string, RoutePath> = {
      [ROUTES.legacy.dashboard]: "dashboard",
      [ROUTES.legacy.settings]: "settings",
      [ROUTES.legacy.analytics]: "analytics",
      [ROUTES.legacy.leaderboard]: "leaderboard",
      [ROUTES.legacy["learning-hub"]]: "learning-hub",
      [ROUTES.legacy["revision-plan"]]: "revision-plan",
      [ROUTES.legacy["my-subjects"]]: "my-subjects",
      [ROUTES.legacy["tests-guidelines"]]: "tests-guidelines",
      [ROUTES.legacy["test-window"]]: "test-window",
      [ROUTES.legacy["plan-journey"]]: "plan-journey",
      [ROUTES.legacy["towsoth-global"]]: "towsoth-global",
    };

    return legacyPathMap[pathname] || "dashboard";
  }

  return matchedPage;
}

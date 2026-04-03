import { Header } from "../shared/components/Header";
import { Sidebar } from "../shared/components/Sidebar";
import { FocusModeIndicator } from "../shared/components/FocusModeIndicator";
import { navigationConfig } from "../config/navigationConfig";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getPageFromPath, getPathFromPage } from "../routes/pageRoutes";
import { usePreferences } from "../contexts/PreferencesContext";
import { useThemeBootstrap } from "../hooks/useThemeBootstrap";
import { useThemeSync } from "../hooks/useThemeSync";
import type { RoutePath } from "../shared/config/routes";

export function StudentLayout() {
  useThemeBootstrap();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  const currentPage = getPageFromPath(location.pathname);

  useThemeSync(preferences.theme);

  const handleNavigate = (page: RoutePath) => {
    navigate(getPathFromPage(page));
  };

  const workspacePages: RoutePath[] = [
    "tests-guidelines",
    "plan-journey",
    "towsoth-global",
  ];
  const isWorkspace = workspacePages.includes(currentPage);

  const showGlobalSidebar = !isWorkspace;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-secondary)' }}>
      {/* Global Header - Always visible */}
      <Header onNavigate={handleNavigate} onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Focus Mode Indicator */}
      <FocusModeIndicator />

      <div className="pt-[64px] lg:flex">
        {/* Global Sidebar - Only for Dashboard and Settings */}
        {showGlobalSidebar && (
          <div
            className={`transition-all duration-300 w-0 flex-shrink-0 ${
              sidebarCollapsed ? 'lg:w-[60px]' : 'lg:w-[260px]'
            }`}
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              mobileOpen={mobileSidebarOpen}
              onMobileClose={() => setMobileSidebarOpen(false)}
              navigationItems={navigationConfig.student}
            />
          </div>
        )}

        {/* Main Content Area */}
        <main
          className={`min-w-0 transition-all duration-300 ${
            showGlobalSidebar ? 'flex-1' : ''
          } ${
            showGlobalSidebar
              ? sidebarCollapsed
                ? 'lg:ml-[60px]'
                : 'lg:ml-[260px]'
              : ''
          }`}
        >
          <Outlet context={{
            mobileSidebarOpen,
            closeMobileSidebar: () => setMobileSidebarOpen(false),
          }} />
        </main>
      </div>
    </div>
  );
}

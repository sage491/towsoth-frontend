import { Suspense, useState } from "react";
import { AppProvider } from "./contexts/AppContext";
import { SectionErrorBoundary } from "./components/SectionErrorBoundary";
import { ToastContainer } from "./components/Toast";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { SECTION_COMPONENTS } from "./navigation/sectionComponents";
import type { AppSectionId } from "./types/navigation";
import { LoginScreen } from "./components/auth/LoginScreen";
import { AppRole, AuthSession, getStoredSession, setStoredSession } from "./auth/auth";

const APP_ROLE: AppRole = 'SUPER_ADMIN';
const APP_TITLE = 'Super Admin Dashboard';

const SECTION_LABELS: Record<AppSectionId, string> = {
  dashboard: "Dashboard",
  institutions: "Institutions",
  plans: "Plans",
  roles: "Roles",
  users: "Users",
  "ai-control": "AI Control",
  compliance: "Compliance",
  billing: "Billing",
  security: "Security",
  analytics: "Analytics",
  config: "System Configuration",
  governance: "Governance",
  logs: "System Logs",
  emergency: "Emergency Controls",
};

function AppContent() {
  const [activeSection, setActiveSection] = useState<AppSectionId>("dashboard");
  const ActiveSectionComponent = SECTION_COMPONENTS[activeSection];

  return (
    <div className="size-full flex flex-col bg-[#f5f6f8]">
      {/* Top Bar */}
      <TopBar systemStatus="operational" />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Main Content */}
        <SectionErrorBoundary key={activeSection} sectionName={SECTION_LABELS[activeSection]}>
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center bg-[#f5f6f8]">
                <div className="text-[13px] text-[#6b7280]">Loading section...</div>
              </div>
            }
          >
            <ActiveSectionComponent />
          </Suspense>
        </SectionErrorBoundary>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
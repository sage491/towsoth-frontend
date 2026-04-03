import { useState } from 'react';
import { usePageNavigation } from './hooks/usePageNavigation';
import { AdminLayout } from './components/layout';
import { AppProviders } from './layouts/AppProviders';
import { LoginScreen } from './components/auth/LoginScreen';
import { AppRole, AuthSession, getStoredSession, setStoredSession } from './auth/auth';

const APP_ROLE: AppRole = 'ADMIN';
const APP_TITLE = 'Admin Dashboard';

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const storedSession = getStoredSession();
    return storedSession && storedSession.role === APP_ROLE ? storedSession : null;
  });
  const { activePage, navigateToPage, activePageContent } = usePageNavigation();

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
    <AppProviders>
      <AdminLayout activePage={activePage} onNavigate={navigateToPage}>
        {activePageContent}
      </AdminLayout>
    </AppProviders>
  );
}
import { useEffect, useState } from 'react';
import { TowsothGlobalSidebar } from './sidebars/TowsothGlobalSidebar';
import { CommunityPage } from '../global/CommunityPage';
import { ChallengesPage } from '../global/ChallengesPage';
import { PeerInsightsPage } from '../global/PeerInsightsPage';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import type { RoutePath } from '@/shared/config/routes';
import { ROUTES } from '@/shared/config/routes';

interface WorkspaceLayoutContext {
  mobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

interface TowsothGlobalWorkspaceProps {
  onNavigate: (page: RoutePath) => void;
  focusModeActive?: boolean;
  onExitFocusMode?: () => void;
}

export function TowsothGlobalWorkspace({ onNavigate, focusModeActive = false, onExitFocusMode }: TowsothGlobalWorkspaceProps) {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const sidebarCollapsed = false;
  const [showFocusConfirm, setShowFocusConfirm] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
  const { mobileSidebarOpen, closeMobileSidebar } = useOutletContext<WorkspaceLayoutContext>();
  const allowedSections = ['challenges', 'peer-insights', 'community'] as const;
  const currentSection = allowedSections.includes((section ?? '') as (typeof allowedSections)[number]) ? section! : 'challenges';

  useEffect(() => {
    const handleResize = () => setIsCompactViewport(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBackClick = () => {
    if (focusModeActive) {
      setShowFocusConfirm(true);
    } else {
      exitWorkspace();
    }
  };

  const exitWorkspace = () => {
    setShowFocusConfirm(false);
    if (onExitFocusMode) onExitFocusMode();
    onNavigate('dashboard');
  };

  const handleSidebarSectionChange = (section: string) => {
    navigate(`${ROUTES.student['towsoth-global']}/${section}`);
    if (isCompactViewport) {
      closeMobileSidebar();
    }
  };

  return (
    <div className="fixed inset-0" style={{ background: 'var(--bg-secondary)' }}>
      {/* Focus Mode Confirmation Modal */}
      {showFocusConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="max-w-md p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
            <div className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              You're leaving focus mode
            </div>
            <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
              Return to dashboard?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFocusConfirm(false)}
                className="flex-1 px-4 py-2.5 text-xs font-bold"
                style={{ 
                  background: 'var(--accent-primary)',
                  color: '#ffffff'
                }}
              >
                Continue Focus
              </button>
              <button
                onClick={exitWorkspace}
                className="flex-1 px-4 py-2.5 text-xs font-bold"
                style={{ 
                  background: 'transparent',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workspace-Specific Sidebar */}
      {!isCompactViewport && (
        <TowsothGlobalSidebar
          currentSection={currentSection}
          onSectionChange={handleSidebarSectionChange}
          collapsed={sidebarCollapsed}
          onNavigateToDashboard={exitWorkspace}
        />
      )}

      {isCompactViewport && mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 top-[64px]"
            onClick={closeMobileSidebar}
          />
          <TowsothGlobalSidebar
            currentSection={currentSection}
            onSectionChange={handleSidebarSectionChange}
            collapsed={sidebarCollapsed}
            onNavigateToDashboard={exitWorkspace}
          />
        </>
      )}

      {/* Workspace Content Area */}
      <div
        className="absolute top-0 right-0 bottom-0 overflow-y-auto"
        style={{
          left: isCompactViewport ? '0px' : (sidebarCollapsed ? '60px' : '280px'),
          transition: 'left 300ms',
          background: 'var(--bg-secondary)'
        }}
      >
        {/* Workspace Header with Back Button */}
        <div className={`${isCompactViewport ? 'sticky top-0 z-30 px-4 pt-4 pb-3' : 'sticky top-0 z-30 px-6 pt-6 pb-3'}`} style={{ background: 'var(--bg-secondary)' }}>
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-xs font-medium hover:opacity-70 transition-opacity mb-4"
            style={{ color: 'var(--accent-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Go to Dashboard</span>
          </button>

        </div>

        {/* Section Content */}
        <div className={`${isCompactViewport ? 'px-4 pb-12' : 'px-6 pb-12'}`}>
          {currentSection === 'community' && (
            <CommunityPage />
          )}
          {currentSection === 'challenges' && (
            <ChallengesPage />
          )}
          {currentSection === 'peer-insights' && (
            <PeerInsightsPage />
          )}
        </div>
      </div>
    </div>
  );
}
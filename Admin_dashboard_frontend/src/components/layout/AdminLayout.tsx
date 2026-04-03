import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { BackgroundWatermark } from '../branding/BackgroundWatermark';
import { FooterBranding } from '../branding/FooterBranding';
import type { PageKey } from '../../types/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AdminLayoutProps extends PropsWithChildren {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
}



export function AdminLayout({ children, activePage, onNavigate }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      {/* NAVBAR - Fixed height, no shrink */}
      <Topbar
        onNavigate={(page) => onNavigate(page as PageKey)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
      />

      {/* MAIN CONTENT AREA - Flex row taking remaining height */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR CONTAINER - Fixed on mobile, relative on lg */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            activePage={activePage}
            onNavigate={onNavigate}
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
            mobileOpen={false}
            onCloseMobile={() => {}}
          />
        </div>

        {/* MOBILE SIDEBAR - Fixed overlay on mobile */}
        {mobileSidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-40 lg:hidden">
              <Sidebar
                activePage={activePage}
                onNavigate={onNavigate}
                collapsed={sidebarCollapsed}
                onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
                mobileOpen={mobileSidebarOpen}
                onCloseMobile={() => setMobileSidebarOpen(false)}
              />
            </div>
          </>
        )}

        {/* MAIN CONTENT - Flex grow with independent scroll */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f3f4f6] relative z-10">
          <BackgroundWatermark position="center" opacity={0.05} />
          
          {/* Scrollable content wrapper */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>

      {/* FOOTER - Fixed height, no shrink, no scroll */}
      <footer className="shrink-0">
        <FooterBranding showCopyright showTagline={false} showLogo />
      </footer>
    </div>
  );
}

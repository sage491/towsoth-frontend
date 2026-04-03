import { Bell, ChevronDown, LogOut, Menu, Settings } from 'lucide-react';
import { useState } from 'react';
import { InstitutionLogo } from '../branding/InstitutionLogo';
import { CommandPalette } from '../navigation/CommandPalette';

interface TopbarProps {
  onNavigate: (page: string) => void;
  onToggleMobileSidebar: () => void;
}

export function Topbar({ onNavigate, onToggleMobileSidebar }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-4 lg:px-6 shrink-0 relative">
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--brand-primary)' }} />

      <div className="flex items-center gap-3 lg:gap-6">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="p-2 -m-2 hover:bg-[#f9fafb] transition-colors lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-[#6b7280]" />
        </button>

        <InstitutionLogo
          size="medium"
          showName={true}
          clickable={true}
          onClick={() => onNavigate('dashboard')}
          variant="header"
        />

        <div className="h-5 w-px bg-[#e5e7eb] hidden md:block" />

        <div className="items-center gap-2 hidden md:flex">
          <span className="text-[11px] text-[#9ca3af]">Academic Session</span>
          <span className="text-[12px] text-[#374151] px-2 py-0.5 bg-[#f9fafb] border border-[#e5e7eb]">2024-2025</span>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <CommandPalette onNavigate={onNavigate} />

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationOpen((prev) => !prev)}
            className="p-2 -m-2 hover:bg-[#f9fafb] transition-colors relative group"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#6b7280] group-hover:text-[#374151] transition-colors" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#dc2626] rounded-full border border-white" />
          </button>

          {notificationOpen ? (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#e5e7eb] shadow-lg z-50">
                <div className="px-4 py-3 border-b border-[#e5e7eb]">
                  <h3 className="text-[13px] text-[#111827]">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-auto">
                  {[
                    { type: 'System', message: 'Data sync completed successfully', time: '5 min ago' },
                    { type: 'Alert', message: 'Pending approval: 3 faculty requests', time: '1 hour ago' },
                    { type: 'Update', message: 'AI insights refresh completed', time: '2 hours ago' },
                  ].map((notification) => (
                    <button
                      key={`${notification.type}-${notification.time}`}
                      type="button"
                      className="w-full px-4 py-3 border-b border-[#f3f4f6] hover:bg-[#f9fafb] text-left transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider">{notification.type}</span>
                          <p className="text-[13px] text-[#111827] mt-0.5">{notification.message}</p>
                        </div>
                        <span className="text-[11px] text-[#9ca3af] whitespace-nowrap">{notification.time}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-[#e5e7eb] bg-[#fafafa]">
                  <button type="button" className="text-[12px] text-[#6b7280] hover:text-[#374151] transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="h-5 w-px bg-[#e5e7eb]" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2.5 py-1 px-2 -mx-2 hover:bg-[#f9fafb] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center">
              <span className="text-white text-[12px]">AR</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[13px] text-[#111827] group-hover:text-[#000000] transition-colors">Admin Raj</p>
              <p className="text-[11px] text-[#6b7280]">Institution Admin</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#9ca3af] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen ? (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#e5e7eb] shadow-lg z-50">
                <div className="py-2">
                  <button type="button" className="w-full px-4 py-2.5 text-left hover:bg-[#f9fafb] flex items-center gap-3 transition-all group">
                    <Settings className="w-4 h-4 text-[#9ca3af] group-hover:text-[var(--brand-primary)] transition-colors" />
                    <span className="text-[13px] font-normal text-[#374151] group-hover:text-[var(--brand-primary)] group-hover:font-semibold transition-all">
                      Admin Settings
                    </span>
                  </button>
                  <button type="button" className="w-full px-4 py-2.5 text-left hover:bg-[#f9fafb] flex items-center gap-3 transition-all group">
                    <Settings className="w-4 h-4 text-[#9ca3af] group-hover:text-[var(--brand-primary)] transition-colors" />
                    <span className="text-[13px] font-normal text-[#374151] group-hover:text-[var(--brand-primary)] group-hover:font-semibold transition-all">
                      Security
                    </span>
                  </button>
                </div>
                <div className="border-t border-[#e5e7eb] py-2">
                  <button type="button" className="w-full px-4 py-2.5 text-left hover:bg-[#f9fafb] flex items-center gap-3 transition-all group">
                    <LogOut className="w-4 h-4 text-[#9ca3af] group-hover:text-[#dc2626] transition-colors" />
                    <span className="text-[13px] font-normal text-[#374151] group-hover:text-[#dc2626] group-hover:font-semibold transition-all">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

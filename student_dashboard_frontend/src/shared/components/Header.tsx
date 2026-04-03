import { Search, Bell, LogOut, Settings as SettingsIcon, Eye, Unlock, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ProgressUnlocks } from '@/features/dashboard/components';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import type { RoutePath } from '../config/routes';

interface HeaderProps {
  onNavigate?: (page: RoutePath) => void;
  onMenuToggle?: () => void;
}

export function Header({ onNavigate, onMenuToggle }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUnlocks, setShowUnlocks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const unlocksRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Close unlocks panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (unlocksRef.current && !unlocksRef.current.contains(event.target as Node)) {
        setShowUnlocks(false);
      }
    };

    if (showUnlocks) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUnlocks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search functionality - would filter across all content
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-[64px] fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-full px-3 md:px-6">
        {/* Left: Menu Toggle (Mobile) + Logo */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 md:w-[200px]">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-slate-50 transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-slate-900 font-semibold text-sm leading-tight">Towsoth Edu</div>
              <div className="text-[10px] text-slate-500 leading-tight">Coaching Institute</div>
            </div>
          </div>
        </div>

        {/* Center: Search - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-[500px] mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests, topics, resources..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </form>
        </div>

        {/* Right: Status + Profile */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* Theme Switcher */}
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>

          {/* Alerts */}
          <button 
            className="relative p-2 hover:bg-slate-50 transition-colors"
            title="Important notifications only"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* Profile - Simplified on mobile */}
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 pl-2 md:pl-4 md:border-l border-slate-200 hover:bg-slate-50 px-2 py-1 transition-colors"
            >
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-slate-900">Arjun Sharma</div>
                <div className="text-[10px] text-slate-500">JEE Advanced 2026</div>
              </div>
              <div className="w-9 h-9 bg-slate-800 flex items-center justify-center text-white text-xs font-semibold">
                AS
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 shadow-lg z-50">
                <button
                  onClick={() => {
                    onNavigate?.('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>Preferences</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <Eye className="w-4 h-4" />
                  <span>Focus Mode</span>
                </button>
                <button
                  onClick={() => {
                    // Logout functionality
                    console.log('Logging out...');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Progress Unlocks - Hidden on small mobile */}
          <div className="relative hidden sm:block" ref={unlocksRef}>
            <button
              onClick={() => setShowUnlocks(!showUnlocks)}
              className="p-2 hover:bg-slate-50 transition-colors"
              title="My Progress Unlocks"
            >
              <Unlock className="w-5 h-5 text-slate-600" />
            </button>

            {/* Unlocks Panel */}
            {showUnlocks && (
              <ProgressUnlocks onClose={() => setShowUnlocks(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
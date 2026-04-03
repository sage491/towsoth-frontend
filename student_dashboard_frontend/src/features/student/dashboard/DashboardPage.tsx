import { ArrowRight, Bell, X, Clock, ChevronLeft, ChevronRight, Settings, BookOpen, ClipboardCheck, Target, Globe2 } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useState, useEffect } from 'react';
import { useDashboardData } from '@/features/dashboard/hooks';
import type { RoutePath } from '@/shared/config/routes';

interface DashboardPageProps {
  onNavigate: (page: RoutePath) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const workspaceIconMap = {
    BookOpen,
    ClipboardCheck,
    Target,
    Globe2,
  };

  const { shouldShowRank, preferences } = usePreferences();
  const [dismissedMessages, setDismissedMessages] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { messages: messagesQuery, workspaces: workspacesQuery } = useDashboardData({
    showRank: shouldShowRank(),
    focusMode: preferences.focusMode,
  });
  const messages = messagesQuery.data ?? [];

  const activeMessages = messages.filter(msg => !dismissedMessages.includes(msg.id));

  const dismissMessage = (id: number) => {
    setDismissedMessages([...dismissedMessages, id]);
    if (currentSlide >= activeMessages.length - 1) {
      setCurrentSlide(Math.max(0, activeMessages.length - 2));
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeMessages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeMessages.length) % activeMessages.length);
  };

  const workspaces = workspacesQuery.data ?? [];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && activeMessages.length > 1) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, activeMessages.length]);

  return (
    <div className="space-y-6">
      <div className="pb-6" style={{ borderBottom: '2px solid var(--border-medium)' }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome, Rohan!
        </h1>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Learning Operating System • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {activeMessages.length > 0 && (
        <div
          className="p-4 relative"
          style={{
            background: 'var(--bg-card)',
            border: '2px solid var(--border-medium)'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center gap-2 mb-3 max-sm:flex-wrap">
            <Bell className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
            <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
              Important Messages
            </h3>
            <div className="ml-auto flex items-center gap-2 max-sm:ml-0 max-sm:w-full max-sm:justify-between">
              <div className="px-2 py-0.5 text-[10px] font-bold" style={{
                background: 'var(--text-primary)',
                color: 'var(--bg-card)'
              }}>
                {currentSlide + 1} / {activeMessages.length}
              </div>
              <button
                onClick={() => onNavigate('plan-journey')}
                className="px-2 py-1 text-[9px] font-bold uppercase tracking-wide transition-all flex items-center gap-1"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-soft)',
                  color: 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--border-medium)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                title="Manage messages in Daily Tasks"
              >
                <Settings className="w-3 h-3" />
                MANAGE
              </button>
            </div>
          </div>

          <div className="relative">
            {activeMessages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 transition-opacity hover:opacity-70 z-10 max-md:left-2 max-md:-translate-x-0"
                  style={{ color: 'var(--text-primary)' }}
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 transition-opacity hover:opacity-70 z-10 max-md:right-2 max-md:translate-x-0"
                  style={{ color: 'var(--text-primary)' }}
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="overflow-hidden">
              <div
                className="transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)`, display: 'flex' }}
              >
                {activeMessages.map((message) => (
                  <div
                    key={message.id}
                    className="w-full flex-shrink-0"
                  >
                    <div
                      className="p-3 relative group"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-soft)'
                      }}
                    >
                      <button
                        onClick={() => dismissMessage(message.id)}
                        className="absolute top-2 right-2 p-1 transition-all opacity-0 group-hover:opacity-100"
                        style={{
                          color: 'var(--text-tertiary)'
                        }}
                        title="Dismiss"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--border-medium)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-tertiary)';
                        }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="pr-6 max-md:pr-8">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {message.title}
                          </h4>
                          {message.type === 'deadline' && (
                            <div className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide" style={{
                              background: 'var(--text-primary)',
                              color: 'var(--bg-card)'
                            }}>
                              URGENT
                            </div>
                          )}
                        </div>
                        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {message.description}
                        </p>
                        {message.time && (
                          <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{message.time}</span>
                          </div>
                        )}
                        <button
                          onClick={() => onNavigate(message.page)}
                          className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all"
                          style={{
                            background: 'var(--text-primary)',
                            color: 'var(--bg-card)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.85';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          {message.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {activeMessages.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-3">
                {activeMessages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: index === currentSlide ? 'var(--text-primary)' : 'var(--border-medium)',
                      opacity: index === currentSlide ? 1 : 0.5
                    }}
                    title={`Go to message ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
        {workspaces.map((workspace) => {
          const Icon = workspaceIconMap[workspace.icon as keyof typeof workspaceIconMap];
          const isLocked = workspace.locked;

          return (
            <button
              key={workspace.id}
              onClick={() => !isLocked && onNavigate(workspace.id)}
              disabled={isLocked}
              className={`group relative p-6 text-left transition-all ${
                isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{
                background: 'var(--bg-card)',
                border: isLocked ? '1px solid var(--border-soft)' : '2px solid var(--border-medium)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5" style={{ background: 'var(--bg-secondary)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                </div>
                <ArrowRight
                  className={`w-4 h-4 ${!isLocked && 'group-hover:translate-x-1 transition-transform'}`}
                  style={{ color: 'var(--accent-primary)' }}
                />
              </div>

              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {workspace.title}
              </h3>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-tertiary)' }}>
                {workspace.subtitle}
              </div>

              <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3 max-md:gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                {workspace.stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  Next Action
                </div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {workspace.nextAction}
                </div>
              </div>

              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)' }}>
                  <div className="px-3 py-1.5 text-[10px] font-bold" style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-secondary)'
                  }}>
                    Locked in Focus Mode
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

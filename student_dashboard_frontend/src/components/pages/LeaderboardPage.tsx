import { EnhancedLeaderboard } from '@/features/analytics/components';

export function LeaderboardPage() {
  return (
    <div className="p-6 max-md:p-4 min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1400px] mx-auto">
        <EnhancedLeaderboard />
      </div>
    </div>
  );
}

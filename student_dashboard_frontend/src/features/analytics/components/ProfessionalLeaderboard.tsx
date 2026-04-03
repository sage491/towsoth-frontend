import { useState } from 'react';
import { Trophy, Users, BarChart3, Shield, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import type { ProfessionalLeaderboardSection } from './types';

export function ProfessionalLeaderboard() {
  const { updatePreference, shouldShowRank } = usePreferences();
  const [activeTab, setActiveTab] = useState<'overall' | 'physics' | 'chemistry' | 'math'>('overall');
  const [showOptIn, setShowOptIn] = useState(!shouldShowRank());

  const handleOptIn = (enable: boolean) => {
    updatePreference('focusMode', !enable);
    setShowOptIn(false);
  };

  // Leaderboard data
  const leaderboardData: Record<'overall' | 'physics' | 'chemistry' | 'math', ProfessionalLeaderboardSection> = {
    overall: {
      userRank: 847,
      totalUsers: 12453,
      percentile: 93.2,
      movement: -12,
      weeklyChange: 8,
      monthlyChange: 34,
      bestRank: 128,
      topPerformers: [
        { rank: 1, name: 'Aditya Kumar', score: 2847, percentile: 99.9 },
        { rank: 2, name: 'Meera Shah', score: 2792, percentile: 99.7 },
        { rank: 3, name: 'Rohan Patel', score: 2756, percentile: 99.5 },
      ],
      nearbyPeers: [
        { rank: 841, name: 'Priya S.', score: 1847, delta: 5 },
        { rank: 842, name: 'Aditya K.', score: 1845, delta: -2 },
        { rank: 843, name: 'Rahul M.', score: 1843, delta: 0 },
        { rank: 844, name: 'Sneha T.', score: 1841, delta: 3 },
        { rank: 845, name: 'Arjun P.', score: 1840, delta: -1 },
        { rank: 846, name: 'Kavya L.', score: 1839, delta: 1 },
        { rank: 847, name: 'You', score: 1830, delta: 0, isUser: true },
        { rank: 848, name: 'Rohan G.', score: 1825, delta: -4 },
        { rank: 849, name: 'Ananya D.', score: 1822, delta: 2 },
        { rank: 850, name: 'Karthik V.', score: 1820, delta: -1 },
      ],
      efficiencyBenchmark: {
        hoursSpent: 156,
        scorePerHour: 11.8,
        avgScorePerHour: 9.2,
        percentile: 78,
      }
    },
    physics: {
      userRank: 723,
      totalUsers: 12453,
      percentile: 94.2,
      movement: 5,
      weeklyChange: 12,
      monthlyChange: 28,
      bestRank: 698,
      topPerformers: [
        { rank: 1, name: 'Vikram Joshi', score: 975, percentile: 99.9 },
        { rank: 2, name: 'Ishita Nair', score: 968, percentile: 99.8 },
        { rank: 3, name: 'Siddharth M.', score: 962, percentile: 99.6 },
      ],
      nearbyPeers: [
        { rank: 718, name: 'Nikhil P.', score: 945, delta: 3 },
        { rank: 719, name: 'Divya K.', score: 943, delta: -1 },
        { rank: 720, name: 'Tanvi S.', score: 942, delta: 2 },
        { rank: 721, name: 'Aarav B.', score: 940, delta: 0 },
        { rank: 722, name: 'Riya W.', score: 939, delta: 1 },
        { rank: 723, name: 'You', score: 938, delta: 0, isUser: true },
        { rank: 724, name: 'Harsh T.', score: 937, delta: -2 },
        { rank: 725, name: 'Neha Y.', score: 936, delta: 1 },
      ],
      efficiencyBenchmark: {
        hoursSpent: 52,
        scorePerHour: 18.0,
        avgScorePerHour: 15.2,
        percentile: 82,
      }
    },
    chemistry: {
      userRank: 892,
      totalUsers: 12453,
      percentile: 92.8,
      movement: -8,
      weeklyChange: -4,
      monthlyChange: 18,
      bestRank: 856,
      topPerformers: [
        { rank: 1, name: 'Pooja Hari', score: 912, percentile: 99.9 },
        { rank: 2, name: 'Varun Kumar', score: 908, percentile: 99.7 },
        { rank: 3, name: 'Sakshi M.', score: 902, percentile: 99.5 },
      ],
      nearbyPeers: [
        { rank: 887, name: 'Kunal D.', score: 876, delta: 2 },
        { rank: 888, name: 'Anjali R.', score: 875, delta: -1 },
        { rank: 889, name: 'Manish G.', score: 874, delta: 0 },
        { rank: 890, name: 'Shreya P.', score: 873, delta: 3 },
        { rank: 891, name: 'Aakash V.', score: 872, delta: 1 },
        { rank: 892, name: 'You', score: 871, delta: 0, isUser: true },
        { rank: 893, name: 'Kritika S.', score: 870, delta: -2 },
        { rank: 894, name: 'Yash B.', score: 869, delta: 1 },
      ],
      efficiencyBenchmark: {
        hoursSpent: 48,
        scorePerHour: 18.1,
        avgScorePerHour: 16.8,
        percentile: 68,
      }
    },
    math: {
      userRank: 945,
      totalUsers: 12453,
      percentile: 92.4,
      movement: 2,
      weeklyChange: 6,
      monthlyChange: 22,
      bestRank: 912,
      topPerformers: [
        { rank: 1, name: 'Deepak Lalwani', score: 856, percentile: 99.9 },
        { rank: 2, name: 'Simran Kaur', score: 851, percentile: 99.8 },
        { rank: 3, name: 'Gaurav Mehta', score: 848, percentile: 99.6 },
      ],
      nearbyPeers: [
        { rank: 940, name: 'Naina P.', score: 812, delta: 1 },
        { rank: 941, name: 'Rohit T.', score: 811, delta: 0 },
        { rank: 942, name: 'Swati D.', score: 810, delta: -1 },
        { rank: 943, name: 'Abhishek N.', score: 809, delta: 2 },
        { rank: 944, name: 'Pallavi J.', score: 808, delta: 1 },
        { rank: 945, name: 'You', score: 807, delta: 0, isUser: true },
        { rank: 946, name: 'Sumit R.', score: 806, delta: -3 },
        { rank: 947, name: 'Isha G.', score: 805, delta: 1 },
      ],
      efficiencyBenchmark: {
        hoursSpent: 56,
        scorePerHour: 14.4,
        avgScorePerHour: 13.1,
        percentile: 72,
      }
    }
  };

  const currentData = leaderboardData[activeTab];

  // Opt-in gate
  if (showOptIn) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Towsoth Global
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Competitive Benchmarking & Exposure
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-8 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
            <Shield className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Enable Benchmarking?</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Rankings are optional. Enable only if you find competitive context helpful.
              <strong> No pressure. No shaming. No forced comparison.</strong>
              <br /><br />
              You can disable this anytime from Settings.
            </p>

            <div className="p-4 mb-6 text-left border-l-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)' }}>
              <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>What you'll see:</div>
              <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <li>• Your rank and percentile (never shared publicly)</li>
                <li>• Peer comparison data (±5 ranks for context)</li>
                <li>• Subject-wise benchmarking</li>
                <li>• Efficiency metrics</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleOptIn(false)}
                className="flex-1 px-6 py-3 text-xs font-bold uppercase tracking-wide border-2 transition-opacity hover:opacity-80"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)', background: 'transparent' }}
              >
                No Thanks
              </button>
              <button
                onClick={() => handleOptIn(true)}
                className="flex-1 px-6 py-3 text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
              >
                Enable Benchmarking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Anonymous preview when opted out
  if (!shouldShowRank()) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Towsoth Global
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Competitive Benchmarking & Exposure
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-8 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
            <Shield className="w-16 h-16 mx-auto mb-4" style={{ color: '#15803D' }} />
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Benchmarking Disabled</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              You're in focus mode. Rankings are hidden to reduce comparison pressure.
              <br /><br />
              To re-enable rankings, go to <strong>Settings</strong>.
            </p>

            <button
              onClick={() => setShowOptIn(true)}
              className="px-6 py-3 text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
            >
              Enable Benchmarking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full leaderboard view
  return (
    <div>
      {/* Header */}
      <div className="mb-6 pb-4 border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Towsoth Global
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Competitive Benchmarking & Exposure
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto whitespace-nowrap">
        <div className="inline-flex min-w-max gap-2">
        {(['overall', 'physics', 'chemistry', 'math'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="shrink-0 whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wide border-2 transition-all"
            style={{
              background: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === tab ? '#ffffff' : 'var(--text-primary)',
              borderColor: activeTab === tab ? 'var(--accent-primary)' : 'var(--border-soft)',
            }}
          >
            {tab === 'overall' ? 'Overall' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        </div>
      </div>

      {/* Top 3 - Formal Leader Strip */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Top Performers
        </div>
        <div className="border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs" style={{ borderColor: 'var(--border-soft)', color: 'var(--text-tertiary)' }}>
                <th className="text-left p-3 font-bold uppercase tracking-wide">Rank</th>
                <th className="text-left p-3 font-bold uppercase tracking-wide">Name</th>
                <th className="text-right p-3 font-bold uppercase tracking-wide">Score</th>
                <th className="text-right p-3 font-bold uppercase tracking-wide">Percentile</th>
              </tr>
            </thead>
            <tbody>
              {currentData.topPerformers.map((performer, idx) => (
                <tr
                  key={performer.rank}
                  className="border-b"
                  style={{
                    borderColor: 'var(--border-soft)',
                    borderLeft: idx === 0 ? '2px solid var(--accent-primary)' : 'none',
                  }}
                >
                  <td className="p-3 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    #{performer.rank}
                  </td>
                  <td className="p-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {performer.name}
                  </td>
                  <td className="p-3 text-sm font-bold text-right" style={{ color: 'var(--text-primary)' }}>
                    {performer.score}
                  </td>
                  <td className="p-3 text-sm text-right" style={{ color: 'var(--text-secondary)' }}>
                    {performer.percentile}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Your Position - Data Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Current Rank
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            #{currentData.userRank.toLocaleString()}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Top {(100 - currentData.percentile).toFixed(1)}%
          </div>
        </div>

        <div className="p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Percentile
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {currentData.percentile}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            of {currentData.totalUsers.toLocaleString()} students
          </div>
        </div>

        <div className="p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Best Rank
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            #{currentData.bestRank}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            All-time high
          </div>
        </div>
      </div>

      {/* Rank Movement - Strategic Insights */}
      <div className="mb-6 p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-tertiary)' }}>
          Rank Movement
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>This week</div>
            <div className="flex items-center gap-2">
              {currentData.weeklyChange > 0 ? (
                <ArrowUp className="w-4 h-4" style={{ color: '#15803D' }} />
              ) : currentData.weeklyChange < 0 ? (
                <ArrowDown className="w-4 h-4" style={{ color: '#B91C1C' }} />
              ) : (
                <Minus className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              )}
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentData.weeklyChange > 0 ? '+' : ''}{currentData.weeklyChange}
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>This month</div>
            <div className="flex items-center gap-2">
              {currentData.monthlyChange > 0 ? (
                <ArrowUp className="w-4 h-4" style={{ color: '#15803D' }} />
              ) : currentData.monthlyChange < 0 ? (
                <ArrowDown className="w-4 h-4" style={{ color: '#B91C1C' }} />
              ) : (
                <Minus className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              )}
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentData.monthlyChange > 0 ? '+' : ''}{currentData.monthlyChange}
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Gap to best</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentData.userRank - currentData.bestRank}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>ranks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nearest Rank Peers */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            Nearest Rank Peers
          </div>
        </div>
        <div className="border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs" style={{ borderColor: 'var(--border-soft)', color: 'var(--text-tertiary)' }}>
                <th className="text-left p-3 font-bold uppercase tracking-wide">Rank</th>
                <th className="text-left p-3 font-bold uppercase tracking-wide">Name</th>
                <th className="text-right p-3 font-bold uppercase tracking-wide">Score</th>
                <th className="text-right p-3 font-bold uppercase tracking-wide">Δ</th>
              </tr>
            </thead>
            <tbody>
              {currentData.nearbyPeers.map((peer) => (
                <tr
                  key={peer.rank}
                  className="border-b"
                  style={{
                    borderColor: 'var(--border-soft)',
                    background: peer.isUser ? 'var(--bg-secondary)' : 'transparent',
                  }}
                >
                  <td className="p-3 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {peer.rank}
                  </td>
                  <td className="p-3 text-sm" style={{ color: 'var(--text-primary)', fontWeight: peer.isUser ? 'bold' : 'normal' }}>
                    {peer.name}
                  </td>
                  <td className="p-3 text-sm text-right" style={{ color: 'var(--text-primary)' }}>
                    {peer.score}
                  </td>
                  <td className="p-3 text-sm text-right">
                    <span className="flex items-center justify-end gap-1">
                      {peer.delta > 0 ? (
                        <>
                          <ArrowUp className="w-3 h-3" style={{ color: '#15803D' }} />
                          <span style={{ color: '#15803D' }}>+{peer.delta}</span>
                        </>
                      ) : peer.delta < 0 ? (
                        <>
                          <ArrowDown className="w-3 h-3" style={{ color: '#B91C1C' }} />
                          <span style={{ color: '#B91C1C' }}>{peer.delta}</span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Efficiency Benchmark */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            Efficiency Benchmark
          </div>
        </div>
        <div className="p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Hours invested</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentData.efficiencyBenchmark.hoursSpent}
              </div>
            </div>
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Score per hour</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentData.efficiencyBenchmark.scorePerHour}
              </div>
            </div>
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Avg score/hour</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-secondary)' }}>
                {currentData.efficiencyBenchmark.avgScorePerHour}
              </div>
            </div>
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Efficiency percentile</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentData.efficiencyBenchmark.percentile}%
              </div>
            </div>
          </div>
          <div className="pt-4 border-t text-xs" style={{ borderColor: 'var(--border-soft)', color: 'var(--text-tertiary)' }}>
            Efficiency compares score improvement relative to time invested.
          </div>
        </div>
      </div>

      {/* Improvement Opportunity */}
      <div className="p-5 border-l-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)' }}>
        <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
          Improvement Opportunity
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Peers at similar ranks who improved recently focused on targeted revision in weak areas. 
          Consistent practice in identified gaps can result in 50-100 rank improvement over 2-3 weeks. 
          Recommended focus: review recent test errors and strengthen foundational concepts.
        </p>
      </div>
    </div>
  );
}

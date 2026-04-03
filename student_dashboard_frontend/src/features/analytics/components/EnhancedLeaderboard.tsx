import { Fragment, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Shield, Medal } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import type { EnhancedLeaderboardSection } from './types';

export function EnhancedLeaderboard() {
  const { updatePreference, shouldShowRank } = usePreferences();
  const [activeTab, setActiveTab] = useState<'overall' | 'physics' | 'chemistry' | 'math'>('overall');
  const [showOptIn, setShowOptIn] = useState(!shouldShowRank());
  const [viewMode, setViewMode] = useState<'nearby' | 'top' | 'global'>('nearby');
  const [currentPage, setCurrentPage] = useState(1);
  const handleOptIn = (enable: boolean) => {
    updatePreference('focusMode', !enable);
    setShowOptIn(false);
  };

  // Rating color system (like Codeforces)
  const getRatingColor = (rating: number): string => {
    if (rating >= 2400) return '#FF0000'; // Red (International Master)
    if (rating >= 2100) return '#FF8C00'; // Orange (Master)
    if (rating >= 1900) return '#AA00AA'; // Violet (Candidate Master)
    if (rating >= 1600) return '#0000FF'; // Blue (Expert)
    if (rating >= 1400) return '#03A89E'; // Cyan (Specialist)
    if (rating >= 1200) return '#008000'; // Green (Pupil)
    return '#808080'; // Gray (Newbie)
  };

  const getRatingTitle = (rating: number): string => {
    if (rating >= 2400) return 'International Master';
    if (rating >= 2100) return 'Master';
    if (rating >= 1900) return 'Candidate Master';
    if (rating >= 1600) return 'Expert';
    if (rating >= 1400) return 'Specialist';
    if (rating >= 1200) return 'Pupil';
    return 'Newbie';
  };

  // Realistic dummy leaderboard data
  const leaderboardData: Record<'overall' | 'physics' | 'chemistry' | 'math', EnhancedLeaderboardSection> = {
    overall: {
      userRank: 847,
      userRating: 1547,
      totalUsers: 12453,
      percentile: 93,
      movement: -12,
      problemsSolved: 342,
      contestsParticipated: 28,
      topRankers: [
        { rank: 1, name: 'Aarav Sharma', rating: 2487, problemsSolved: 1247, contests: 89, movement: 0, country: 'IN', city: 'Delhi', avatar: 'AS' },
        { rank: 2, name: 'Priya Mehta', rating: 2456, problemsSolved: 1198, contests: 85, movement: 1, country: 'IN', city: 'Mumbai', avatar: 'PM' },
        { rank: 3, name: 'Rohan Gupta', rating: 2423, problemsSolved: 1156, contests: 82, movement: -1, country: 'IN', city: 'Bangalore', avatar: 'RG' },
        { rank: 4, name: 'Ananya Singh', rating: 2401, problemsSolved: 1134, contests: 80, movement: 0, country: 'IN', city: 'Pune', avatar: 'AS' },
        { rank: 5, name: 'Karthik Iyer', rating: 2378, problemsSolved: 1112, contests: 78, movement: 2, country: 'IN', city: 'Chennai', avatar: 'KI' },
      ],
      nearbyRivals: [
        { rank: 842, name: 'Aditya K.', rating: 1552, problemsSolved: 345, contests: 29, movement: 3, country: 'IN', city: 'Jaipur', avatar: 'AK' },
        { rank: 843, name: 'Sneha M.', rating: 1551, problemsSolved: 344, contests: 28, movement: -1, country: 'IN', city: 'Kolkata', avatar: 'SM' },
        { rank: 844, name: 'Rahul S.', rating: 1550, problemsSolved: 344, contests: 29, movement: 0, country: 'IN', city: 'Hyderabad', avatar: 'RS' },
        { rank: 845, name: 'Divya T.', rating: 1549, problemsSolved: 343, contests: 27, movement: 2, country: 'IN', city: 'Ahmedabad', avatar: 'DT' },
        { rank: 846, name: 'Arjun P.', rating: 1548, problemsSolved: 343, contests: 28, movement: -2, country: 'IN', city: 'Surat', avatar: 'AP' },
        { rank: 847, name: 'You', rating: 1547, problemsSolved: 342, contests: 28, movement: -12, country: 'IN', city: 'Delhi', avatar: 'YO', isUser: true },
        { rank: 848, name: 'Kavya R.', rating: 1546, problemsSolved: 342, contests: 27, movement: 1, country: 'IN', city: 'Lucknow', avatar: 'KR' },
        { rank: 849, name: 'Rohan G.', rating: 1545, problemsSolved: 341, contests: 28, movement: -3, country: 'IN', city: 'Nagpur', avatar: 'RG' },
        { rank: 850, name: 'Ananya D.', rating: 1544, problemsSolved: 341, contests: 27, movement: 0, country: 'IN', city: 'Indore', avatar: 'AD' },
        { rank: 851, name: 'Karthik V.', rating: 1543, problemsSolved: 340, contests: 28, movement: 4, country: 'IN', city: 'Bhopal', avatar: 'KV' },
        { rank: 852, name: 'Meera L.', rating: 1542, problemsSolved: 340, contests: 26, movement: -1, country: 'IN', city: 'Chandigarh', avatar: 'ML' },
      ]
    },
    physics: {
      userRank: 723,
      userRating: 1623,
      totalUsers: 12453,
      percentile: 94,
      movement: 5,
      problemsSolved: 156,
      contestsParticipated: 18,
      topRankers: [
        { rank: 1, name: 'Vikram Shah', rating: 2501, problemsSolved: 478, contests: 42, movement: 0, country: 'IN', city: 'Mumbai', avatar: 'VS' },
        { rank: 2, name: 'Ishita Roy', rating: 2478, problemsSolved: 465, contests: 40, movement: 0, country: 'IN', city: 'Kolkata', avatar: 'IR' },
        { rank: 3, name: 'Aditya Joshi', rating: 2445, problemsSolved: 452, contests: 38, movement: 1, country: 'IN', city: 'Pune', avatar: 'AJ' },
        { rank: 4, name: 'Riya Patel', rating: 2423, problemsSolved: 448, contests: 37, movement: -1, country: 'IN', city: 'Ahmedabad', avatar: 'RP' },
        { rank: 5, name: 'Nikhil Kumar', rating: 2401, problemsSolved: 445, contests: 36, movement: 0, country: 'IN', city: 'Delhi', avatar: 'NK' },
      ],
      nearbyRivals: [
        { rank: 718, name: 'Vikram J.', rating: 1628, problemsSolved: 158, contests: 19, movement: 1, country: 'IN', city: 'Chennai', avatar: 'VJ' },
        { rank: 719, name: 'Ishita N.', rating: 1627, problemsSolved: 158, contests: 18, movement: 0, country: 'IN', city: 'Bangalore', avatar: 'IN' },
        { rank: 720, name: 'Siddharth M.', rating: 1626, problemsSolved: 157, contests: 19, movement: 2, country: 'IN', city: 'Hyderabad', avatar: 'SM' },
        { rank: 721, name: 'Divya K.', rating: 1625, problemsSolved: 157, contests: 18, movement: -1, country: 'IN', city: 'Jaipur', avatar: 'DK' },
        { rank: 722, name: 'Nikhil P.', rating: 1624, problemsSolved: 157, contests: 18, movement: 0, country: 'IN', city: 'Lucknow', avatar: 'NP' },
        { rank: 723, name: 'You', rating: 1623, problemsSolved: 156, contests: 18, movement: 5, country: 'IN', city: 'Delhi', avatar: 'YO', isUser: true },
        { rank: 724, name: 'Tanvi S.', rating: 1622, problemsSolved: 156, contests: 17, movement: -2, country: 'IN', city: 'Surat', avatar: 'TS' },
        { rank: 725, name: 'Aarav B.', rating: 1621, problemsSolved: 155, contests: 18, movement: 1, country: 'IN', city: 'Nagpur', avatar: 'AB' },
        { rank: 726, name: 'Riya W.', rating: 1620, problemsSolved: 155, contests: 17, movement: 0, country: 'IN', city: 'Indore', avatar: 'RW' },
        { rank: 727, name: 'Harsh T.', rating: 1619, problemsSolved: 154, contests: 18, movement: -3, country: 'IN', city: 'Bhopal', avatar: 'HT' },
        { rank: 728, name: 'Neha Y.', rating: 1618, problemsSolved: 154, contests: 17, movement: 2, country: 'IN', city: 'Chandigarh', avatar: 'NY' },
      ]
    },
    chemistry: {
      userRank: 892,
      userRating: 1489,
      totalUsers: 12453,
      percentile: 93,
      movement: -8,
      problemsSolved: 134,
      contestsParticipated: 15,
      topRankers: [
        { rank: 1, name: 'Pooja Verma', rating: 2467, problemsSolved: 445, contests: 38, movement: 0, country: 'IN', city: 'Delhi', avatar: 'PV' },
        { rank: 2, name: 'Varun Singh', rating: 2445, problemsSolved: 432, contests: 36, movement: 1, country: 'IN', city: 'Mumbai', avatar: 'VS' },
        { rank: 3, name: 'Sakshi Shah', rating: 2423, problemsSolved: 428, contests: 35, movement: -1, country: 'IN', city: 'Pune', avatar: 'SS' },
        { rank: 4, name: 'Kunal Reddy', rating: 2401, problemsSolved: 425, contests: 34, movement: 0, country: 'IN', city: 'Hyderabad', avatar: 'KR' },
        { rank: 5, name: 'Anjali Desai', rating: 2389, problemsSolved: 422, contests: 33, movement: 0, country: 'IN', city: 'Ahmedabad', avatar: 'AD' },
      ],
      nearbyRivals: [
        { rank: 887, name: 'Pooja H.', rating: 1494, problemsSolved: 136, contests: 16, movement: 2, country: 'IN', city: 'Jaipur', avatar: 'PH' },
        { rank: 888, name: 'Varun K.', rating: 1493, problemsSolved: 136, contests: 15, movement: 0, country: 'IN', city: 'Kolkata', avatar: 'VK' },
        { rank: 889, name: 'Sakshi M.', rating: 1492, problemsSolved: 135, contests: 16, movement: 1, country: 'IN', city: 'Bangalore', avatar: 'SM' },
        { rank: 890, name: 'Kunal D.', rating: 1491, problemsSolved: 135, contests: 15, movement: -1, country: 'IN', city: 'Chennai', avatar: 'KD' },
        { rank: 891, name: 'Anjali R.', rating: 1490, problemsSolved: 135, contests: 15, movement: 0, country: 'IN', city: 'Surat', avatar: 'AR' },
        { rank: 892, name: 'You', rating: 1489, problemsSolved: 134, contests: 15, movement: -8, country: 'IN', city: 'Delhi', avatar: 'YO', isUser: true },
        { rank: 893, name: 'Manish G.', rating: 1488, problemsSolved: 134, contests: 14, movement: 3, country: 'IN', city: 'Lucknow', avatar: 'MG' },
        { rank: 894, name: 'Shreya P.', rating: 1487, problemsSolved: 133, contests: 15, movement: -2, country: 'IN', city: 'Nagpur', avatar: 'SP' },
        { rank: 895, name: 'Aakash V.', rating: 1486, problemsSolved: 133, contests: 14, movement: 0, country: 'IN', city: 'Indore', avatar: 'AV' },
        { rank: 896, name: 'Kritika S.', rating: 1485, problemsSolved: 132, contests: 15, movement: 1, country: 'IN', city: 'Bhopal', avatar: 'KS' },
        { rank: 897, name: 'Yash B.', rating: 1484, problemsSolved: 132, contests: 14, movement: -4, country: 'IN', city: 'Chandigarh', avatar: 'YB' },
      ]
    },
    math: {
      userRank: 945,
      userRating: 1456,
      totalUsers: 12453,
      percentile: 92,
      movement: 2,
      problemsSolved: 118,
      contestsParticipated: 12,
      topRankers: [
        { rank: 1, name: 'Deepak Agarwal', rating: 2512, problemsSolved: 489, contests: 45, movement: 0, country: 'IN', city: 'Kolkata', avatar: 'DA' },
        { rank: 2, name: 'Simran Kaur', rating: 2489, problemsSolved: 476, contests: 43, movement: 0, country: 'IN', city: 'Chandigarh', avatar: 'SK' },
        { rank: 3, name: 'Gaurav Mishra', rating: 2467, problemsSolved: 465, contests: 41, movement: 0, country: 'IN', city: 'Lucknow', avatar: 'GM' },
        { rank: 4, name: 'Naina Reddy', rating: 2445, problemsSolved: 458, contests: 40, movement: 1, country: 'IN', city: 'Hyderabad', avatar: 'NR' },
        { rank: 5, name: 'Rohit Thakur', rating: 2423, problemsSolved: 452, contests: 39, movement: -1, country: 'IN', city: 'Jaipur', avatar: 'RT' },
      ],
      nearbyRivals: [
        { rank: 940, name: 'Deepak L.', rating: 1461, problemsSolved: 120, contests: 13, movement: 1, country: 'IN', city: 'Bhopal', avatar: 'DL' },
        { rank: 941, name: 'Simran K.', rating: 1460, problemsSolved: 120, contests: 12, movement: 0, country: 'IN', city: 'Indore', avatar: 'SK' },
        { rank: 942, name: 'Gaurav M.', rating: 1459, problemsSolved: 119, contests: 13, movement: 2, country: 'IN', city: 'Nagpur', avatar: 'GM' },
        { rank: 943, name: 'Naina P.', rating: 1458, problemsSolved: 119, contests: 12, movement: -1, country: 'IN', city: 'Surat', avatar: 'NP' },
        { rank: 944, name: 'Rohit T.', rating: 1457, problemsSolved: 119, contests: 12, movement: 0, country: 'IN', city: 'Pune', avatar: 'RT' },
        { rank: 945, name: 'You', rating: 1456, problemsSolved: 118, contests: 12, movement: 2, country: 'IN', city: 'Delhi', avatar: 'YO', isUser: true },
        { rank: 946, name: 'Swati D.', rating: 1455, problemsSolved: 118, contests: 11, movement: -3, country: 'IN', city: 'Ahmedabad', avatar: 'SD' },
        { rank: 947, name: 'Abhishek N.', rating: 1454, problemsSolved: 117, contests: 12, movement: 1, country: 'IN', city: 'Bangalore', avatar: 'AN' },
        { rank: 948, name: 'Pallavi J.', rating: 1453, problemsSolved: 117, contests: 11, movement: 0, country: 'IN', city: 'Chennai', avatar: 'PJ' },
        { rank: 949, name: 'Sumit R.', rating: 1452, problemsSolved: 116, contests: 12, movement: -2, country: 'IN', city: 'Mumbai', avatar: 'SR' },
        { rank: 950, name: 'Isha G.', rating: 1451, problemsSolved: 116, contests: 11, movement: 1, country: 'IN', city: 'Delhi', avatar: 'IG' },
      ]
    }
  };

  const currentData = leaderboardData[activeTab];

  // Opt-in gate
  if (showOptIn) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Leaderboard</h1>
          <p className="text-sm text-slate-600">
            Optional inspiration and benchmarking—entirely your choice
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-2 border-slate-200 p-8 text-center">
            <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-3">Enable Leaderboard?</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              The leaderboard is optional. Enable it only if you find contextual motivation helpful. 
              <strong> No pressure. No shaming. No forced comparison.</strong>
              <br /><br />
              You can disable this anytime from Settings → Focus Mode.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 text-left">
              <div className="text-xs font-bold text-blue-900 mb-2">What you'll see:</div>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Your rank and rating (never shared publicly)</li>
                <li>• Students near your level (±5 ranks for context)</li>
                <li>• Subject-wise rankings</li>
                <li>• Performance statistics and trends</li>
              </ul>
            </div>

            <div className="flex gap-4 max-sm:flex-col">
              <button
                onClick={() => handleOptIn(false)}
                className="flex-1 px-6 py-3 text-xs font-bold border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                No Thanks
              </button>
              <button
                onClick={() => handleOptIn(true)}
                className="flex-1 px-6 py-3 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                Enable Leaderboard
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Leaderboard</h1>
          <p className="text-sm text-slate-600">
            You've chosen to disable rankings—focus mode active
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-2 border-slate-200 p-8 text-center">
            <Shield className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-3">Leaderboard Disabled</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              You're in focus mode. Rankings are hidden to reduce comparison pressure.
              <br /><br />
              To re-enable rankings, go to <strong>Settings → Focus Mode</strong>.
            </p>

            <button
              onClick={() => setShowOptIn(true)}
              className="px-6 py-3 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
            >
              Enable Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const globalData = [...currentData.topRankers, ...currentData.nearbyRivals]
    .filter((user, index, arr) => arr.findIndex((entry) => entry.rank === user.rank) === index)
    .sort((a, b) => a.rank - b.rank);

  const displayData = viewMode === 'nearby' ? currentData.nearbyRivals : 
                      viewMode === 'top' ? currentData.topRankers : 
                      globalData;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, viewMode]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(displayData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * pageSize;
  const paginatedData = displayData.slice(pageStart, pageStart + pageSize);

  // Full leaderboard view - LeetCode/Codeforces style
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Leaderboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Track your ranking and compete with peers
        </p>
      </div>

      {/* User Stats Card - LeetCode Style */}
      <div 
        className="p-6 mb-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-6">
          {/* Rating */}
          <div>
            <div className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Rating
            </div>
            <div 
              className="text-4xl font-bold mb-1"
              style={{ 
                color: getRatingColor(currentData.userRating),
                fontFamily: 'monospace'
              }}
            >
              {currentData.userRating}
            </div>
            <div className="text-xs" style={{ color: getRatingColor(currentData.userRating) }}>
              {getRatingTitle(currentData.userRating)}
            </div>
          </div>

          {/* Rank */}
          <div>
            <div className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Global Rank
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                #{currentData.userRank.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {currentData.movement > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3" style={{ color: '#10B981' }} />
                  <span className="text-xs font-bold" style={{ color: '#10B981' }}>
                    +{currentData.movement}
                  </span>
                </>
              ) : currentData.movement < 0 ? (
                <>
                  <TrendingDown className="w-3 h-3" style={{ color: '#EF4444' }} />
                  <span className="text-xs font-bold" style={{ color: '#EF4444' }}>
                    {currentData.movement}
                  </span>
                </>
              ) : (
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>—</span>
              )}
            </div>
          </div>

          {/* Problems Solved */}
          <div>
            <div className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Problems Solved
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {currentData.problemsSolved}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {currentData.contestsParticipated} contests
            </div>
          </div>

          {/* Percentile */}
          <div>
            <div className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Percentile
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
              {currentData.percentile}%
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Top {100 - currentData.percentile}%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div 
        className="p-4 mb-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
          {/* Subject Tabs */}
          <div className="w-full overflow-visible whitespace-normal md:w-auto md:whitespace-nowrap">
            <div className="grid w-full min-w-0 grid-cols-2 gap-2 md:inline-flex md:w-auto md:min-w-max">
              {(['overall', 'physics', 'chemistry', 'math'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="w-full px-2 py-2 text-center text-xs font-bold uppercase tracking-wide transition-all rounded-lg md:w-auto md:px-4 md:whitespace-nowrap"
                  style={{
                    background: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
                    color: activeTab === tab ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: activeTab === tab ? 'var(--accent-primary)' : 'var(--border-soft)',
                  }}
                >
                  {tab === 'overall' ? 'Overall' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div className="w-full overflow-visible whitespace-normal md:w-auto md:overflow-x-auto md:whitespace-nowrap md:scroll-smooth">
            <div className="grid w-full grid-cols-3 gap-2 md:inline-flex md:w-auto">
              {(['top', 'nearby', 'global'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="w-full px-3 py-1.5 text-center text-xs font-semibold transition-all md:w-auto md:whitespace-nowrap"
                  style={{
                    background: viewMode === mode ? 'var(--bg-secondary)' : 'transparent',
                    color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  {mode === 'top' ? 'Top 5' : mode === 'nearby' ? 'Near Me' : 'Global'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table - Codeforces Style */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <table className="w-full">
          <thead className="hidden md:table-header-group" style={{ background: 'var(--bg-secondary)' }}>
            <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Rank
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                User
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Rating
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Problems
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Contests
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Change
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((user, idx) => (
              <Fragment key={user.rank}>
                <tr
                  className="hidden md:table-row"
                  style={{
                    background: user.isUser ? 'var(--accent-soft)' : (pageStart + idx) % 2 === 0 ? 'transparent' : 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border-soft)',
                    borderLeft: user.isUser ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!user.isUser) {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!user.isUser) {
                      e.currentTarget.style.background = (pageStart + idx) % 2 === 0 ? 'transparent' : 'var(--bg-secondary)';
                    }
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.rank <= 3 && viewMode === 'top' && (
                        <Medal
                          className="w-4 h-4"
                          style={{
                            color: user.rank === 1 ? '#FFD700' : user.rank === 2 ? '#C0C0C0' : '#CD7F32'
                          }}
                        />
                      )}
                      <span
                        className="text-sm font-bold"
                        style={{
                          color: user.isUser ? 'var(--accent-primary)' : 'var(--text-primary)',
                          fontFamily: 'monospace'
                        }}
                      >
                        #{user.rank}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          background: user.isUser ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: user.isUser ? '#ffffff' : 'var(--text-primary)',
                          border: '2px solid',
                          borderColor: user.isUser ? 'var(--accent-primary)' : 'var(--border-medium)',
                        }}
                      >
                        {user.avatar}
                      </div>

                      <div>
                        <div
                          className="text-sm font-semibold"
                          style={{
                            color: user.isUser ? 'var(--accent-primary)' : 'var(--text-primary)',
                            fontWeight: user.isUser ? 700 : 600
                          }}
                        >
                          {user.name}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                          {user.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="text-center">
                      <div
                        className="text-lg font-bold"
                        style={{
                          color: getRatingColor(user.rating),
                          fontFamily: 'monospace'
                        }}
                      >
                        {user.rating}
                      </div>
                      <div
                        className="text-[9px] uppercase tracking-wide font-bold"
                        style={{ color: getRatingColor(user.rating) }}
                      >
                        {getRatingTitle(user.rating).split(' ')[0]}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: 'var(--text-primary)',
                        fontFamily: 'monospace'
                      }}
                    >
                      {user.problemsSolved}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace'
                      }}
                    >
                      {user.contests}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {user.movement > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="w-3 h-3" style={{ color: '#10B981' }} />
                        <span className="text-xs font-bold" style={{ color: '#10B981', fontFamily: 'monospace' }}>
                          +{user.movement}
                        </span>
                      </div>
                    ) : user.movement < 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <TrendingDown className="w-3 h-3" style={{ color: '#EF4444' }} />
                        <span className="text-xs font-bold" style={{ color: '#EF4444', fontFamily: 'monospace' }}>
                          {user.movement}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>—</span>
                    )}
                  </td>
                </tr>

                <tr className="md:hidden" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td colSpan={6} className="px-2 py-2">
                    <div
                      className="rounded-xl p-3.5 space-y-3"
                      style={{
                        background: user.isUser ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                        border: user.isUser ? '1px solid var(--accent-primary)' : '1px solid var(--border-soft)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {user.rank <= 3 && viewMode === 'top' && (
                            <Medal
                              className="w-4 h-4"
                              style={{
                                color: user.rank === 1 ? '#FFD700' : user.rank === 2 ? '#C0C0C0' : '#CD7F32'
                              }}
                            />
                          )}
                          <span
                            className="inline-flex items-center rounded-md px-1.5 py-0.5 text-sm font-bold leading-none"
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-soft)',
                              color: user.isUser ? 'var(--accent-primary)' : 'var(--text-primary)',
                              fontFamily: 'monospace'
                            }}
                          >
                            #{user.rank}
                          </span>

                          <div
                            className="flex w-7 h-7 rounded-full items-center justify-center flex-shrink-0 text-[10px] font-bold"
                            style={{
                              background: user.isUser ? 'var(--accent-primary)' : 'var(--bg-card)',
                              color: user.isUser ? '#ffffff' : 'var(--text-primary)',
                              border: '1px solid',
                              borderColor: user.isUser ? 'var(--accent-primary)' : 'var(--border-medium)',
                            }}
                          >
                            {user.avatar}
                          </div>

                          <span
                            className="block min-w-0 flex-1 truncate pl-0.5 pr-1 text-sm font-semibold"
                            style={{
                              color: user.isUser ? 'var(--accent-primary)' : 'var(--text-primary)',
                              fontWeight: user.isUser ? 700 : 600
                            }}
                          >
                            {user.name}
                          </span>
                        </div>

                        <div
                          className="pl-2 text-base font-bold flex-shrink-0"
                          style={{
                            color: getRatingColor(user.rating),
                            fontFamily: 'monospace'
                          }}
                        >
                          {user.rating}
                        </div>
                      </div>

                      <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                        {user.city} · {getRatingTitle(user.rating)}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div
                          className="rounded-lg p-2"
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-soft)'
                          }}
                        >
                          <div className="text-[9px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                            Problems
                          </div>
                          <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                            {user.problemsSolved}
                          </div>
                        </div>

                        <div
                          className="rounded-lg p-2"
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-soft)'
                          }}
                        >
                          <div className="text-[9px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                            Contests
                          </div>
                          <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                            {user.contests}
                          </div>
                        </div>

                        <div
                          className="rounded-lg p-2"
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-soft)'
                          }}
                        >
                          <div className="text-[9px] uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                            Change
                          </div>
                          <div className="mt-0.5">
                            {user.movement > 0 ? (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" style={{ color: '#10B981' }} />
                                <span className="text-sm font-bold" style={{ color: '#10B981', fontFamily: 'monospace' }}>
                                  +{user.movement}
                                </span>
                              </div>
                            ) : user.movement < 0 ? (
                              <div className="flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" style={{ color: '#EF4444' }} />
                                <span className="text-sm font-bold" style={{ color: '#EF4444', fontFamily: 'monospace' }}>
                                  {user.movement}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-bold" style={{ color: 'var(--text-tertiary)' }}>—</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div 
        className="mt-6 p-4"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <div className="flex items-center justify-between gap-2 text-xs max-sm:flex-col max-sm:items-start">
          <div style={{ color: 'var(--text-tertiary)' }}>
            {displayData.length === 0 ? 'No ranks to show' : `${pageStart + 1}-${Math.min(pageStart + pageSize, displayData.length)} of ${displayData.length}`}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safeCurrentPage === 1}
              className="px-2 py-1 text-[11px] font-semibold transition-all disabled:opacity-50"
              style={{
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-soft)',
                background: 'var(--bg-card)',
              }}
            >
              Prev
            </button>

            <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Page {safeCurrentPage}/{totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safeCurrentPage === totalPages}
              className="px-2 py-1 text-[11px] font-semibold transition-all disabled:opacity-50"
              style={{
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-soft)',
                background: 'var(--bg-card)',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

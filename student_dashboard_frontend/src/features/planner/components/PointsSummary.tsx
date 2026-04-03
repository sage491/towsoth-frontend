import { TrendingUp, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTodayPoints, getWeeklyPoints } from '@/features/planner/services';
import type { DailyPoints } from '@/services/plannerService';

export function PointsSummary() {
  const [todayData, setTodayData] = useState<DailyPoints | null>(null);
  const [weeklyData, setWeeklyData] = useState<{ total: number; average: number; days: DailyPoints[] }>({
    total: 0,
    average: 0,
    days: [],
  });

  // Refresh data periodically
  useEffect(() => {
    const loadData = async () => {
      const [today, weekly] = await Promise.all([getTodayPoints(), getWeeklyPoints()]);
      setTodayData(today);
      setWeeklyData(weekly);
    };

    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const todayPoints = todayData?.points || 0;
  const weeklyTotal = weeklyData.total;
  const weeklyAvg = weeklyData.average;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Today's Points */}
      <div className="bg-white border-2 border-slate-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Today's Points
          </div>
          <Award className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-3xl font-bold text-slate-900 mb-1">
          {todayPoints}
        </div>
        <div className="text-xs text-slate-600">
          {todayData?.tasksCompleted || 0} tasks completed
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-semibold text-emerald-900 uppercase tracking-wide">
            Weekly Performance
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-3 mb-1">
          <div className="text-3xl font-bold text-slate-900">
            {weeklyTotal}
          </div>
          <div className="text-sm text-slate-600">
            total
          </div>
        </div>
        <div className="text-xs text-slate-600">
          Avg {weeklyAvg} pts/day — consistency is improving
        </div>
      </div>
    </div>
  );
}

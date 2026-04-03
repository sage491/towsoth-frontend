import { X, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlannerBestTimeSlots, getPlannerTimetable, type PlannerTimeSlot } from '@/services/plannerUiService';

interface TimetableDrawerProps {
  onClose: () => void;
  onSelectSlot: (time: string) => void;
  currentTaskTime: string;
}

export function TimetableDrawer({ onClose, onSelectSlot, currentTaskTime }: TimetableDrawerProps) {
  const [, setSelectedTime] = useState<string | null>(null);
  const [timetable, setTimetable] = useState<PlannerTimeSlot[]>([]);
  const [bestTimeSlots, setBestTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getPlannerTimetable(), getPlannerBestTimeSlots()])
      .then(([slots, bestSlots]) => {
        if (!isMounted) return;
        setTimetable(slots);
        setBestTimeSlots(bestSlots);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectSlot = (time: string, type: PlannerTimeSlot['type']) => {
    if (type === 'free') {
      setSelectedTime(time);
      onSelectSlot(time);
    }
  };

  const getSlotColor = (type: PlannerTimeSlot['type']) => {
    switch (type) {
      case 'class':
        return 'bg-blue-50 border-blue-200';
      case 'free':
        return 'bg-emerald-50 border-emerald-200 cursor-pointer hover:bg-emerald-100';
      case 'break':
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getSlotIcon = (type: PlannerTimeSlot['type']) => {
    switch (type) {
      case 'class':
        return '📚';
      case 'free':
        return '✓';
      case 'break':
        return '☕';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-md border-l-2 border-slate-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Timetable</h2>
            <p className="text-xs text-slate-600">Click a free slot to schedule your task</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* AI Suggestion */}
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">
                Best Time for Focus
              </div>
              <div className="text-sm text-blue-800">
                You usually focus best between 7–9 PM
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">
            Today's Schedule
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
          <div className="space-y-2">
            {timetable.map((slot) => (
              <button
                key={slot.time}
                onClick={() => handleSelectSlot(slot.time, slot.type)}
                className={`w-full p-3 border-2 text-left transition-all ${getSlotColor(
                  slot.type
                )} ${
                  currentTaskTime === slot.time ? 'ring-2 ring-blue-600' : ''
                } ${slot.type !== 'free' ? 'cursor-default' : ''}`}
                disabled={slot.type !== 'free'}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{getSlotIcon(slot.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        {slot.time}
                      </span>
                      {bestTimeSlots.includes(slot.time) && slot.type === 'free' && (
                        <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-wide">
                          Best
                        </span>
                      )}
                      {currentTaskTime === slot.time && (
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wide">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-700">
                      {slot.title}
                      {slot.subject && ` – ${slot.subject}`}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          )}
        </div>

        {/* Legend */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-2">
            Legend
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 border border-blue-300"></div>
              <span className="text-slate-600">Class</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-200 border border-emerald-300"></div>
              <span className="text-slate-600">Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-200 border border-slate-300"></div>
              <span className="text-slate-600">Break</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

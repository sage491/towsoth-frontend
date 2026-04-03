import { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import type { TimetableEntry } from '../data/entities';

export type ViewMode = 'week' | 'day';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function useTimetableManagementData() {
  const data = useData();

  const [selectedStream, setSelectedStream] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number | ''>('');
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');

  const availableBatches = useMemo(() => {
    if (!selectedStream) {
      return [];
    }
    return data.getBatchesByStream(selectedStream);
  }, [data, selectedStream]);

  const timetableEntries = useMemo(() => {
    if (!selectedBatch) {
      return [];
    }
    const entries = data.getTimetableByBatch(selectedBatch);
    if (selectedSemester === '') {
      return entries;
    }
    return entries.filter((entry) => entry.semester === selectedSemester);
  }, [data, selectedBatch, selectedSemester]);

  const allTimeSlots = useMemo(() => data.timeSlots.sort((a, b) => a.order - b.order), [data.timeSlots]);

  const timetableGrid = useMemo(() => {
    const grid: Record<DayOfWeek, Record<string, TimetableEntry | null>> = {
      Monday: {},
      Tuesday: {},
      Wednesday: {},
      Thursday: {},
      Friday: {},
      Saturday: {},
    };

    DAYS.forEach((day) => {
      allTimeSlots.forEach((slot) => {
        grid[day][slot.id] = null;
      });
    });

    timetableEntries.forEach((entry) => {
      grid[entry.dayOfWeek][entry.timeSlotId] = entry;
    });

    return grid;
  }, [allTimeSlots, timetableEntries]);

  const facultyWorkload = useMemo(() => {
    if (!selectedBatch) {
      return [];
    }

    const workloadMap = new Map<string, { faculty: ReturnType<typeof data.getFacultyById>; hours: number; subjects: Set<string> }>();

    timetableEntries.forEach((entry) => {
      const faculty = data.getFacultyById(entry.facultyId);
      if (!faculty) {
        return;
      }

      if (!workloadMap.has(faculty.id)) {
        workloadMap.set(faculty.id, {
          faculty,
          hours: 0,
          subjects: new Set(),
        });
      }

      const workload = workloadMap.get(faculty.id);
      if (!workload) {
        return;
      }

      workload.hours += 1;
      workload.subjects.add(entry.subjectId);
    });

    return Array.from(workloadMap.values())
      .map((entry) => ({
        faculty: entry.faculty,
        hours: entry.hours,
        subjects: entry.subjects.size,
      }))
      .sort((first, second) => second.hours - first.hours);
  }, [data, selectedBatch, timetableEntries]);

  const subjectDistribution = useMemo(() => {
    if (!selectedBatch) {
      return [];
    }

    const distributionMap = new Map<string, { subject: ReturnType<typeof data.getSubjectById>; periods: number }>();

    timetableEntries.forEach((entry) => {
      const subject = data.getSubjectById(entry.subjectId);
      if (!subject) {
        return;
      }

      if (!distributionMap.has(subject.id)) {
        distributionMap.set(subject.id, {
          subject,
          periods: 0,
        });
      }

      const distribution = distributionMap.get(subject.id);
      if (!distribution) {
        return;
      }
      distribution.periods += 1;
    });

    return Array.from(distributionMap.values()).sort((first, second) => second.periods - first.periods);
  }, [data, selectedBatch, timetableEntries]);

  const utilizationMetrics = useMemo(() => {
    const totalSlots = DAYS.length * allTimeSlots.length;
    const filledSlots = timetableEntries.length;
    const utilizationRate = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

    return {
      totalSlots,
      filledSlots,
      freeSlots: totalSlots - filledSlots,
      utilizationRate,
    };
  }, [allTimeSlots, timetableEntries.length]);

  const handleStreamChange = (streamId: string) => {
    setSelectedStream(streamId);
    setSelectedBatch('');
    setSelectedSemester('');
  };

  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(batchId);
  };

  return {
    data,
    selectedStream,
    selectedBatch,
    selectedSemester,
    viewMode,
    selectedDay,
    setSelectedSemester,
    setViewMode,
    setSelectedDay,
    availableBatches,
    timetableEntries,
    allTimeSlots,
    timetableGrid,
    facultyWorkload,
    subjectDistribution,
    utilizationMetrics,
    handleStreamChange,
    handleBatchChange,
    selectedStreamData: selectedStream ? data.getStreamById(selectedStream) : null,
    selectedBatchData: selectedBatch ? data.getBatchById(selectedBatch) : null,
    streams: data.streams,
  };
}

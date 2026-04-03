import { useEffect, useMemo, useState } from 'react';
import {
  getAssessmentFilterConfig,
  getAssessmentItems,
} from '../services/management/assessmentService';

export function useAssessmentManagementData() {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [defaultFiltersApplied, setDefaultFiltersApplied] = useState(false);

  const assessments = useMemo(() => getAssessmentItems(), []);
  const filterConfigs = useMemo(() => getAssessmentFilterConfig(), []);

  useEffect(() => {
    if (!defaultFiltersApplied) {
      const savedFilters = localStorage.getItem('assessment-filters');
      if (!savedFilters) {
        setActiveFilters({
          status: ['Published'],
          schedule: 'upcoming',
        });
      }
      setDefaultFiltersApplied(true);
    }
  }, [defaultFiltersApplied]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      if (activeFilters.subject && item.subject !== activeFilters.subject) {
        return false;
      }

      if (activeFilters.assessmentType && activeFilters.assessmentType.length > 0) {
        if (!activeFilters.assessmentType.includes(item.type)) {
          return false;
        }
      }

      if (activeFilters.status && activeFilters.status.length > 0) {
        if (!activeFilters.status.includes(item.status)) {
          return false;
        }
      }

      if (activeFilters.schedule) {
        const today = new Date('2025-01-11');
        const dueDate = new Date(item.dueDate);
        const daysDiff = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (activeFilters.schedule === 'past' && daysDiff >= 0) {
          return false;
        }
        if (activeFilters.schedule === 'today' && daysDiff !== 0) {
          return false;
        }
        if (activeFilters.schedule === 'upcoming' && daysDiff < 0) {
          return false;
        }
      }

      if (activeFilters.progress) {
        const progressPercent = (item.completed / item.total) * 100;

        if (activeFilters.progress === 'not-started' && progressPercent > 0) {
          return false;
        }
        if (activeFilters.progress === 'in-progress' && (progressPercent === 0 || progressPercent === 100)) {
          return false;
        }
        if (activeFilters.progress === 'fully-submitted' && progressPercent !== 100) {
          return false;
        }
      }

      if (activeFilters.search) {
        const searchTerm = String(activeFilters.search).toLowerCase();
        return (
          item.title.toLowerCase().includes(searchTerm) ||
          item.subject.toLowerCase().includes(searchTerm) ||
          item.type.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }, [activeFilters, assessments]);

  return {
    activeFilters,
    setActiveFilters,
    assessments,
    filteredAssessments,
    filterConfigs,
  };
}

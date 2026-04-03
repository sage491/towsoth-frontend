import { useMemo, useState } from 'react';
import {
  getContentFilterConfig,
  getContentItems,
} from '../services/management/contentService';

export function useContentManagementData() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const content = useMemo(() => getContentItems(), []);
  const filterConfigs = useMemo(() => getContentFilterConfig(), []);

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      if (selectedTab === 'verified' && item.status !== 'Published') {
        return false;
      }
      if (selectedTab === 'pending' && item.status !== 'Draft') {
        return false;
      }
      if (selectedTab === 'rejected' && item.status !== 'Archived') {
        return false;
      }

      if (activeFilters.course && item.subject !== activeFilters.course) {
        return false;
      }

      if (activeFilters.contentType && activeFilters.contentType.length > 0) {
        if (!activeFilters.contentType.includes(item.type)) {
          return false;
        }
      }

      if (activeFilters.status && item.status !== activeFilters.status) {
        return false;
      }

      if (activeFilters.uploadDate) {
        const today = new Date('2025-01-11');
        const uploadDate = new Date(item.uploadDate);
        const daysDiff = Math.floor((today.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));

        if (activeFilters.uploadDate === 'today' && daysDiff !== 0) {
          return false;
        }
        if (activeFilters.uploadDate === 'week' && daysDiff > 7) {
          return false;
        }
        if (activeFilters.uploadDate === 'month' && daysDiff > 30) {
          return false;
        }
      }

      if (activeFilters.search) {
        const searchTerm = String(activeFilters.search).toLowerCase();
        return item.title.toLowerCase().includes(searchTerm) || item.subject.toLowerCase().includes(searchTerm);
      }

      return true;
    });
  }, [activeFilters, content, selectedTab]);

  return {
    selectedTab,
    setSelectedTab,
    activeFilters,
    setActiveFilters,
    content,
    filteredContent,
    filterConfigs,
  };
}

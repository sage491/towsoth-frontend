import type { ReactNode } from 'react';

export const PAGE_KEYS = [
  'dashboard',
  'academic-overview',
  'streams',
  'batches',
  'subjects',
  'student-dashboard',
  'student-management',
  'student-performance',
  'faculty',
  'faculty-rating',
  'staff-dashboard',
  'staff-management',
  'staff-performance',
  'content',
  'assessments',
  'attendance',
  'timetable',
  'analytics',
  'system',
  'branding',
  'branding-settings',
  'global',
  'import-data',
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export type NavigateToPage = (page: PageKey) => void;

export interface GlobalHeaderProps {
  onNavigate?: (page: string) => void;
}

export interface SidebarProps {
  activePage: PageKey;
  onNavigate: NavigateToPage;
}

export interface NavChildItem {
  id: PageKey;
  label: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  children?: NavChildItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

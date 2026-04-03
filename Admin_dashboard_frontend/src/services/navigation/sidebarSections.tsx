import {
  BarChart3,
  Building2,
  ClipboardCheck,
  Clock,
  Database,
  FileText,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import type { NavSection } from '../../types/navigation';

export const sidebarSections: NavSection[] = [
  {
    title: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
  },
  {
    title: 'Academic Structure',
    items: [
      {
        id: 'academic-structure',
        label: 'Academic Structure',
        icon: <Building2 className="w-4 h-4" />,
        children: [
          { id: 'academic-overview', label: 'Overview' },
          { id: 'streams', label: 'Streams' },
          { id: 'batches', label: 'Batches' },
          { id: 'subjects', label: 'Subjects' },
        ],
      },
    ],
  },
  {
    title: 'Users',
    items: [
      {
        id: 'students',
        label: 'Students',
        icon: <GraduationCap className="w-4 h-4" />,
        children: [
          { id: 'student-dashboard', label: 'Student Dashboard' },
          { id: 'student-management', label: 'Student Management' },
          { id: 'student-performance', label: 'Student Performance & Risk' },
        ],
      },
      {
        id: 'faculty',
        label: 'Faculty',
        icon: <Users className="w-4 h-4" />,
        children: [
          { id: 'faculty', label: 'Faculty Management' },
          { id: 'faculty-rating', label: 'Faculty Rating & Evaluation' },
        ],
      },
      {
        id: 'staff',
        label: 'Staff',
        icon: <Users className="w-4 h-4" />,
        children: [
          { id: 'staff-dashboard', label: 'Staff Dashboard' },
          { id: 'staff-management', label: 'Staff Management' },
          { id: 'staff-performance', label: 'Staff Performance & Evaluation' },
        ],
      },
    ],
  },
  {
    title: 'Academics & Content',
    items: [
      { id: 'content', label: 'Course Content', icon: <FileText className="w-4 h-4" /> },
      { id: 'assessments', label: 'Assessments', icon: <ClipboardCheck className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Performance & Analytics',
    items: [{ id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }],
  },
  {
    title: 'Operations',
    items: [
      { id: 'attendance', label: 'Attendance', icon: <ClipboardCheck className="w-4 h-4" /> },
      { id: 'timetable', label: 'Timetables', icon: <Clock className="w-4 h-4" /> },
    ],
  },
  {
    title: 'System Control',
    items: [
      { id: 'system', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
      { id: 'branding', label: 'Institution Branding', icon: <Building2 className="w-4 h-4" /> },
      { id: 'import-data', label: 'Import Data', icon: <Database className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Towsoth Global',
    items: [{ id: 'global', label: 'Global Rankings', icon: <Globe className="w-4 h-4" /> }],
  },
];

export const getVisibleSidebarSections = (
  isModuleVisible: (moduleId: string) => boolean,
): NavSection[] => {
  return sidebarSections
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => isModuleVisible(item.id))
        .map((item) => {
          if (!item.children) {
            return item;
          }

          return {
            ...item,
            children: item.children.filter((child) => isModuleVisible(child.id)),
          };
        })
        .filter((item) => !item.children || item.children.length > 0),
    }))
    .filter((section) => section.items.length > 0);
};

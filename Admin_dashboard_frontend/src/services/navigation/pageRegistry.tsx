import { AcademicStructure } from '../../pages';
import { Analytics } from '../../pages';
import { AssessmentManagement } from '../../pages';
import { AttendanceManagement } from '../../pages';
import { BatchesManagement } from '../../pages';
import { BrandingSettings } from '../../pages';
import { ContentManagement } from '../../pages';
import { FacultyManagement } from '../../pages';
import { FacultyRating } from '../../pages';
import { ImportDataPage } from '../../pages';
import { InstitutionBrandingSettings } from '../../pages';
import { SmartDashboard } from '../../pages';
import { StaffDashboard } from '../../pages';
import { StaffManagement } from '../../pages';
import { StaffPerformance } from '../../pages';
import { StreamsManagement } from '../../pages';
import { StudentDashboard } from '../../pages';
import { StudentManagementTableConnected } from '../../pages';
import { StudentPerformanceRisk } from '../../pages';
import { SubjectsManagement } from '../../pages';
import { SystemControl } from '../../pages';
import { TimetableManagement } from '../../pages';
import { TowsothGlobal } from '../../pages';
import type { NavigateToPage, PageKey } from '../../types/navigation';
import type { ReactNode } from 'react';

type PageRenderer = (navigate: NavigateToPage) => ReactNode;

const pageRegistry: Record<PageKey, PageRenderer> = {
  dashboard: (navigate) => <SmartDashboard onNavigate={navigate} />,
  'academic-overview': () => <AcademicStructure />,
  streams: () => <StreamsManagement />,
  batches: () => <BatchesManagement />,
  subjects: () => <SubjectsManagement />,
  'student-dashboard': () => <StudentDashboard />,
  'student-management': () => <StudentManagementTableConnected />,
  'student-performance': () => <StudentPerformanceRisk />,
  faculty: () => <FacultyManagement />,
  'faculty-rating': () => <FacultyRating />,
  'staff-dashboard': () => <StaffDashboard />,
  'staff-management': () => <StaffManagement />,
  'staff-performance': () => <StaffPerformance />,
  content: () => <ContentManagement />,
  assessments: () => <AssessmentManagement />,
  attendance: () => <AttendanceManagement />,
  timetable: () => <TimetableManagement />,
  analytics: () => <Analytics />,
  system: () => <SystemControl />,
  branding: () => <InstitutionBrandingSettings />,
  'branding-settings': () => <BrandingSettings />,
  global: () => <TowsothGlobal />,
  'import-data': () => <ImportDataPage />,
};

export const renderPageByKey = (page: PageKey, navigate: NavigateToPage): ReactNode => {
  const renderer = pageRegistry[page] ?? pageRegistry.dashboard;
  return renderer(navigate);
};

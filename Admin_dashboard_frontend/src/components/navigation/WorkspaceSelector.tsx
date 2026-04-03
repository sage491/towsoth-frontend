import { GraduationCap, BookOpen, Calendar, TrendingUp, Settings, ChevronRight } from 'lucide-react';

export type WorkspaceId = 'students' | 'teaching' | 'operations' | 'analytics' | 'settings';

interface Workspace {
  id: WorkspaceId;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  routes: string[];
  features: string[];
}

export const workspaces: Workspace[] = [
  {
    id: 'students',
    name: 'Students',
    description: 'Profiles, enrollment, performance tracking',
    icon: GraduationCap,
    color: 'text-[#3b82f6]',
    bgColor: 'bg-[#dbeafe]',
    routes: ['/students', '/student-management', '/student-performance', '/student-dashboard'],
    features: ['Student Profiles', 'Risk Analysis', 'Attendance', 'GPA Tracking', 'Enrollment']
  },
  {
    id: 'teaching',
    name: 'Teaching',
    description: 'Faculty, courses, content, assessments',
    icon: BookOpen,
    color: 'text-[#059669]',
    bgColor: 'bg-[#d1fae5]',
    routes: ['/faculty', '/faculty-rating', '/content', '/assessments', '/academic-overview', '/streams', '/batches', '/subjects'],
    features: ['Faculty Management', 'Course Materials', 'Assessments', 'Grading', 'Academic Structure']
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Daily operations, attendance, schedules',
    icon: Calendar,
    color: 'text-[#f59e0b]',
    bgColor: 'bg-[#fef3c7]',
    routes: ['/attendance', '/timetable', '/staff', '/staff-management', '/staff-dashboard', '/staff-performance'],
    features: ['Attendance', 'Timetables', 'Staff Management', 'Scheduling', 'Daily Operations']
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Reports, insights, AI recommendations',
    icon: TrendingUp,
    color: 'text-[#8b5cf6]',
    bgColor: 'bg-[#ede9fe]',
    routes: ['/analytics'],
    features: ['Performance Reports', 'Trends', 'AI Insights', 'Predictions', 'Data Export']
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Configuration, branding, permissions',
    icon: Settings,
    color: 'text-[#6b7280]',
    bgColor: 'bg-[#f3f4f6]',
    routes: ['/system', '/global'],
    features: ['Institution Setup', 'Branding', 'User Permissions', 'Data Import', 'System Config']
  }
];

interface WorkspaceSelectorProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function WorkspaceSelector({ currentPage = '', onNavigate }: WorkspaceSelectorProps) {
  // Determine current workspace based on currentPage
  const currentWorkspace = workspaces.find(ws =>
    ws.routes.some(route => currentPage === route.replace('/', ''))
  ) || workspaces[0];

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page.replace('/', ''));
    }
  };

  return (
    <div className="bg-white border-b border-[#e5e7eb]">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            const isActive = workspace.id === currentWorkspace.id;

            return (
              <button
                key={workspace.id}
                onClick={() => handleNavigate(workspace.routes[0])}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] transition-all whitespace-nowrap ${
                  isActive
                    ? `${workspace.bgColor} ${workspace.color} border-2 border-current font-medium`
                    : 'bg-white border border-[#e5e7eb] text-[#6b7280] hover:border-[#d1d5db] hover:text-[#374151]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{workspace.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Description */}
      <div className="px-4 sm:px-6 py-3 bg-[#f9fafb] border-t border-[#f3f4f6]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[14px] sm:text-[15px] text-[#111827] font-medium">{currentWorkspace.name} Workspace</h2>
            <p className="text-[11px] sm:text-[12px] text-[#6b7280] mt-0.5">{currentWorkspace.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentWorkspace.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="text-[10px] sm:text-[11px] text-[#6b7280] px-2 py-1 bg-white border border-[#e5e7eb]"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Workspace-aware breadcrumb
interface WorkspaceBreadcrumbProps {
  currentPage?: string;
}

export function WorkspaceBreadcrumb({ currentPage = '' }: WorkspaceBreadcrumbProps) {
  const currentWorkspace = workspaces.find(ws =>
    ws.routes.some(route => currentPage === route.replace('/', ''))
  );

  if (!currentWorkspace) return null;

  const Icon = currentWorkspace.icon;

  return (
    <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-4">
      <Icon className={`w-4 h-4 ${currentWorkspace.color}`} />
      <span className={currentWorkspace.color}>{currentWorkspace.name}</span>
      {currentPage && currentPage !== 'dashboard' && (
        <>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#111827] capitalize">{currentPage.replace(/-/g, ' ')}</span>
        </>
      )}
    </div>
  );
}

// Get current workspace helper
export function getCurrentWorkspace(currentPage: string): Workspace | null {
  return workspaces.find(ws =>
    ws.routes.some(route => currentPage === route.replace('/', ''))
  ) || null;
}
import { useState, useEffect, useCallback } from 'react';
import { Search, Command, ArrowRight, Clock, Star, Hash, Settings, Users, BookOpen, BarChart3, Calendar, Upload, GraduationCap, UserCog, Briefcase, FileText, TrendingUp, Bell, Database } from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: any;
  category: string;
  action: () => void;
  keywords: string[];
  shortcut?: string;
}

interface CommandPaletteProps {
  onNavigate?: (page: string) => void;
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  // Simple navigation helper
  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Command definitions - ALL features accessible
  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      description: 'Main institutional overview',
      icon: BarChart3,
      category: 'Navigation',
      action: () => navigate('/'),
      keywords: ['dashboard', 'home', 'overview']
    },
    
    // Students Workspace
    {
      id: 'nav-students',
      title: 'Students Overview',
      description: 'Student management workspace',
      icon: GraduationCap,
      category: 'Navigation',
      action: () => navigate('/students'),
      keywords: ['students', 'learners', 'pupils']
    },
    {
      id: 'action-add-student',
      title: 'Add New Student',
      description: 'Create student profile',
      icon: Users,
      category: 'Actions',
      action: () => navigate('/students?action=add'),
      keywords: ['add', 'create', 'new', 'student', 'enroll'],
      shortcut: 'Ctrl+N'
    },
    {
      id: 'action-import-students',
      title: 'Import Students',
      description: 'Bulk upload student data',
      icon: Upload,
      category: 'Actions',
      action: () => navigate('/?action=import'),
      keywords: ['import', 'upload', 'bulk', 'students', 'data']
    },
    
    // Faculty Workspace
    {
      id: 'nav-faculty',
      title: 'Faculty Management',
      description: 'Manage teaching staff',
      icon: UserCog,
      category: 'Navigation',
      action: () => navigate('/faculty'),
      keywords: ['faculty', 'teachers', 'professors', 'instructors']
    },
    {
      id: 'action-add-faculty',
      title: 'Add Faculty Member',
      description: 'Add new teaching staff',
      icon: UserCog,
      category: 'Actions',
      action: () => navigate('/faculty?action=add'),
      keywords: ['add', 'faculty', 'teacher', 'professor']
    },
    
    // Staff Workspace
    {
      id: 'nav-staff',
      title: 'Staff Dashboard',
      description: 'Manage administrative staff',
      icon: Briefcase,
      category: 'Navigation',
      action: () => navigate('/staff'),
      keywords: ['staff', 'employees', 'admin', 'administration']
    },
    {
      id: 'action-add-staff',
      title: 'Add Staff Member',
      description: 'Add administrative staff',
      icon: Briefcase,
      category: 'Actions',
      action: () => navigate('/staff?action=add'),
      keywords: ['add', 'staff', 'employee', 'admin']
    },
    
    // Academic Structure
    {
      id: 'nav-academic',
      title: 'Academic Structure',
      description: 'Manage streams, batches, subjects',
      icon: BookOpen,
      category: 'Navigation',
      action: () => navigate('/academic-overview'),
      keywords: ['academic', 'structure', 'streams', 'batches', 'courses']
    },
    {
      id: 'nav-streams',
      title: 'Manage Streams',
      description: 'View and edit academic streams',
      icon: Hash,
      category: 'Navigation',
      action: () => navigate('/streams'),
      keywords: ['streams', 'branches', 'departments']
    },
    {
      id: 'nav-batches',
      title: 'Manage Batches',
      description: 'View and edit student batches',
      icon: Users,
      category: 'Navigation',
      action: () => navigate('/batches'),
      keywords: ['batches', 'classes', 'sections', 'groups']
    },
    
    // Operations
    {
      id: 'nav-attendance',
      title: 'Attendance Management',
      description: 'Track student attendance',
      icon: Calendar,
      category: 'Navigation',
      action: () => navigate('/attendance'),
      keywords: ['attendance', 'present', 'absent', 'tracking']
    },
    {
      id: 'nav-timetable',
      title: 'Timetable',
      description: 'View and manage schedules',
      icon: Calendar,
      category: 'Navigation',
      action: () => navigate('/timetable'),
      keywords: ['timetable', 'schedule', 'calendar', 'classes']
    },
    {
      id: 'action-mark-attendance',
      title: 'Mark Attendance',
      description: 'Record student attendance',
      icon: Calendar,
      category: 'Actions',
      action: () => navigate('/attendance?action=mark'),
      keywords: ['mark', 'attendance', 'present', 'absent']
    },
    
    // Analytics
    {
      id: 'nav-analytics',
      title: 'Analytics Dashboard',
      description: 'View insights and reports',
      icon: TrendingUp,
      category: 'Navigation',
      action: () => navigate('/analytics'),
      keywords: ['analytics', 'reports', 'insights', 'data', 'statistics']
    },
    
    // Settings
    {
      id: 'nav-system',
      title: 'System Settings',
      description: 'Configure institution settings',
      icon: Settings,
      category: 'Navigation',
      action: () => navigate('/system'),
      keywords: ['settings', 'config', 'system', 'preferences']
    },
    {
      id: 'action-branding',
      title: 'Customize Branding',
      description: 'Update institution logo and colors',
      icon: Star,
      category: 'Actions',
      action: () => navigate('/system?tab=branding'),
      keywords: ['branding', 'logo', 'colors', 'theme', 'customize']
    },
    {
      id: 'nav-import-data',
      title: 'Import Data',
      description: 'Import student, faculty, and staff records',
      icon: Database,
      category: 'Navigation',
      action: () => navigate('/import-data'),
      keywords: ['import', 'upload', 'data', 'bulk', 'csv', 'excel', 'migrate']
    },
    
    // Quick Actions
    {
      id: 'action-notifications',
      title: 'View Notifications',
      description: 'Check recent alerts',
      icon: Bell,
      category: 'Actions',
      action: () => navigate('/?view=notifications'),
      keywords: ['notifications', 'alerts', 'messages']
    },
    {
      id: 'action-database',
      title: 'Database Management',
      description: 'Manage database operations',
      icon: Database,
      category: 'Actions',
      action: () => navigate('/?view=database'),
      keywords: ['database', 'operations', 'manage']
    }
  ];

  // Filter commands based on search
  const filteredCommands = search.trim()
    ? commands.filter(cmd =>
        cmd.title.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(search.toLowerCase()) ||
        cmd.keywords.some(kw => kw.toLowerCase().includes(search.toLowerCase()))
      )
    : commands;

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Recent commands
  const recentCommandObjects = recentCommands
    .map(id => commands.find(cmd => cmd.id === id))
    .filter(Boolean) as CommandItem[];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setSearch('');
        setSelectedIndex(0);
      }

      // Close palette: Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearch('');
      }

      // Navigate: Arrow keys
      if (isOpen && e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      }

      if (isOpen && e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }

      // Execute: Enter
      if (isOpen && e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) executeCommand(cmd);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Execute command
  const executeCommand = useCallback((cmd: CommandItem) => {
    cmd.action();
    
    // Save to recent
    const updated = [cmd.id, ...recentCommands.filter(id => id !== cmd.id)].slice(0, 5);
    setRecentCommands(updated);
    localStorage.setItem('recentCommands', JSON.stringify(updated));
    
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  }, [recentCommands]);

  // Load recent commands
  useEffect(() => {
    const saved = localStorage.getItem('recentCommands');
    if (saved) {
      try {
        setRecentCommands(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent commands', e);
      }
    }
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e5e7eb] hover:border-[#d1d5db] text-[#6b7280] text-[12px] transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Quick search...</span>
        <kbd className="hidden lg:inline px-1.5 py-0.5 bg-[#f3f4f6] border border-[#d1d5db] text-[10px]">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-[10vh] px-4">
      <div className="bg-white w-full max-w-2xl shadow-2xl border border-[#e5e7eb] max-h-[70vh] flex flex-col">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e5e7eb]">
          <Search className="w-5 h-5 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="flex-1 text-[14px] text-[#111827] placeholder:text-[#9ca3af] outline-none bg-transparent"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-[11px] text-[#6b7280] px-2 py-1 bg-[#f3f4f6] border border-[#d1d5db] hover:bg-[#e5e7eb]"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {/* Recent Commands */}
          {!search && recentCommandObjects.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-[10px] text-[#9ca3af] uppercase tracking-wider">Recent</p>
              {recentCommandObjects.map((cmd, idx) => (
                <button
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    selectedIndex === idx ? 'bg-[#f3f4f6]' : 'hover:bg-[#f9fafb]'
                  }`}
                >
                  <cmd.icon className="w-4 h-4 text-[#6b7280] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#111827]">{cmd.title}</p>
                    {cmd.description && (
                      <p className="text-[11px] text-[#6b7280] truncate">{cmd.description}</p>
                    )}
                  </div>
                  <Clock className="w-3.5 h-3.5 text-[#d1d5db]" />
                </button>
              ))}
            </div>
          )}

          {/* Grouped Commands */}
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category} className="p-2">
              <p className="px-3 py-2 text-[10px] text-[#9ca3af] uppercase tracking-wider">{category}</p>
              {items.map((cmd, idx) => {
                const globalIndex = filteredCommands.indexOf(cmd);
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      selectedIndex === globalIndex ? 'bg-[#f3f4f6]' : 'hover:bg-[#f9fafb]'
                    }`}
                  >
                    <cmd.icon className="w-4 h-4 text-[#6b7280] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#111827]">{cmd.title}</p>
                      {cmd.description && (
                        <p className="text-[11px] text-[#6b7280] truncate">{cmd.description}</p>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <kbd className="text-[10px] text-[#6b7280] px-1.5 py-0.5 bg-[#f3f4f6] border border-[#e5e7eb]">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-[#d1d5db]" />
                  </button>
                );
              })}
            </div>
          ))}

          {/* No Results */}
          {filteredCommands.length === 0 && (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-[#d1d5db] mx-auto mb-3" />
              <p className="text-[13px] text-[#6b7280]">No commands found</p>
              <p className="text-[11px] text-[#9ca3af] mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#e5e7eb] px-4 py-2 bg-[#f9fafb]">
          <div className="flex items-center justify-between text-[10px] text-[#9ca3af]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-[#e5e7eb]">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-[#e5e7eb]">Enter</kbd> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-[#e5e7eb]">ESC</kbd> Close
              </span>
            </div>
            <span className="hidden sm:block">{filteredCommands.length} commands</span>
          </div>
        </div>
      </div>
    </div>
  );
}
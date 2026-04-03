import { useState } from 'react';
import { Search, Download, Plus, MoreVertical, GraduationCap, TrendingUp, TrendingDown, Circle, SlidersHorizontal, ChevronDown, Settings } from 'lucide-react';

type AcademicClassification = 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
type ProjectType = 'Academic' | 'Industry-based' | 'Capstone';
type ResearchStatus = 'None' | 'Co-author' | 'First author';
type PublicationLevel = 'None' | 'College' | 'National' | 'International';
type PatentStatus = 'None' | 'Filed' | 'Published' | 'Granted';
type AcademicTag = 'Top Performer' | 'Research-Oriented' | 'Project-Focused' | 'Innovation-Driven' | 'Academically At Risk' | 'Balanced Performer';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  batch: string;
  program: string;
  department: string;
  attendance: number;
  gpa: number;
  percentage: number;
  academicClassification: AcademicClassification;
  projectsCount: number;
  projectType: ProjectType[];
  researchStatus: ResearchStatus;
  researchPapersCount: number;
  publicationLevel: PublicationLevel;
  patentStatus: PatentStatus;
  patentsCount: number;
  innovationParticipation: boolean;
  academicTags: AcademicTag[];
  riskLevel: 'Low' | 'Medium' | 'High';
  trend: 'up' | 'down' | 'neutral';
  status: 'Active' | 'Inactive';
  email: string;
}

export function StudentManagementTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Advanced filters
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [percentageRange, setPercentageRange] = useState<string>('all');
  const [academicClassification, setAcademicClassification] = useState<string>('all');
  const [projectsRange, setProjectsRange] = useState<string>('all');
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [researchStatusFilter, setResearchStatusFilter] = useState<string>('all');
  const [publicationLevelFilter, setPublicationLevelFilter] = useState<string>('all');
  const [patentStatusFilter, setPatentStatusFilter] = useState<string>('all');
  const [innovationFilter, setInnovationFilter] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Column visibility
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    percentage: false,
    projectsCount: false,
    researchPapersCount: false,
    patentsCount: false,
    academicTags: true,
  });

  // Mock student data with enhanced fields
  const allStudents: Student[] = [
    {
      id: 'STU001',
      rollNo: 'CS-A3-001',
      name: 'Aarav Sharma',
      batch: 'CS-A3',
      program: 'B.Tech',
      department: 'Computer Science',
      attendance: 92.5,
      gpa: 8.5,
      percentage: 85.0,
      academicClassification: 'Excellent',
      projectsCount: 4,
      projectType: ['Academic', 'Industry-based'],
      researchStatus: 'Co-author',
      researchPapersCount: 2,
      publicationLevel: 'National',
      patentStatus: 'None',
      patentsCount: 0,
      innovationParticipation: true,
      academicTags: ['Balanced Performer', 'Project-Focused'],
      riskLevel: 'Low',
      trend: 'up',
      status: 'Active',
      email: 'aarav.sharma@university.edu',
    },
    {
      id: 'STU002',
      rollNo: 'CS-A3-002',
      name: 'Priya Patel',
      batch: 'CS-A3',
      program: 'B.Tech',
      department: 'Computer Science',
      attendance: 88.2,
      gpa: 8.2,
      percentage: 82.0,
      academicClassification: 'Good',
      projectsCount: 3,
      projectType: ['Academic'],
      researchStatus: 'None',
      researchPapersCount: 0,
      publicationLevel: 'None',
      patentStatus: 'None',
      patentsCount: 0,
      innovationParticipation: false,
      academicTags: ['Project-Focused'],
      riskLevel: 'Low',
      trend: 'up',
      status: 'Active',
      email: 'priya.patel@university.edu',
    },
    {
      id: 'STU003',
      rollNo: 'CS-A3-003',
      name: 'Rahul Kumar',
      batch: 'CS-A3',
      program: 'B.Tech',
      department: 'Computer Science',
      attendance: 65.3,
      gpa: 6.1,
      percentage: 61.0,
      academicClassification: 'Needs Improvement',
      projectsCount: 1,
      projectType: ['Academic'],
      researchStatus: 'None',
      researchPapersCount: 0,
      publicationLevel: 'None',
      patentStatus: 'None',
      patentsCount: 0,
      innovationParticipation: false,
      academicTags: ['Academically At Risk'],
      riskLevel: 'High',
      trend: 'down',
      status: 'Active',
      email: 'rahul.kumar@university.edu',
    },
    {
      id: 'STU004',
      rollNo: 'CS-B3-015',
      name: 'Sneha Reddy',
      batch: 'CS-B3',
      program: 'B.Tech',
      department: 'Computer Science',
      attendance: 94.7,
      gpa: 9.1,
      percentage: 91.0,
      academicClassification: 'Excellent',
      projectsCount: 6,
      projectType: ['Academic', 'Industry-based', 'Capstone'],
      researchStatus: 'First author',
      researchPapersCount: 4,
      publicationLevel: 'International',
      patentStatus: 'Filed',
      patentsCount: 1,
      innovationParticipation: true,
      academicTags: ['Top Performer', 'Research-Oriented', 'Innovation-Driven'],
      riskLevel: 'Low',
      trend: 'up',
      status: 'Active',
      email: 'sneha.reddy@university.edu',
    },
    {
      id: 'STU005',
      rollNo: 'ECE-A2-042',
      name: 'Arjun Singh',
      batch: 'ECE-A2',
      program: 'B.Tech',
      department: 'Electronics',
      attendance: 78.4,
      gpa: 7.3,
      percentage: 73.0,
      academicClassification: 'Average',
      projectsCount: 2,
      projectType: ['Academic'],
      researchStatus: 'None',
      researchPapersCount: 0,
      publicationLevel: 'None',
      patentStatus: 'None',
      patentsCount: 0,
      innovationParticipation: false,
      academicTags: ['Balanced Performer'],
      riskLevel: 'Medium',
      trend: 'neutral',
      status: 'Active',
      email: 'arjun.singh@university.edu',
    },
    {
      id: 'STU006',
      rollNo: 'ECE-A2-043',
      name: 'Divya Menon',
      batch: 'ECE-A2',
      program: 'B.Tech',
      department: 'Electronics',
      attendance: 91.2,
      gpa: 8.7,
      percentage: 87.0,
      academicClassification: 'Excellent',
      projectsCount: 5,
      projectType: ['Academic', 'Capstone'],
      researchStatus: 'First author',
      researchPapersCount: 3,
      publicationLevel: 'International',
      patentStatus: 'Published',
      patentsCount: 2,
      innovationParticipation: true,
      academicTags: ['Top Performer', 'Research-Oriented', 'Innovation-Driven'],
      riskLevel: 'Low',
      trend: 'up',
      status: 'Active',
      email: 'divya.menon@university.edu',
    },
    {
      id: 'STU007',
      rollNo: 'ME-A1-025',
      name: 'Karthik Iyer',
      batch: 'ME-A1',
      program: 'B.Tech',
      department: 'Mechanical',
      attendance: 72.8,
      gpa: 6.8,
      percentage: 68.0,
      academicClassification: 'Average',
      projectsCount: 2,
      projectType: ['Academic'],
      researchStatus: 'None',
      researchPapersCount: 0,
      publicationLevel: 'None',
      patentStatus: 'None',
      patentsCount: 0,
      innovationParticipation: false,
      academicTags: ['Academically At Risk'],
      riskLevel: 'Medium',
      trend: 'down',
      status: 'Active',
      email: 'karthik.iyer@university.edu',
    },
    {
      id: 'STU008',
      rollNo: 'ME-A1-026',
      name: 'Lakshmi Nair',
      batch: 'ME-A1',
      program: 'B.Tech',
      department: 'Mechanical',
      attendance: 89.5,
      gpa: 8.4,
      percentage: 84.0,
      academicClassification: 'Good',
      projectsCount: 3,
      projectType: ['Academic', 'Industry-based'],
      researchStatus: 'Co-author',
      researchPapersCount: 1,
      publicationLevel: 'College',
      patentStatus: 'None',
      patentsCount: 0,
      innovationParticipation: true,
      academicTags: ['Balanced Performer', 'Project-Focused'],
      riskLevel: 'Low',
      trend: 'up',
      status: 'Active',
      email: 'lakshmi.nair@university.edu',
    },
  ];

  const batches = ['All', 'CS-A3', 'CS-B3', 'ECE-A2', 'ECE-B2', 'ME-A1', 'ME-B1'];
  const departments = ['All', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];

  // Filter students
  const filteredStudents = allStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.batch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch;
    const matchesDepartment = selectedDepartment === 'all' || student.department === selectedDepartment;
    const matchesRisk = selectedRisk === 'all' || student.riskLevel === selectedRisk;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;

    // Advanced filters
    const matchesPercentage = percentageRange === 'all' || 
      (percentageRange === '90+' && student.percentage >= 90) ||
      (percentageRange === '75-90' && student.percentage >= 75 && student.percentage < 90) ||
      (percentageRange === '60-75' && student.percentage >= 60 && student.percentage < 75) ||
      (percentageRange === '40-60' && student.percentage >= 40 && student.percentage < 60);

    const matchesAcademicClass = academicClassification === 'all' || student.academicClassification === academicClassification;

    const matchesProjectsRange = projectsRange === 'all' ||
      (projectsRange === '0' && student.projectsCount === 0) ||
      (projectsRange === '1-2' && student.projectsCount >= 1 && student.projectsCount <= 2) ||
      (projectsRange === '3-5' && student.projectsCount >= 3 && student.projectsCount <= 5) ||
      (projectsRange === '5+' && student.projectsCount > 5);

    const matchesProjectTypes = selectedProjectTypes.length === 0 ||
      selectedProjectTypes.some(type => student.projectType.includes(type as ProjectType));

    const matchesResearchStatus = researchStatusFilter === 'all' || student.researchStatus === researchStatusFilter;

    const matchesPublicationLevel = publicationLevelFilter === 'all' || student.publicationLevel === publicationLevelFilter;

    const matchesPatentStatus = patentStatusFilter === 'all' || student.patentStatus === patentStatusFilter;

    const matchesInnovation = innovationFilter === 'all' ||
      (innovationFilter === 'yes' && student.innovationParticipation) ||
      (innovationFilter === 'no' && !student.innovationParticipation);

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => student.academicTags.includes(tag as AcademicTag));

    return matchesSearch && matchesBatch && matchesDepartment && matchesRisk && matchesStatus &&
           matchesPercentage && matchesAcademicClass && matchesProjectsRange && matchesProjectTypes &&
           matchesResearchStatus && matchesPublicationLevel && matchesPatentStatus && matchesInnovation && matchesTags;
  });

  const atRiskCount = allStudents.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium').length;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBatch('all');
    setSelectedDepartment('all');
    setSelectedRisk('all');
    setSelectedStatus('all');
    setPercentageRange('all');
    setAcademicClassification('all');
    setProjectsRange('all');
    setSelectedProjectTypes([]);
    setResearchStatusFilter('all');
    setPublicationLevelFilter('all');
    setPatentStatusFilter('all');
    setInnovationFilter('all');
    setSelectedTags([]);
  };

  const activeFiltersCount = 
    (selectedBatch !== 'all' ? 1 : 0) +
    (selectedDepartment !== 'all' ? 1 : 0) +
    (selectedRisk !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (percentageRange !== 'all' ? 1 : 0) +
    (academicClassification !== 'all' ? 1 : 0) +
    (projectsRange !== 'all' ? 1 : 0) +
    selectedProjectTypes.length +
    (researchStatusFilter !== 'all' ? 1 : 0) +
    (publicationLevelFilter !== 'all' ? 1 : 0) +
    (patentStatusFilter !== 'all' ? 1 : 0) +
    (innovationFilter !== 'all' ? 1 : 0) +
    selectedTags.length;

  const toggleProjectType = (type: string) => {
    setSelectedProjectTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const getTagColor = (tag: AcademicTag): string => {
    switch (tag) {
      case 'Top Performer':
        return 'bg-[#dbeafe] text-[#1e40af] border-[#93c5fd]';
      case 'Research-Oriented':
        return 'bg-[#e0e7ff] text-[#4338ca] border-[#a5b4fc]';
      case 'Project-Focused':
        return 'bg-[#d1fae5] text-[#065f46] border-[#86efac]';
      case 'Innovation-Driven':
        return 'bg-[#fef3c7] text-[#92400e] border-[#fcd34d]';
      case 'Academically At Risk':
        return 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]';
      case 'Balanced Performer':
        return 'bg-[#e5e7eb] text-[#374151] border-[#d1d5db]';
      default:
        return 'bg-[#f3f4f6] text-[#6b7280] border-[#d1d5db]';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[20px] text-[#111827] mb-1">Student Management</h1>
            <p className="text-[13px] text-[#6b7280]">
              View and manage student records, performance, and academic achievements
            </p>
          </div>
          <button className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Student
          </button>
        </div>
      </div>

      {/* Risk Alert Banner */}
      {atRiskCount > 0 && (
        <div className="bg-[#fef3c7] border border-[#fcd34d] p-4 mb-6 flex items-start gap-3">
          <div className="w-5 h-5 bg-[#d97706] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[11px]">!</span>
          </div>
          <div className="flex-1">
            <p className="text-[13px] text-[#111827] mb-1">
              <strong>{atRiskCount} students flagged for academic risk.</strong> Review performance trends and attendance patterns.
            </p>
            <button className="text-[13px] text-[#d97706] hover:underline">
              View detailed report →
            </button>
          </div>
        </div>
      )}

      {/* Basic Filters & Actions */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
            />
          </div>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Batches</option>
            {batches.filter(b => b !== 'All').map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Departments</option>
            {departments.filter(d => d !== 'All').map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-[13px] text-[#6b7280]">
              Showing {filteredStudents.length} of {allStudents.length} students
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[13px] text-[#6b7280] hover:text-[#111827] underline"
              >
                Reset all filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Columns
              </button>
              {showColumnSettings && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-[#d1d5db] shadow-lg z-10 w-56">
                  <div className="p-3">
                    <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">Toggle Columns</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.percentage}
                          onChange={() => toggleColumn('percentage')}
                          className="w-4 h-4"
                        />
                        Marks %
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.projectsCount}
                          onChange={() => toggleColumn('projectsCount')}
                          className="w-4 h-4"
                        />
                        Projects Count
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.researchPapersCount}
                          onChange={() => toggleColumn('researchPapersCount')}
                          className="w-4 h-4"
                        />
                        Research Papers
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.patentsCount}
                          onChange={() => toggleColumn('patentsCount')}
                          className="w-4 h-4"
                        />
                        Patents Count
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                        <input
                          type="checkbox"
                          checked={visibleColumns.academicTags}
                          onChange={() => toggleColumn('academicTags')}
                          className="w-4 h-4"
                        />
                        Academic Tags
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              More Filters
              {activeFiltersCount > 0 && (
                <span className="bg-[#111827] text-white text-[11px] px-1.5 py-0.5 rounded">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} />
            </button>
            <button className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showMoreFilters && (
        <div className="bg-white border border-[#d1d5db] p-6 mb-4">
          <h3 className="text-[14px] text-[#111827] mb-4">Advanced Academic Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Marks / Academic Performance */}
            <div>
              <label className="text-[12px] text-[#374151] mb-2 block uppercase tracking-wider">
                Marks / Academic Performance
              </label>
              <select
                value={percentageRange}
                onChange={(e) => setPercentageRange(e.target.value)}
                className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151] mb-3"
              >
                <option value="all">All Ranges</option>
                <option value="90+">90% and above (Excellent)</option>
                <option value="75-90">75% - 90% (Good)</option>
                <option value="60-75">60% - 75% (Average)</option>
                <option value="40-60">40% - 60% (Needs Improvement)</option>
              </select>
              <select
                value={academicClassification}
                onChange={(e) => setAcademicClassification(e.target.value)}
                className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
              >
                <option value="all">All Classifications</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>
            </div>

            {/* Projects */}
            <div>
              <label className="text-[12px] text-[#374151] mb-2 block uppercase tracking-wider">
                Projects
              </label>
              <select
                value={projectsRange}
                onChange={(e) => setProjectsRange(e.target.value)}
                className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151] mb-3"
              >
                <option value="all">All Project Counts</option>
                <option value="0">0 Projects</option>
                <option value="1-2">1-2 Projects</option>
                <option value="3-5">3-5 Projects</option>
                <option value="5+">5+ Projects</option>
              </select>
              <div className="space-y-2">
                <p className="text-[11px] text-[#6b7280] mb-1">Project Type:</p>
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                  <input
                    type="checkbox"
                    checked={selectedProjectTypes.includes('Academic')}
                    onChange={() => toggleProjectType('Academic')}
                    className="w-4 h-4"
                  />
                  Academic
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                  <input
                    type="checkbox"
                    checked={selectedProjectTypes.includes('Industry-based')}
                    onChange={() => toggleProjectType('Industry-based')}
                    className="w-4 h-4"
                  />
                  Industry-based
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                  <input
                    type="checkbox"
                    checked={selectedProjectTypes.includes('Capstone')}
                    onChange={() => toggleProjectType('Capstone')}
                    className="w-4 h-4"
                  />
                  Capstone
                </label>
              </div>
            </div>

            {/* Research Papers */}
            <div>
              <label className="text-[12px] text-[#374151] mb-2 block uppercase tracking-wider">
                Research Papers
              </label>
              <select
                value={researchStatusFilter}
                onChange={(e) => setResearchStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151] mb-3"
              >
                <option value="all">All Research Status</option>
                <option value="None">No Research</option>
                <option value="Co-author">Co-author</option>
                <option value="First author">First Author</option>
              </select>
              <select
                value={publicationLevelFilter}
                onChange={(e) => setPublicationLevelFilter(e.target.value)}
                className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
              >
                <option value="all">All Publication Levels</option>
                <option value="College">College Level</option>
                <option value="National">National Level</option>
                <option value="International">International Level</option>
              </select>
            </div>

            {/* Patents & Innovation */}
            <div>
              <label className="text-[12px] text-[#374151] mb-2 block uppercase tracking-wider">
                Patents & Innovation
              </label>
              <select
                value={patentStatusFilter}
                onChange={(e) => setPatentStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151] mb-3"
              >
                <option value="all">All Patent Status</option>
                <option value="None">No Patents</option>
                <option value="Filed">Filed</option>
                <option value="Published">Published</option>
                <option value="Granted">Granted</option>
              </select>
              <select
                value={innovationFilter}
                onChange={(e) => setInnovationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
              >
                <option value="all">Innovation Participation</option>
                <option value="yes">Participated</option>
                <option value="no">Not Participated</option>
              </select>
            </div>

            {/* Academic Tags */}
            <div className="lg:col-span-2">
              <label className="text-[12px] text-[#374151] mb-2 block uppercase tracking-wider">
                Academic Classification Tags
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Top Performer', 'Research-Oriented', 'Project-Focused', 'Innovation-Driven', 'Academically At Risk', 'Balanced Performer'].map((tag) => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer text-[13px] text-[#374151]">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="w-4 h-4"
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Table */}
      <div className="bg-white border border-[#d1d5db]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Roll Number
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Student Name
                </th>
                <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Batch
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Attendance
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  GPA
                </th>
                {visibleColumns.percentage && (
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Marks %
                  </th>
                )}
                {visibleColumns.projectsCount && (
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Projects
                  </th>
                )}
                {visibleColumns.researchPapersCount && (
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Research
                  </th>
                )}
                {visibleColumns.patentsCount && (
                  <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Patents
                  </th>
                )}
                {visibleColumns.academicTags && (
                  <th className="text-left text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                    Academic Tags
                  </th>
                )}
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Risk Level
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Trend
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-center text-[11px] text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{student.rollNo}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#e5e7eb] rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-[#6b7280]" />
                      </div>
                      <div>
                        <div className="text-[13px] text-[#111827]">{student.name}</div>
                        <div className="text-[11px] text-[#9ca3af]">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#374151]">{student.batch}</td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`text-[13px] ${
                        student.attendance >= 85
                          ? 'text-[#059669]'
                          : student.attendance >= 75
                          ? 'text-[#d97706]'
                          : 'text-[#dc2626]'
                      }`}
                    >
                      {student.attendance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`text-[13px] ${
                        student.gpa >= 8.0
                          ? 'text-[#059669]'
                          : student.gpa >= 7.0
                          ? 'text-[#d97706]'
                          : 'text-[#dc2626]'
                      }`}
                    >
                      {student.gpa.toFixed(1)}
                    </span>
                  </td>
                  {visibleColumns.percentage && (
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`text-[13px] ${
                          student.percentage >= 90
                            ? 'text-[#059669]'
                            : student.percentage >= 75
                            ? 'text-[#2563eb]'
                            : student.percentage >= 60
                            ? 'text-[#d97706]'
                            : 'text-[#dc2626]'
                        }`}
                      >
                        {student.percentage.toFixed(1)}%
                      </span>
                    </td>
                  )}
                  {visibleColumns.projectsCount && (
                    <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                      {student.projectsCount}
                    </td>
                  )}
                  {visibleColumns.researchPapersCount && (
                    <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                      {student.researchPapersCount}
                    </td>
                  )}
                  {visibleColumns.patentsCount && (
                    <td className="px-5 py-4 text-center text-[13px] text-[#374151]">
                      {student.patentsCount}
                    </td>
                  )}
                  {visibleColumns.academicTags && (
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.academicTags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className={`inline-block px-2 py-0.5 text-[10px] border ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {student.academicTags.length > 2 && (
                          <span className="inline-block px-2 py-0.5 text-[10px] text-[#6b7280]">
                            +{student.academicTags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-block px-2 py-1 text-[11px] border ${
                        student.riskLevel === 'High'
                          ? 'bg-[#fee2e2] border-[#fca5a5] text-[#dc2626]'
                          : student.riskLevel === 'Medium'
                          ? 'bg-[#fef3c7] border-[#fcd34d] text-[#d97706]'
                          : 'bg-[#d1fae5] border-[#86efac] text-[#059669]'
                      }`}
                    >
                      {student.riskLevel}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      {student.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-[#059669]" />
                      ) : student.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-[#dc2626]" />
                      ) : (
                        <div className="w-1 h-1 bg-[#6b7280] rounded-full" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Circle
                        className={`w-2 h-2 ${
                          student.status === 'Active' ? 'fill-[#059669] text-[#059669]' : 'fill-[#dc2626] text-[#dc2626]'
                        }`}
                      />
                      <span className="text-[13px] text-[#374151]">{student.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button className="text-[#6b7280] hover:text-[#111827]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

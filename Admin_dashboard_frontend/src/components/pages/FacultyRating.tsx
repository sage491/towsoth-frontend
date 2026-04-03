import { useState } from 'react';
import { Search, X, Star, FileText, Award, Users, TrendingUp, Filter, SlidersHorizontal } from 'lucide-react';

interface Faculty {
  id: string;
  name: string;
  empId: string;
  department: string;
  designation: string;
  subjectKnowledge: number;
  teachingEffectiveness: number;
  communication: number;
  studentFeedback: number;
  researchPapers: number;
  patents: number;
  overallRating: number;
  photoUrl?: string;
}

export function FacultyRating() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [minSubjectKnowledge, setMinSubjectKnowledge] = useState(1);
  const [minTeachingEffectiveness, setMinTeachingEffectiveness] = useState(1);
  const [minCommunication, setMinCommunication] = useState(1);
  const [minStudentFeedback, setMinStudentFeedback] = useState(1);
  const [minResearchPapers, setMinResearchPapers] = useState(0);
  const [minPatents, setMinPatents] = useState(0);
  const [researchActiveOnly, setResearchActiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'research' | 'teaching'>('rating');

  // Mock faculty data
  const allFaculty: Faculty[] = [
    {
      id: 'FAC001',
      name: 'Dr. Rajesh Sharma',
      empId: 'EMP-CS-001',
      department: 'Computer Science',
      designation: 'Professor',
      subjectKnowledge: 4.8,
      teachingEffectiveness: 4.6,
      communication: 4.7,
      studentFeedback: 4.5,
      researchPapers: 45,
      patents: 8,
      overallRating: 4.65,
    },
    {
      id: 'FAC002',
      name: 'Prof. Anita Kumar',
      empId: 'EMP-CS-002',
      department: 'Computer Science',
      designation: 'Associate Professor',
      subjectKnowledge: 4.5,
      teachingEffectiveness: 4.8,
      communication: 4.6,
      studentFeedback: 4.7,
      researchPapers: 28,
      patents: 4,
      overallRating: 4.65,
    },
    {
      id: 'FAC003',
      name: 'Dr. Vikram Patel',
      empId: 'EMP-CS-003',
      department: 'Computer Science',
      designation: 'Professor',
      subjectKnowledge: 4.9,
      teachingEffectiveness: 4.7,
      communication: 4.5,
      studentFeedback: 4.6,
      researchPapers: 62,
      patents: 12,
      overallRating: 4.68,
    },
    {
      id: 'FAC004',
      name: 'Dr. Meera Rao',
      empId: 'EMP-EC-001',
      department: 'Electronics',
      designation: 'Professor',
      subjectKnowledge: 4.7,
      teachingEffectiveness: 4.5,
      communication: 4.4,
      studentFeedback: 4.5,
      researchPapers: 38,
      patents: 6,
      overallRating: 4.53,
    },
    {
      id: 'FAC005',
      name: 'Prof. Amit Verma',
      empId: 'EMP-ME-001',
      department: 'Mechanical',
      designation: 'Associate Professor',
      subjectKnowledge: 4.3,
      teachingEffectiveness: 4.4,
      communication: 4.2,
      studentFeedback: 4.3,
      researchPapers: 22,
      patents: 3,
      overallRating: 4.30,
    },
    {
      id: 'FAC006',
      name: 'Dr. Priya Singh',
      empId: 'EMP-EC-002',
      department: 'Electronics',
      designation: 'Assistant Professor',
      subjectKnowledge: 4.6,
      teachingEffectiveness: 4.7,
      communication: 4.8,
      studentFeedback: 4.6,
      researchPapers: 18,
      patents: 2,
      overallRating: 4.68,
    },
    {
      id: 'FAC007',
      name: 'Prof. Suresh Reddy',
      empId: 'EMP-ME-002',
      department: 'Mechanical',
      designation: 'Professor',
      subjectKnowledge: 4.4,
      teachingEffectiveness: 4.3,
      communication: 4.1,
      studentFeedback: 4.2,
      researchPapers: 34,
      patents: 5,
      overallRating: 4.25,
    },
    {
      id: 'FAC008',
      name: 'Dr. Kavita Nair',
      empId: 'EMP-CS-004',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      subjectKnowledge: 4.5,
      teachingEffectiveness: 4.6,
      communication: 4.7,
      studentFeedback: 4.5,
      researchPapers: 15,
      patents: 1,
      overallRating: 4.58,
    },
  ];

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical'];

  // Filter faculty
  const filteredFaculty = allFaculty.filter((faculty) => {
    // Search filter
    const matchesSearch = 
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase());

    // Department filter
    const matchesDepartment = 
      selectedDepartments.length === 0 || selectedDepartments.includes(faculty.department);

    // Rating filters
    const matchesSubjectKnowledge = faculty.subjectKnowledge >= minSubjectKnowledge;
    const matchesTeaching = faculty.teachingEffectiveness >= minTeachingEffectiveness;
    const matchesCommunication = faculty.communication >= minCommunication;
    const matchesFeedback = faculty.studentFeedback >= minStudentFeedback;

    // Research filters
    const matchesResearchPapers = faculty.researchPapers >= minResearchPapers;
    const matchesPatents = faculty.patents >= minPatents;
    const matchesResearchActive = !researchActiveOnly || (faculty.researchPapers > 0 || faculty.patents > 0);

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesSubjectKnowledge &&
      matchesTeaching &&
      matchesCommunication &&
      matchesFeedback &&
      matchesResearchPapers &&
      matchesPatents &&
      matchesResearchActive
    );
  });

  // Sort faculty
  const sortedFaculty = [...filteredFaculty].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.overallRating - a.overallRating;
      case 'research':
        return (b.researchPapers + b.patents * 2) - (a.researchPapers + a.patents * 2);
      case 'teaching':
        return b.teachingEffectiveness - a.teachingEffectiveness;
      default:
        return 0;
    }
  });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepartments([]);
    setMinSubjectKnowledge(1);
    setMinTeachingEffectiveness(1);
    setMinCommunication(1);
    setMinStudentFeedback(1);
    setMinResearchPapers(0);
    setMinPatents(0);
    setResearchActiveOnly(false);
    setSortBy('rating');
  };

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 flex-shrink-0 ${
              star <= Math.round(rating)
                ? 'fill-[#f59e0b] text-[#f59e0b]'
                : 'text-[#d1d5db]'
            }`}
          />
        ))}
      </div>
    );
  };

  const activeFiltersCount = 
    selectedDepartments.length +
    (minSubjectKnowledge > 1 ? 1 : 0) +
    (minTeachingEffectiveness > 1 ? 1 : 0) +
    (minCommunication > 1 ? 1 : 0) +
    (minStudentFeedback > 1 ? 1 : 0) +
    (minResearchPapers > 0 ? 1 : 0) +
    (minPatents > 0 ? 1 : 0) +
    (researchActiveOnly ? 1 : 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] text-[#111827] mb-1">Faculty Rating & Evaluation</h1>
        <p className="text-[13px] text-[#6b7280]">
          Filter, compare, and evaluate faculty based on performance metrics
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white border border-[#d1d5db] p-4 mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search by name, employee ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151]"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-[#d1d5db] text-[13px] focus:outline-none focus:border-[#374151] min-w-[200px]"
        >
          <option value="rating">Highest Rated First</option>
          <option value="research">Most Research Output</option>
          <option value="teaching">Best Teaching Effectiveness</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-[#d1d5db] text-[13px] hover:bg-[#f9fafb] flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-[#111827] text-white text-[11px] px-1.5 py-0.5 rounded">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-[#d1d5db] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[15px] text-[#111827]">Filter Criteria</h2>
                <button
                  onClick={resetFilters}
                  className="text-[13px] text-[#6b7280] hover:text-[#111827] flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Department Filter */}
                <div>
                  <label className="text-[12px] text-[#374151] mb-3 block uppercase tracking-wider">
                    Department
                  </label>
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <label key={dept} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept)}
                          onChange={() => toggleDepartment(dept)}
                          className="w-4 h-4 border-[#d1d5db] text-[#111827] focus:ring-0"
                        />
                        <span className="text-[13px] text-[#374151]">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subject Knowledge Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Subject Knowledge
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minSubjectKnowledge.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minSubjectKnowledge}
                    onChange={(e) => setMinSubjectKnowledge(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Teaching Effectiveness Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Teaching Effectiveness
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minTeachingEffectiveness.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minTeachingEffectiveness}
                    onChange={(e) => setMinTeachingEffectiveness(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Communication Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Communication Skills
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minCommunication.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minCommunication}
                    onChange={(e) => setMinCommunication(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Student Feedback Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Student Feedback Score
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minStudentFeedback.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={minStudentFeedback}
                    onChange={(e) => setMinStudentFeedback(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Research Papers Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Research Papers
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minResearchPapers}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="70"
                    step="1"
                    value={minResearchPapers}
                    onChange={(e) => setMinResearchPapers(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>0</span>
                    <span>70+</span>
                  </div>
                </div>

                {/* Patents Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-[#374151] uppercase tracking-wider">
                      Patents
                    </label>
                    <span className="text-[13px] text-[#111827]">Min: {minPatents}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={minPatents}
                    onChange={(e) => setMinPatents(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#e5e7eb] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                    <span>0</span>
                    <span>15+</span>
                  </div>
                </div>

                {/* Research Active Toggle */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={researchActiveOnly}
                      onChange={(e) => setResearchActiveOnly(e.target.checked)}
                      className="w-4 h-4 border-[#d1d5db] text-[#111827] focus:ring-0"
                    />
                    <span className="text-[13px] text-[#374151]">Show research-active faculty only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Faculty Cards Grid */}
        <div className="flex-1">
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-[13px] text-[#6b7280]">
              Showing {sortedFaculty.length} of {allFaculty.length} faculty members
            </p>
          </div>

          {/* Faculty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedFaculty.map((faculty) => (
              <div
                key={faculty.id}
                className="bg-white border border-[#d1d5db] p-5 hover:border-[#9ca3af] transition-colors h-full flex flex-col overflow-hidden box-border"
              >
                {/* Faculty Header with Avatar, Name, and Overall Rating */}
                <div className="flex items-start gap-4 mb-5 pb-5 border-b border-[#e5e7eb]">
                  {/* Avatar and Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-14 h-14 bg-[#e5e7eb] rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-[#6b7280]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] text-[#111827] mb-1 truncate">{faculty.name}</h3>
                      <p className="text-[12px] text-[#6b7280] truncate">{faculty.designation}</p>
                      <p className="text-[11px] text-[#9ca3af] truncate">{faculty.department}</p>
                    </div>
                  </div>
                  
                  {/* Overall Rating */}
                  <div className="text-center flex-shrink-0 w-16">
                    <div className="text-[32px] text-[#111827] leading-none mb-1.5">
                      {faculty.overallRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-1">
                      {renderStars(faculty.overallRating)}
                    </div>
                    <p className="text-[10px] text-[#6b7280] uppercase tracking-wider leading-tight">
                      Overall<br/>Rating
                    </p>
                  </div>
                </div>

                {/* Performance Metrics - Stacked */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Subject Knowledge</span>
                    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      <span className="text-[15px] text-[#111827] w-8 text-right">
                        {faculty.subjectKnowledge.toFixed(1)}
                      </span>
                      {renderStars(faculty.subjectKnowledge)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Teaching Effectiveness</span>
                    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      <span className="text-[15px] text-[#111827] w-8 text-right">
                        {faculty.teachingEffectiveness.toFixed(1)}
                      </span>
                      {renderStars(faculty.teachingEffectiveness)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Communication Skills</span>
                    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      <span className="text-[15px] text-[#111827] w-8 text-right">
                        {faculty.communication.toFixed(1)}
                      </span>
                      {renderStars(faculty.communication)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6b7280] flex-shrink truncate">Student Feedback</span>
                    <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      <span className="text-[15px] text-[#111827] w-8 text-right">
                        {faculty.studentFeedback.toFixed(1)}
                      </span>
                      {renderStars(faculty.studentFeedback)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedFaculty.length === 0 && (
            <div className="bg-white border border-[#d1d5db] p-12 text-center">
              <Filter className="w-12 h-12 text-[#d1d5db] mx-auto mb-4" />
              <h3 className="text-[15px] text-[#111827] mb-2">No faculty found</h3>
              <p className="text-[13px] text-[#6b7280] mb-4">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#111827] text-white text-[13px] hover:bg-[#374151] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
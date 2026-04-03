import { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';

interface VisibleColumns {
  percentage: boolean;
  projectsCount: boolean;
  researchPapersCount: boolean;
  patentsCount: boolean;
  academicTags: boolean;
}

export function useStudentManagementTableData() {
  const data = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStream, setSelectedStream] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [percentageRange, setPercentageRange] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    percentage: false,
    projectsCount: false,
    researchPapersCount: false,
    patentsCount: false,
    academicTags: true,
  });

  const enrichedStudents = useMemo(() => {
    return data.students.map((student) => {
      const stream = data.getStreamById(student.streamId);
      const batch = data.getBatchById(student.batchId);
      const attendance = data.getStudentAttendance(student.id);
      const gpa = data.getStudentGPA(student.id);
      const percentage = data.getStudentPercentage(student.id);
      const riskLevel = data.getStudentRiskLevel(student.id);
      const trend = data.getStudentTrend(student.id);
      const academicTags = data.getStudentAcademicTags(student.id);
      const projects = data.getStudentProjects(student.id);
      const papers = data.getStudentResearchPapers(student.id);
      const patents = data.getStudentPatents(student.id);

      return {
        ...student,
        streamName: stream?.name || 'Unknown',
        streamCode: stream?.code || '',
        batchName: batch?.name || 'Unknown',
        attendance,
        gpa,
        percentage,
        riskLevel,
        trend,
        academicTags,
        projectsCount: projects.length,
        researchPapersCount: papers.length,
        patentsCount: patents.length,
      };
    });
  }, [data]);

  const filteredStudents = useMemo(() => {
    return enrichedStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.batchName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStream = selectedStream === 'all' || student.streamId === selectedStream;
      const matchesBatch = selectedBatch === 'all' || student.batchId === selectedBatch;
      const matchesRisk = selectedRisk === 'all' || student.riskLevel === selectedRisk;
      const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;

      const matchesPercentage =
        percentageRange === 'all' ||
        (percentageRange === '90+' && student.percentage >= 90) ||
        (percentageRange === '75-90' && student.percentage >= 75 && student.percentage < 90) ||
        (percentageRange === '60-75' && student.percentage >= 60 && student.percentage < 75) ||
        (percentageRange === '40-60' && student.percentage >= 40 && student.percentage < 60);

      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => student.academicTags.includes(tag));

      return (
        matchesSearch &&
        matchesStream &&
        matchesBatch &&
        matchesRisk &&
        matchesStatus &&
        matchesPercentage &&
        matchesTags
      );
    });
  }, [
    enrichedStudents,
    searchTerm,
    selectedStream,
    selectedBatch,
    selectedRisk,
    selectedStatus,
    percentageRange,
    selectedTags,
  ]);

  const availableBatches = useMemo(() => {
    if (selectedStream === 'all') {
      return data.batches;
    }
    return data.getBatchesByStream(selectedStream);
  }, [selectedStream, data]);

  const atRiskCount = enrichedStudents.filter(
    (student) => student.riskLevel === 'High' || student.riskLevel === 'Medium',
  ).length;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBatch('all');
    setSelectedStream('all');
    setSelectedRisk('all');
    setSelectedStatus('all');
    setPercentageRange('all');
    setSelectedTags([]);
  };

  const activeFiltersCount =
    (selectedStream !== 'all' ? 1 : 0) +
    (selectedBatch !== 'all' ? 1 : 0) +
    (selectedRisk !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (percentageRange !== 'all' ? 1 : 0) +
    selectedTags.length;

  const toggleTag = (tag: string) => {
    setSelectedTags((previous) =>
      previous.includes(tag) ? previous.filter((existingTag) => existingTag !== tag) : [...previous, tag],
    );
  };

  const toggleColumn = (column: keyof VisibleColumns) => {
    setVisibleColumns((previous) => ({ ...previous, [column]: !previous[column] }));
  };

  return {
    data,
    searchTerm,
    setSearchTerm,
    selectedBatch,
    setSelectedBatch,
    selectedStream,
    setSelectedStream,
    selectedRisk,
    setSelectedRisk,
    selectedStatus,
    setSelectedStatus,
    showMoreFilters,
    setShowMoreFilters,
    percentageRange,
    setPercentageRange,
    selectedTags,
    showColumnSettings,
    setShowColumnSettings,
    visibleColumns,
    filteredStudents,
    availableBatches,
    atRiskCount,
    resetFilters,
    activeFiltersCount,
    toggleTag,
    toggleColumn,
    enrichedStudents,
  };
}

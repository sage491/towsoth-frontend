import { useMemo, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { buildStudentSummaryStats } from '../services/management/studentService';

const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

export function useStudentManagementData() {
  const data = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const students = useMemo(() => {
    return data.students.map((student) => {
      const batch = data.getBatchById(student.batchId);
      const attendance = data.getStudentAttendance(student.id);
      const gpa = data.getStudentGPA(student.id);
      const risk = data.getStudentRiskLevel(student.id);
      const trend = data.getStudentTrend(student.id);

      return {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo,
        batch: batch?.name ?? 'Unknown',
        attendance: formatPercent(attendance),
        performance: gpa.toFixed(1),
        status: student.status,
        risk,
        trend,
      };
    });
  }, [data]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        student.name.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query) ||
        student.batch.toLowerCase().includes(query);

      const numericAttendance = Number.parseFloat(student.attendance.replace('%', ''));
      const numericPerformance = Number.parseFloat(student.performance);

      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'high-risk' && student.risk === 'High') ||
        (selectedFilter === 'low-attendance' && numericAttendance < 75) ||
        (selectedFilter === 'high-performers' && numericPerformance >= 8.5);

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter, students]);

  const tableData = filteredStudents.map((student) => ({
    ...student,
    riskBadge: (
      <span
        className={`px-2 py-1 text-[11px] border ${
          student.risk === 'High'
            ? 'bg-[#fee2e2] border-[#fca5a5] text-[#dc2626]'
            : student.risk === 'Medium'
              ? 'bg-[#fef3c7] border-[#fcd34d] text-[#d97706]'
              : 'bg-[#d1fae5] border-[#86efac] text-[#059669]'
        }`}
      >
        {student.risk}
      </span>
    ),
    trendIcon: (
      <div className="flex justify-center">
        {student.trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-[#059669]" />
        ) : student.trend === 'down' ? (
          <TrendingDown className="w-4 h-4 text-[#dc2626]" />
        ) : (
          <div className="w-1 h-1 bg-[#6b7280] rounded-full" />
        )}
      </div>
    ),
  }));

  const summary = useMemo(() => buildStudentSummaryStats(data), [data]);

  return {
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    tableData,
    summary,
  };
}

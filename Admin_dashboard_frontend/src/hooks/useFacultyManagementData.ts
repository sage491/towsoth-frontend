import { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import {
  buildFacultyRows,
  buildFacultyStats,
  buildLoadDistribution,
  buildSubjectDistribution,
} from '../services/management/facultyService';

export function useFacultyManagementData() {
  const data = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const facultyRows = useMemo(() => buildFacultyRows(data), [data]);

  const filteredRows = useMemo(() => {
    return facultyRows.filter((row) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        row.name.toLowerCase().includes(query) ||
        row.empId.toLowerCase().includes(query) ||
        row.department.toLowerCase().includes(query);
      const matchesDepartment = selectedDepartment === 'all' || row.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [facultyRows, searchTerm, selectedDepartment]);

  const departments = useMemo(
    () => ['all', ...new Set(facultyRows.map((row) => row.department))],
    [facultyRows],
  );

  const stats = useMemo(() => buildFacultyStats(facultyRows), [facultyRows]);
  const subjectDistribution = useMemo(() => buildSubjectDistribution(data), [data]);
  const loadDistribution = useMemo(() => buildLoadDistribution(facultyRows), [facultyRows]);

  return {
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    facultyRows,
    filteredRows,
    stats,
    subjectDistribution,
    loadDistribution,
  };
}

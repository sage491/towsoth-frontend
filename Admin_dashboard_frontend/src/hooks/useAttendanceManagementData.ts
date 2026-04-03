import { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';

export function useAttendanceManagementData() {
  const data = useData();
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const availableBatches = useMemo(() => {
    if (!selectedStream) {
      return [];
    }
    return data.getBatchesByStream(selectedStream);
  }, [data, selectedStream]);

  const availableSubjects = useMemo(() => {
    if (!selectedBatch) {
      return [];
    }
    return data.getSubjectsByBatch(selectedBatch);
  }, [data, selectedBatch]);

  const students = useMemo(() => {
    if (!selectedBatch) {
      return [];
    }

    return data.getStudentsByBatch(selectedBatch).sort((a, b) => a.rollNo.localeCompare(b.rollNo));
  }, [data, selectedBatch]);

  const studentAttendanceData = useMemo(() => {
    if (!selectedBatch) {
      return [];
    }

    return students.map((student) => {
      const overallAttendance = data.getStudentAttendance(student.id);

      const studentRecords = data.attendanceRecords.filter((record) => {
        if (selectedSubject) {
          return record.studentId === student.id && record.subjectId === selectedSubject;
        }

        return record.studentId === student.id;
      });

      const totalClasses = studentRecords.length;
      const presentCount = studentRecords.filter((record) => record.status === 'Present').length;
      const absentCount = studentRecords.filter((record) => record.status === 'Absent').length;
      const lateCount = studentRecords.filter((record) => record.status === 'Late').length;
      const excusedCount = studentRecords.filter((record) => record.status === 'Excused').length;

      const attendancePercentage = totalClasses
        ? Math.round(((presentCount + lateCount) / totalClasses) * 100)
        : overallAttendance;

      let status: 'Excellent' | 'Good' | 'Warning' | 'Critical' = 'Excellent';
      if (attendancePercentage < 75) {
        status = 'Critical';
      } else if (attendancePercentage < 85) {
        status = 'Warning';
      } else if (attendancePercentage < 95) {
        status = 'Good';
      }

      return {
        student,
        totalClasses,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        status,
        attendancePercentage,
      };
    });
  }, [data, selectedBatch, selectedSubject, students]);

  const batchSummary = useMemo(() => {
    if (!studentAttendanceData.length) {
      return {
        totalStudents: 0,
        avgAttendance: 0,
        excellent: 0,
        good: 0,
        warning: 0,
        critical: 0,
      };
    }

    const totalStudents = studentAttendanceData.length;
    const avgAttendance = Math.round(
      studentAttendanceData.reduce((sum, student) => sum + student.attendancePercentage, 0) / totalStudents,
    );

    return {
      totalStudents,
      avgAttendance,
      excellent: studentAttendanceData.filter((student) => student.status === 'Excellent').length,
      good: studentAttendanceData.filter((student) => student.status === 'Good').length,
      warning: studentAttendanceData.filter((student) => student.status === 'Warning').length,
      critical: studentAttendanceData.filter((student) => student.status === 'Critical').length,
    };
  }, [studentAttendanceData]);

  const handleStreamChange = (streamId: string) => {
    setSelectedStream(streamId);
    setSelectedBatch('');
    setSelectedSubject('');
  };

  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(batchId);
    setSelectedSubject('');
  };

  return {
    selectedStream,
    selectedBatch,
    selectedSubject,
    setSelectedSubject,
    handleStreamChange,
    handleBatchChange,
    availableBatches,
    availableSubjects,
    studentAttendanceData,
    batchSummary,
    selectedStreamData: selectedStream ? data.getStreamById(selectedStream) : null,
    selectedBatchData: selectedBatch ? data.getBatchById(selectedBatch) : null,
    selectedSubjectData: selectedSubject ? data.getSubjectById(selectedSubject) : null,
    streams: data.streams,
  };
}

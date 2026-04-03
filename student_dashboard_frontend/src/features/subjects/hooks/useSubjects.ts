import { useQuery } from "@tanstack/react-query";
import {
  getMySubjectsCourses,
  getMySubjectsLearningTabs,
  getMySubjectsStudentData,
  getOptimizedStudyOrder,
  getSubjectsPageSubjects,
} from "@/features/subjects/services";

export function useSubjectsData() {
  const subjects = useQuery({ queryKey: ["subjects", "page"], queryFn: () => Promise.resolve(getSubjectsPageSubjects()) });
  const studyOrder = useQuery({ queryKey: ["subjects", "study-order"], queryFn: () => Promise.resolve(getOptimizedStudyOrder()) });
  const courses = useQuery({ queryKey: ["subjects", "courses"], queryFn: () => Promise.resolve(getMySubjectsCourses()) });
  const tabs = useQuery({ queryKey: ["subjects", "tabs"], queryFn: () => Promise.resolve(getMySubjectsLearningTabs()) });
  const studentData = useQuery({ queryKey: ["subjects", "student-data"], queryFn: () => Promise.resolve(getMySubjectsStudentData()) });

  return { subjects, studyOrder, courses, tabs, studentData };
}

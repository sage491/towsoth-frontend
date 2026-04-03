import type { MySubjectsCourse } from '@/features/student/subjects/types';

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getSubjectSlug(course: MySubjectsCourse): string {
  return toSlug(course.title);
}

export function findCourseBySlug(courses: MySubjectsCourse[], slug?: string): MySubjectsCourse | undefined {
  if (!slug) return undefined;

  return courses.find((course) => {
    return getSubjectSlug(course) === slug || String(course.id) === slug;
  });
}

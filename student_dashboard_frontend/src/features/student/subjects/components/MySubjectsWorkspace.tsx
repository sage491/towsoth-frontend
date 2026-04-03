import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SubjectNavigationWrapper } from '@/features/subjects/components';
import { useSubjectsData } from '@/features/subjects/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import type { RoutePath } from '@/shared/config/routes';
import { ROUTES } from '@/shared/config/routes';
import { findCourseBySlug, getSubjectSlug } from '@/features/subjects/utils/routing';

interface MySubjectsWorkspaceProps {
  onNavigate: (page: RoutePath) => void;
  setCourseSelected?: (selected: boolean) => void;
  focusModeActive?: boolean;
  onExitFocusMode?: () => void;
}

export function MySubjectsWorkspace({ onNavigate: _onNavigate, setCourseSelected, focusModeActive: _focusModeActive = false, onExitFocusMode: _onExitFocusMode }: MySubjectsWorkspaceProps) {
  const { courses: coursesQuery } = useSubjectsData();
  const courses = coursesQuery.data ?? [];
  const navigate = useNavigate();
  const { subjectSlug, topicSlug, subtopicSlug } = useParams<{ subjectSlug?: string; topicSlug?: string; subtopicSlug?: string }>();

  const selectedCourseData = useMemo(() => {
    return findCourseBySlug(courses, subjectSlug);
  }, [courses, subjectSlug]);

  const handleCourseClick = (courseSlug: string) => {
    navigate(`${ROUTES.student["my-subjects"]}/${courseSlug}`);
    if (setCourseSelected) {
      setCourseSelected(true);
    }
  };

  const handleBackToCourses = () => {
    navigate(ROUTES.student["my-subjects"]);
    if (setCourseSelected) {
      setCourseSelected(false);
    }
  };

  const isCourseDetailView = Boolean(selectedCourseData);

  useEffect(() => {
    if (!setCourseSelected) return;
    setCourseSelected(isCourseDetailView);
  }, [isCourseDetailView, setCourseSelected]);

  if (coursesQuery.isLoading) {
    return (
      <div className="min-h-screen px-6 py-8 pt-[64px]" style={{ background: 'var(--bg-secondary)' }}>
        <Skeleton className="h-16 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Course Grid View */}
      {!isCourseDetailView && (
        <div className="px-6 py-8 pt-[64px]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">My Subjects</h1>
            <p className="text-sm text-slate-600">
              Select a course to access learning materials, practice sets, and analytics
            </p>
          </div>
          
          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div 
                key={course.id}
                onClick={() => handleCourseClick(getSubjectSlug(course))}
                className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: '#1a1a1a' }}
              >
                {/* Pattern Header */}
                <div className="relative h-36 overflow-hidden">
                  {/* Red indicator dot */}
                  <div className="absolute top-3 left-3 w-2 h-2 bg-red-500 rounded-full z-10"></div>
                  
                  {/* Pattern backgrounds */}
                  {course.pattern === 'teal-grid' && (
                    <div className="w-full h-full" style={{ 
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      backgroundImage: `
                        repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 20px, rgba(255,255,255,0.1) 21px),
                        repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 20px, rgba(255,255,255,0.1) 21px)
                      `
                    }}></div>
                  )}
                  
                  {course.pattern === 'yellow-triangle' && (
                    <div className="w-full h-full relative" style={{ background: '#fbbf24' }}>
                      <div className="absolute inset-0" style={{
                        background: `linear-gradient(135deg, rgba(245,158,11,0.3) 25%, transparent 25%, transparent 75%, rgba(245,158,11,0.3) 75%, rgba(245,158,11,0.3)),
                                   linear-gradient(135deg, rgba(245,158,11,0.3) 25%, transparent 25%, transparent 75%, rgba(245,158,11,0.3) 75%, rgba(245,158,11,0.3))`,
                        backgroundSize: '40px 40px',
                        backgroundPosition: '0 0, 20px 20px'
                      }}></div>
                    </div>
                  )}
                  
                  {course.pattern === 'beige-circle' && (
                    <div className="w-full h-full" style={{ 
                      background: 'linear-gradient(135deg, #d4c5a9 0%, #b8a57d 100%)',
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 20%, transparent 20%),
                                      radial-gradient(circle, rgba(0,0,0,0.1) 20%, transparent 20%)`,
                      backgroundSize: '60px 60px',
                      backgroundPosition: '0 0, 30px 30px'
                    }}></div>
                  )}
                  
                  {course.pattern === 'gray-ring' && (
                    <div className="w-full h-full" style={{ 
                      background: '#9ca3af',
                      backgroundImage: `radial-gradient(circle, transparent 30%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 35%, transparent 35%)`,
                      backgroundSize: '50px 50px'
                    }}></div>
                  )}
                  
                  {course.pattern === 'cyan-plaid' && (
                    <div className="w-full h-full" style={{ 
                      background: '#06b6d4',
                      backgroundImage: `
                        repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, transparent 2px, transparent 15px, rgba(255,255,255,0.15) 17px),
                        repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0px, transparent 2px, transparent 15px, rgba(255,255,255,0.15) 17px),
                        repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 3px, transparent 45px, rgba(0,0,0,0.1) 48px),
                        repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 3px, transparent 45px, rgba(0,0,0,0.1) 48px)
                      `
                    }}></div>
                  )}
                  
                  {course.pattern === 'pink-gradient' && (
                    <div className="w-full h-full" style={{ 
                      background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fbcfe8 100%)',
                      backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)`,
                      backgroundSize: '60px 60px'
                    }}></div>
                  )}
                </div>
                
                {/* Course Info Footer */}
                <div className="p-4">
                  <div className="text-xs font-semibold mb-3" style={{ color: '#ffffff' }}>
                    {course.code} :: {course.title}
                  </div>
                  
                  {/* Instructor */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-800">
                        {course.instructor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>
                        {course.instructor.name}
                      </div>
                      <div className="text-[10px]" style={{ color: '#999999' }}>
                        Instructor
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Detail View - Always Show Topic View */}
      {isCourseDetailView && selectedCourseData && (
        <SubjectNavigationWrapper
          subject={selectedCourseData.title}
          subjectSlug={getSubjectSlug(selectedCourseData)}
          topicSlug={topicSlug}
          subtopicSlug={subtopicSlug}
          onBack={handleBackToCourses}
          onBackToSubjects={handleBackToCourses}
        />
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, Video, FileText, Play, CheckCircle2, Bookmark, BookmarkCheck, Target, Calendar, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getEnterpriseTopicContent, type EnterpriseMaterial, type EnterpriseVideo } from '@/services/subjectResourceService';

interface EnterpriseTopicViewProps {
  subject: string;
  topic: string;
  topicDescription: string;
  onBack: () => void;
  onNavigateToSubject: () => void;
  onNavigateToChapter: () => void;
}

export function EnterpriseTopicView({ 
  subject, 
  topic, 
  topicDescription,
  onBack, 
  onNavigateToSubject,
  onNavigateToChapter 
}: EnterpriseTopicViewProps) {
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>(['v1']);
  const [completedVideos, setCompletedVideos] = useState<string[]>(['v1']);
  const [videoLectures, setVideoLectures] = useState<EnterpriseVideo[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<EnterpriseMaterial[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  const handleToggleBookmark = (id: string) => {
    if (bookmarkedItems.includes(id)) {
      setBookmarkedItems(bookmarkedItems.filter(item => item !== id));
      showMicroFeedback('✓ Bookmark removed');
    } else {
      setBookmarkedItems([...bookmarkedItems, id]);
      showMicroFeedback('✓ Bookmarked for quick access');
    }
  };

  useEffect(() => {
    let isMounted = true;

    getEnterpriseTopicContent(topic)
      .then((data) => {
        if (!isMounted) return;
        setVideoLectures(data.videoLectures);
        setStudyMaterials(data.studyMaterials);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsContentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [topic]);

  if (isContentLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
        <div className="w-full p-6 space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      {/* Feedback Toast */}
      {showFeedback && (
        <div 
          className="fixed top-4 right-6 z-50 px-4 py-3 shadow-lg text-sm font-semibold animate-fadeIn"
          style={{ 
            background: '#D1FAE5', 
            border: '1px solid #10B981', 
            color: '#065F46',
            borderRadius: '4px'
          }}
        >
          {showFeedback}
        </div>
      )}

      {/* Main Content */}
      <div className="w-full">
        {/* Header */}
        <div className="border-b" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <div className="px-6 py-4">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-4 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#5B5F8D' }}
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO TOPICS
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={onNavigateToSubject}
                className="text-xs font-medium uppercase hover:underline"
                style={{ color: '#6B7280' }}
              >
                MY SUBJECTS
              </button>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: '#D1D5DB' }} />
              <button
                onClick={onNavigateToChapter}
                className="text-xs font-medium uppercase hover:underline"
                style={{ color: '#6B7280' }}
              >
                {subject.toUpperCase()}
              </button>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: '#D1D5DB' }} />
              <span className="text-xs font-bold uppercase" style={{ color: '#111827' }}>
                {topic.toUpperCase()}
              </span>
            </div>

            {/* Topic Title */}
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#111827' }}>
              {topic}
            </h1>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
              {topicDescription}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="p-4 border" style={{ background: '#FAFAFA', borderColor: '#E5E7EB' }}>
                <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>
                  Video Lectures
                </div>
                <div className="text-3xl font-bold" style={{ color: '#111827' }}>
                  {videoLectures.length}
                </div>
              </div>
              <div className="p-4 border" style={{ background: '#FAFAFA', borderColor: '#E5E7EB' }}>
                <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#6B7280' }}>
                  Study Materials
                </div>
                <div className="text-3xl font-bold" style={{ color: '#111827' }}>
                  {studyMaterials.length}
                </div>
              </div>
              <div className="p-4 border" style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>
                <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#065F46' }}>
                  Completed Videos
                </div>
                <div className="text-3xl font-bold" style={{ color: '#065F46' }}>
                  {completedVideos.length}
                </div>
              </div>
              <div className="p-4 border" style={{ background: '#FEF3C7', borderColor: '#FDE68A' }}>
                <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#92400E' }}>
                  Bookmarked
                </div>
                <div className="text-3xl font-bold" style={{ color: '#92400E' }}>
                  {bookmarkedItems.length}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => showMicroFeedback('→ Starting practice session...')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                style={{ background: '#5B5F8D', color: '#FFFFFF' }}
              >
                <Target className="w-4 h-4" />
                START PRACTICE
              </button>
              <button
                onClick={() => showMicroFeedback('✓ Added to revision queue')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB' }}
              >
                <Calendar className="w-4 h-4" />
                ADD TO REVISION
              </button>
              <button
                onClick={() => showMicroFeedback('→ Opening analytics dashboard...')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB' }}
              >
                <BarChart2 className="w-4 h-4" />
                VIEW ANALYTICS
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Video Lectures Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5" style={{ color: '#111827' }} />
              <h2 className="text-lg font-bold" style={{ color: '#111827' }}>
                Video Lectures
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videoLectures.map((video) => {
                const isCompleted = completedVideos.includes(video.id);
                const isBookmarked = bookmarkedItems.includes(video.id);

                return (
                  <div
                    key={video.id}
                    className="border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
                  >
                    {/* Video Thumbnail */}
                    <div 
                      className="relative h-48 flex items-center justify-center"
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {/* Play Button */}
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255, 255, 255, 0.3)' }}
                      >
                        <Play className="w-8 h-8" style={{ color: '#FFFFFF', fill: '#FFFFFF' }} />
                      </div>

                      {/* Completed Badge */}
                      {isCompleted && (
                        <div 
                          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: '#10B981' }}
                        >
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                        </div>
                      )}

                      {/* Duration Badge */}
                      <div 
                        className="absolute bottom-3 left-3 px-2 py-1 text-xs font-bold"
                        style={{ background: 'rgba(0, 0, 0, 0.7)', color: '#FFFFFF' }}
                      >
                        {video.duration}
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-bold mb-2" style={{ color: '#111827' }}>
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs mb-3" style={{ color: '#6B7280' }}>
                        <span>{video.instructor}</span>
                        <span>{video.views} views</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (!completedVideos.includes(video.id)) {
                              setCompletedVideos([...completedVideos, video.id]);
                            }
                            showMicroFeedback('→ Opening video player...');
                          }}
                          className="flex-1 px-3 py-2 text-xs font-bold uppercase hover:opacity-90"
                          style={{ background: '#5B5F8D', color: '#FFFFFF' }}
                        >
                          {isCompleted ? 'WATCH AGAIN' : 'WATCH NOW'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(video.id);
                          }}
                          className="p-2"
                          style={{ color: isBookmarked ? '#F59E0B' : '#9CA3AF' }}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Materials Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" style={{ color: '#111827' }} />
              <h2 className="text-lg font-bold" style={{ color: '#111827' }}>
                Study Materials
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {studyMaterials.map((material) => (
                <div
                  key={material.id}
                  className="border hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
                  onClick={() => showMicroFeedback('→ Opening study material...')}
                >
                  {/* Material Header */}
                  <div 
                    className="p-4"
                    style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="w-8 h-8" style={{ color: '#FFFFFF' }} />
                      <div className="text-xs font-bold" style={{ color: '#FFFFFF' }}>
                        {material.pages} pages
                      </div>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {material.type}
                    </div>
                  </div>

                  {/* Material Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>
                      {material.title}
                    </h3>
                    <button
                      className="w-full px-3 py-2 text-xs font-bold uppercase hover:opacity-90"
                      style={{ background: '#5B5F8D', color: '#FFFFFF' }}
                    >
                      VIEW MATERIAL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
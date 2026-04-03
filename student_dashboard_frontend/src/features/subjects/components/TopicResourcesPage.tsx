import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, Video, FileText, BookOpen, Download, Play, Clock, CheckCircle2, Bookmark, BookmarkCheck, Target, PlayCircle, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getTopicResources, type TopicNoteResource, type TopicVideoResource } from '@/services/subjectResourceService';

interface Topic {
  id: string;
  title: string;
  description: string;
  subtopics: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
  }[];
}

interface TopicResourcesPageProps {
  chapterTitle: string;
  topic: Topic;
  onBack: () => void;
  onNavigateToChapter: () => void;
  onNavigateToSubjects: () => void;
}

export function TopicResourcesPage({ chapterTitle, topic, onBack, onNavigateToChapter, onNavigateToSubjects }: TopicResourcesPageProps) {
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>(['v1', 'n2']);
  const [completedVideos, setCompletedVideos] = useState<string[]>(['v1']);
  const [videoResources, setVideoResources] = useState<TopicVideoResource[]>([]);
  const [noteResources, setNoteResources] = useState<TopicNoteResource[]>([]);
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

    getTopicResources(topic.title)
      .then((data) => {
        if (!isMounted) return;
        setVideoResources(data.videoResources);
        setNoteResources(data.noteResources);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsContentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [topic.title]);

  if (isContentLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-5 space-y-5">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg animate-fadeIn" style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46' }}>
          <span className="text-sm font-semibold">{showFeedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-5 border-b" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
          style={{ color: '#5B5F8D' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO TOPICS
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={onNavigateToSubjects}
            className="text-xs font-medium uppercase tracking-wide hover:underline transition-all"
            style={{ color: '#64748B' }}
          >
            MY SUBJECTS
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />
          <button
            onClick={onNavigateToChapter}
            className="text-xs font-medium uppercase tracking-wide hover:underline transition-all"
            style={{ color: '#64748B' }}
          >
            {chapterTitle.toUpperCase()}
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#0F172A' }}>
            {topic.title.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0F172A' }}>
            {topic.title}
          </h1>
          <p className="text-sm" style={{ color: '#64748B' }}>
            {topic.description}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 border" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>
              Video Lectures
            </div>
            <div className="text-2xl font-bold" style={{ color: '#0F172A' }}>
              {videoResources.length}
            </div>
          </div>
          <div className="p-3 border" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>
              Study Materials
            </div>
            <div className="text-2xl font-bold" style={{ color: '#0F172A' }}>
              {noteResources.length}
            </div>
          </div>
          <div className="p-3 border" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#166534' }}>
              Completed Videos
            </div>
            <div className="text-2xl font-bold" style={{ color: '#166534' }}>
              {completedVideos.length}
            </div>
          </div>
          <div className="p-3 border" style={{ background: '#FEF3C7', borderColor: '#FDE68A' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#92400E' }}>
              Bookmarked
            </div>
            <div className="text-2xl font-bold" style={{ color: '#92400E' }}>
              {bookmarkedItems.length}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
          <button
            onClick={() => showMicroFeedback('→ Starting practice session...')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all"
            style={{ background: '#5B5F8D', color: '#FFFFFF' }}
          >
            <Target className="w-3.5 h-3.5" />
            START PRACTICE
          </button>
          <button
            onClick={() => showMicroFeedback('✓ Added to revision queue')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all"
            style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' }}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            ADD TO REVISION
          </button>
          <button
            onClick={() => showMicroFeedback('→ Opening analytics...')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all"
            style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' }}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            VIEW ANALYTICS
          </button>
        </div>
      </div>

      {/* Resources Content */}
      <div className="px-6 py-5">
        {/* Video Lectures Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-5 h-5" style={{ color: '#5B5F8D' }} />
            <h2 className="text-lg font-bold" style={{ color: '#0F172A' }}>
              Video Lectures
            </h2>
            <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoResources.map((video) => {
              const isCompleted = completedVideos.includes(video.id);
              const isBookmarked = bookmarkedItems.includes(video.id);

              return (
                <div
                  key={video.id}
                  className="border transition-all hover:shadow-md cursor-pointer"
                  style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-40" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <Play className="w-8 h-8" style={{ color: '#ffffff' }} />
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#10B981' }}>
                        <CheckCircle2 className="w-5 h-5" style={{ color: '#ffffff' }} />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-bold" style={{ background: 'rgba(0,0,0,0.7)', color: '#ffffff' }}>
                      {video.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold mb-2" style={{ color: '#0F172A' }}>
                      {video.title}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: '#64748B' }}>
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-3" style={{ color: '#64748B' }}>
                      <span>{video.instructor}</span>
                      <span>⭐ {video.rating}</span>
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
                        className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
                        style={{ background: '#5B5F8D', color: '#ffffff' }}
                      >
                        {isCompleted ? 'WATCH AGAIN' : 'WATCH NOW'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(video.id);
                        }}
                        className="p-2 hover:opacity-70"
                        style={{ color: isBookmarked ? '#F59E0B' : '#94A3B8' }}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
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
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5" style={{ color: '#5B5F8D' }} />
            <h2 className="text-lg font-bold" style={{ color: '#0F172A' }}>
              Study Materials & Notes
            </h2>
            <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {noteResources.map((note) => {
              const isBookmarked = bookmarkedItems.includes(note.id);

              return (
                <div
                  key={note.id}
                  className="border transition-all hover:shadow-md cursor-pointer"
                  style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
                >
                  {/* Header */}
                  <div className="relative p-6" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <BookOpen className="w-6 h-6" style={{ color: '#ffffff' }} />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(note.id);
                        }}
                        className="p-1.5 rounded hover:opacity-70"
                        style={{ background: 'rgba(255,255,255,0.2)', color: isBookmarked ? '#FBBF24' : '#ffffff' }}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {note.type}
                    </div>
                    <div className="text-sm font-bold" style={{ color: '#ffffff' }}>
                      {note.pages} pages
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold mb-2" style={{ color: '#0F172A' }}>
                      {note.title}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: '#64748B' }}>
                      {note.description}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-3" style={{ color: '#64748B' }}>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{note.downloads.toLocaleString()}</span>
                      </div>
                      <span>⭐ {note.rating}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showMicroFeedback('→ Opening resource viewer...')}
                        className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
                        style={{ background: '#5B5F8D', color: '#ffffff' }}
                      >
                        VIEW
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showMicroFeedback('✓ Downloaded successfully');
                        }}
                        className="px-3 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
                        style={{
                          background: '#F1F5F9',
                          color: '#475569',
                          border: '1px solid #CBD5E1'
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtopics Quick Access */}
        {topic.subtopics && topic.subtopics.length > 0 && (
          <div className="mt-8 p-4 border" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>
              SUBTOPIC QUICK ACCESS
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {topic.subtopics.map((subtopic, idx) => (
                <button
                  key={subtopic.id}
                  onClick={() => showMicroFeedback(`→ Filtering resources for ${subtopic.title}...`)}
                  className="flex items-center gap-2 p-2 border hover:border-blue-400 transition-all text-left"
                  style={{
                    background: subtopic.completed ? '#F0FDF4' : '#F8FAFC',
                    borderColor: subtopic.completed ? '#BBF7D0' : '#E2E8F0'
                  }}
                >
                  <div
                    className="w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: subtopic.completed ? '#16A34A' : '#CBD5E1',
                      color: '#FFFFFF'
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: '#0F172A' }}>
                      {subtopic.title}
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}>
                      <Clock className="w-3 h-3" />
                      {subtopic.duration}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Video, BookOpen, FileText, Play, CheckCircle2, Bookmark, BookmarkCheck, Eye, Star, ChevronRight, Download, FileQuestion, Lightbulb, Grid3x3, List, Search, Filter } from 'lucide-react';
import { SubjectNavigationWrapper } from './SubjectNavigationWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { getDividedLearnContent, type DividedLearnNote, type DividedLearnVideo } from '@/services/subjectResourceService';
import { toSlug } from '@/features/subjects/utils/routing';

interface DividedLearnSectionProps {
  courseTitle: string;
  courseCode: string;
}

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const difficultyFilters: DifficultyFilter[] = ['all', 'beginner', 'intermediate', 'advanced'];

export function DividedLearnSection({ courseTitle, courseCode: _courseCode }: DividedLearnSectionProps) {
  const [activeSection, setActiveSection] = useState<'videos' | 'notes'>('videos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyFilter>('all');
  const [completedVideos, setCompletedVideos] = useState<string[]>(['v1', 'v2', 'v3']);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>(['v4', 'n2']);
  const [showNavigationWrapper, setShowNavigationWrapper] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [videoLectures, setVideoLectures] = useState<DividedLearnVideo[]>([]);
  const [notesResources, setNotesResources] = useState<DividedLearnNote[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  useEffect(() => {
    let isMounted = true;

    getDividedLearnContent()
      .then((data) => {
        if (!isMounted) return;
        setVideoLectures(data.videoLectures);
        setNotesResources(data.notesResources);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsContentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const noteIconMap = {
    FileText,
    BookOpen,
    Lightbulb,
    FileQuestion,
  } as const;

  const handleToggleBookmark = (id: string, _type: 'video' | 'note') => {
    if (bookmarkedItems.includes(id)) {
      setBookmarkedItems(bookmarkedItems.filter(item => item !== id));
      showMicroFeedback('✓ Bookmark removed');
    } else {
      setBookmarkedItems([...bookmarkedItems, id]);
      showMicroFeedback('✓ Bookmarked for quick access');
    }
  };

  const handleVideoComplete = (id: string) => {
    if (!completedVideos.includes(id)) {
      setCompletedVideos([...completedVideos, id]);
      showMicroFeedback('🎉 Video marked as complete!');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' };
      case 'intermediate': return { bg: '#DBEAFE', text: '#1E3A8A', border: '#BFDBFE' };
      case 'advanced': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const filteredVideos = videoLectures.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || video.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const filteredNotes = notesResources.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || note.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (showNavigationWrapper) {
    return (
      <SubjectNavigationWrapper
        subject={courseTitle}
        subjectSlug={toSlug(courseTitle)}
        onBack={() => setShowNavigationWrapper(false)}
      />
    );
  }

  if (isContentLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <Skeleton className="h-20 w-full mb-6" />
        <Skeleton className="h-24 w-full mb-6" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg animate-fadeIn" style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46' }}>
          <span className="text-sm font-semibold">{showFeedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Learn
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Access video lectures and comprehensive study notes
        </p>
      </div>

      {/* Section Switcher */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('videos')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
              activeSection === 'videos' ? 'shadow-md' : 'opacity-60'
            }`}
            style={{
              background: activeSection === 'videos' ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: activeSection === 'videos' ? '#ffffff' : 'var(--text-primary)',
              border: activeSection === 'videos' ? 'none' : '1px solid var(--border-medium)'
            }}
          >
            <Video className="w-5 h-5" />
            Video Lectures ({videoLectures.length})
          </button>
          <button
            onClick={() => setActiveSection('notes')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
              activeSection === 'notes' ? 'shadow-md' : 'opacity-60'
            }`}
            style={{
              background: activeSection === 'notes' ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: activeSection === 'notes' ? '#ffffff' : 'var(--text-primary)',
              border: activeSection === 'notes' ? 'none' : '1px solid var(--border-medium)'
            }}
          >
            <BookOpen className="w-5 h-5" />
            Notes & Resources ({notesResources.length})
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-all ${viewMode === 'grid' ? 'opacity-100' : 'opacity-40'}`}
            style={{ 
              background: viewMode === 'grid' ? 'var(--accent-soft)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-tertiary)'
            }}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-all ${viewMode === 'list' ? 'opacity-100' : 'opacity-40'}`}
            style={{ 
              background: viewMode === 'list' ? 'var(--accent-soft)' : 'transparent',
              color: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--text-tertiary)'
            }}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder={`Search ${activeSection === 'videos' ? 'videos' : 'notes'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border"
            style={{ 
              background: 'var(--bg-card)', 
              borderColor: 'var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          {difficultyFilters.map((level) => (
            <button
              key={level}
              onClick={() => setFilterDifficulty(level)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                filterDifficulty === level ? '' : 'opacity-50'
              }`}
              style={{
                background: filterDifficulty === level ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: filterDifficulty === level ? '#ffffff' : 'var(--text-primary)',
                border: `1px solid ${filterDifficulty === level ? 'var(--accent-primary)' : 'var(--border-soft)'}`
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Access to Full Navigation */}
      <div className="p-4 mb-6 border-2" style={{ background: '#E9D5FF', borderColor: '#D8B4FE' }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: '#6B21A8' }}>
              Need Detailed Topic-wise Content?
            </h3>
            <p className="text-xs" style={{ color: '#6B21A8' }}>
              Access hierarchical topic structure with notes, resources, and revision planners
            </p>
          </div>
          <button
            onClick={() => setShowNavigationWrapper(true)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90 flex items-center gap-2 flex-shrink-0"
            style={{ background: '#9333EA', color: '#ffffff' }}
          >
            Open Topic View
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Lectures Section */}
      {activeSection === 'videos' && (
        <div>
          {/* Stats Bar */}
          <div className="flex items-center gap-6 mb-6 p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Total Videos
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {videoLectures.length}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Completed
              </div>
              <div className="text-xl font-bold" style={{ color: '#10B981' }}>
                {completedVideos.length}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Progress
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {Math.round((completedVideos.length / videoLectures.length) * 100)}%
              </div>
            </div>
            <div className="ml-auto">
              <div className="h-2 w-48 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(completedVideos.length / videoLectures.length) * 100}%`,
                    background: 'var(--accent-primary)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Video Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
            {filteredVideos.map((video) => {
              const isCompleted = completedVideos.includes(video.id);
              const isBookmarked = bookmarkedItems.includes(video.id);
              const diffColors = getDifficultyColor(video.difficulty);

              return viewMode === 'grid' ? (
                // Grid View
                <div
                  key={video.id}
                  className="border hover:shadow-lg transition-all cursor-pointer"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
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
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="px-2 py-0.5 text-xs font-bold uppercase"
                        style={{
                          background: diffColors.bg,
                          color: diffColors.text,
                          border: `1px solid ${diffColors.border}`
                        }}
                      >
                        {video.difficulty}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <Star className="w-3 h-3" style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                        <span>{video.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {video.title}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                      <span>{video.instructor}</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.views}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVideoComplete(video.id)}
                        className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
                        style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                      >
                        {isCompleted ? 'Watch Again' : 'Watch Now'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(video.id, 'video');
                        }}
                        className="p-2 hover:opacity-70"
                        style={{ color: isBookmarked ? '#F59E0B' : 'var(--text-tertiary)' }}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={video.id}
                  className="flex items-center gap-4 p-4 border hover:border-blue-400 transition-all cursor-pointer"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-6 h-6" style={{ color: '#ffffff' }} />
                    </div>
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 text-xs font-bold" style={{ background: 'rgba(0,0,0,0.7)', color: '#ffffff' }}>
                      {video.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="px-2 py-0.5 text-xs font-bold uppercase"
                        style={{
                          background: diffColors.bg,
                          color: diffColors.text,
                          border: `1px solid ${diffColors.border}`
                        }}
                      >
                        {video.difficulty}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <Star className="w-3 h-3" style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                        <span>{video.rating}</span>
                      </div>
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#10B981' }}>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {video.title}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {video.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span>{video.instructor}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.views} views</span>
                      </div>
                      <span>•</span>
                      <span>{video.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleVideoComplete(video.id)}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
                      style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                    >
                      {isCompleted ? 'Watch Again' : 'Watch Now'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBookmark(video.id, 'video');
                      }}
                      className="p-2 hover:opacity-70"
                      style={{ color: isBookmarked ? '#F59E0B' : 'var(--text-tertiary)' }}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes & Resources Section */}
      {activeSection === 'notes' && (
        <div>
          {/* Stats Bar */}
          <div className="flex items-center gap-6 mb-6 p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Total Resources
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {notesResources.length}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Bookmarked
              </div>
              <div className="text-xl font-bold" style={{ color: '#F59E0B' }}>
                {bookmarkedItems.filter(id => id.startsWith('n')).length}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Total Downloads
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {notesResources.reduce((sum, note) => sum + note.downloads, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Notes Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
            {filteredNotes.map((note) => {
              const isBookmarked = bookmarkedItems.includes(note.id);
              const diffColors = getDifficultyColor(note.difficulty);
              const Icon = noteIconMap[note.iconName] ?? FileText;

              return viewMode === 'grid' ? (
                // Grid View
                <div
                  key={note.id}
                  className="border hover:shadow-lg transition-all cursor-pointer"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
                >
                  {/* Header */}
                  <div className="relative p-6" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <Icon className="w-6 h-6" style={{ color: '#ffffff' }} />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(note.id, 'note');
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
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="px-2 py-0.5 text-xs font-bold uppercase"
                        style={{
                          background: diffColors.bg,
                          color: diffColors.text,
                          border: `1px solid ${diffColors.border}`
                        }}
                      >
                        {note.difficulty}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <Star className="w-3 h-3" style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                        <span>{note.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {note.title}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {note.description}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{note.downloads.toLocaleString()}</span>
                      </div>
                      <span>{note.lastUpdated}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showMicroFeedback('→ Opening resource viewer...')}
                        className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
                        style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showMicroFeedback('✓ Downloaded successfully');
                        }}
                        className="px-3 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
                        style={{
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-medium)'
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={note.id}
                  className="flex items-center gap-4 p-4 border hover:border-blue-400 transition-all cursor-pointer"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <Icon className="w-8 h-8" style={{ color: '#ffffff' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                        {note.type}
                      </span>
                      <div
                        className="px-2 py-0.5 text-xs font-bold uppercase"
                        style={{
                          background: diffColors.bg,
                          color: diffColors.text,
                          border: `1px solid ${diffColors.border}`
                        }}
                      >
                        {note.difficulty}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <Star className="w-3 h-3" style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                        <span>{note.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {note.title}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {note.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span>{note.pages} pages</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{note.downloads.toLocaleString()} downloads</span>
                      </div>
                      <span>•</span>
                      <span>{note.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => showMicroFeedback('→ Opening resource viewer...')}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
                      style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showMicroFeedback('✓ Downloaded successfully');
                      }}
                      className="p-2 hover:opacity-70"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBookmark(note.id, 'note');
                      }}
                      className="p-2 hover:opacity-70"
                      style={{ color: isBookmarked ? '#F59E0B' : 'var(--text-tertiary)' }}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

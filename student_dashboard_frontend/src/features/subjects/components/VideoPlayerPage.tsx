import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Bookmark, Download, Lightbulb, MessageSquare, CheckCircle2, SkipForward, SkipBack, Clock, User, Star, FileText, Share2, Flag, ThumbsUp, Send, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getVideoPlayerSupportData, type DiscussionThread, type TranscriptItem } from '@/services/subjectResourceService';

interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  type: string;
  difficulty: string;
  instructor: string;
  views: number;
  rating: number;
  lastUpdated: string;
}

interface VideoPlayerPageProps {
  lesson: VideoLesson;
  onBack: () => void;
  onComplete: () => void;
}

export function VideoPlayerPage({ lesson, onBack, onComplete }: VideoPlayerPageProps) {
  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('1080p');

  // UI states
  const [showNotes, setShowNotes] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<{ time: number; text: string; timestamp: string }[]>([]);
  const [discussionText, setDiscussionText] = useState('');
  const [discussionThreads, setDiscussionThreads] = useState<DiscussionThread[]>([]);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [isSupportLoading, setIsSupportLoading] = useState(true);

  const videoRef = useRef<HTMLDivElement>(null);

  // Simulate video duration (in real app this would come from video metadata)
  useEffect(() => {
    const mins = parseInt(lesson.duration.split(' ')[0]);
    setDuration(mins * 60);
  }, [lesson.duration]);

  // Auto-play simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          if (next >= duration) {
            setIsPlaying(false);
            onComplete();
            return duration;
          }
          return next;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, playbackSpeed, onComplete]);

  useEffect(() => {
    let isMounted = true;

    getVideoPlayerSupportData()
      .then((data) => {
        if (!isMounted) return;
        setDiscussionThreads(data.discussionThreads);
        setTranscript(data.transcript);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsSupportLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const toggleMute = () => setIsMuted(!isMuted);
  
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (value > 0) setIsMuted(false);
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value);
  };

  const skip = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, currentTime + seconds)));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' };
      case 'Intermediate': return { bg: '#DBEAFE', text: '#1E3A8A', border: '#BFDBFE' };
      case 'Advanced': return { bg: '#E9D5FF', text: '#6B21A8', border: '#D8B4FE' };
      case 'Expert': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const diffColors = getDifficultyColor(lesson.difficulty);

  const handleAddNote = () => {
    if (noteText.trim()) {
      const newNote = {
        time: currentTime,
        text: noteText,
        timestamp: formatTime(currentTime)
      };
      setNotes([...notes, newNote]);
      setNoteText('');
    }
  };

  const handleDownload = () => {
    alert('Downloading video... This would start a download in a real implementation.');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (isSupportLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="p-6 space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-[420px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 transition-colors"
              style={{ color: 'var(--accent-primary)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {lesson.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span 
                  className="px-2 py-0.5 text-xs font-bold"
                  style={{ 
                    background: diffColors.bg,
                    color: diffColors.text,
                    border: `1px solid ${diffColors.border}`
                  }}
                >
                  {lesson.difficulty}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>•</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lesson.duration}</span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>•</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lesson.instructor}</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1" style={{ background: 'var(--bg-secondary)' }}>
              <Star className="w-4 h-4" style={{ color: '#F59E0B' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{lesson.rating}</span>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {lesson.views.toLocaleString()} views
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Main Video Player Area */}
        <div className="xl:col-span-2">
          {/* Video Player */}
          <div 
            ref={videoRef}
            className="relative bg-black aspect-video"
            style={{ minHeight: '400px' }}
          >
            {/* Video would render here - using placeholder */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
              <div className="text-center">
                <Play className="w-20 h-20 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <p className="text-white text-sm opacity-50">Video Player Placeholder</p>
              </div>
            </div>

            {/* Play/Pause Overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              {!isPlaying && (
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-3">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
                  }}
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white">{formatTime(currentTime)}</span>
                  <span className="text-xs text-white/70">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => skip(-10)} className="p-2 hover:bg-white/10 rounded transition-colors">
                    <SkipBack className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="p-3 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <button onClick={() => skip(10)} className="p-2 hover:bg-white/10 rounded transition-colors">
                    <SkipForward className="w-5 h-5 text-white" />
                  </button>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded transition-colors">
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer hidden md:block"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed Control */}
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="px-2 py-1 text-xs font-semibold bg-white/10 text-white border border-white/20 rounded cursor-pointer"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>

                  {/* Quality */}
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="px-2 py-1 text-xs font-semibold bg-white/10 text-white border border-white/20 rounded cursor-pointer hidden md:block"
                  >
                    <option value="360p">360p</option>
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                  </select>

                  {/* Settings */}
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white/10 rounded transition-colors hidden md:block"
                  >
                    <Settings className="w-5 h-5 text-white" />
                  </button>

                  {/* Fullscreen */}
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5 text-white" />
                    ) : (
                      <Maximize className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Below Video */}
          <div className="p-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                  isBookmarked ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''
                }`}
                style={{
                  background: isBookmarked ? '#FEF3C7' : 'var(--bg-secondary)',
                  color: isBookmarked ? '#92400E' : 'var(--text-primary)',
                  border: `1px solid ${isBookmarked ? '#FCD34D' : 'var(--border-soft)'}`,
                }}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all"
                style={{
                  background: showNotes ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: showNotes ? '#ffffff' : 'var(--text-primary)',
                  border: `1px solid ${showNotes ? 'var(--accent-primary)' : 'var(--border-soft)'}`,
                }}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Notes ({notes.length})</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all"
                style={{
                  background: showTranscript ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: showTranscript ? '#ffffff' : 'var(--text-primary)',
                  border: `1px solid ${showTranscript ? 'var(--accent-primary)' : 'var(--border-soft)'}`,
                }}
              >
                <FileText className="w-4 h-4" />
                <span>Transcript</span>
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ml-auto"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <Flag className="w-4 h-4" />
                <span>Report Issue</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
            <div className="overflow-x-auto whitespace-nowrap px-4">
              <div className="inline-flex min-w-max items-center gap-1">
              <button
                onClick={() => {
                  setShowNotes(false);
                  setShowDiscussion(true);
                  setShowTranscript(false);
                }}
                className={`shrink-0 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all ${
                  showDiscussion ? '' : 'opacity-60'
                }`}
                style={{
                  borderColor: showDiscussion ? 'var(--accent-primary)' : 'transparent',
                  color: showDiscussion ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Discussion (24)
              </button>
              <button
                onClick={() => {
                  setShowNotes(true);
                  setShowDiscussion(false);
                  setShowTranscript(false);
                }}
                className={`shrink-0 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all ${
                  showNotes ? '' : 'opacity-60'
                }`}
                style={{
                  borderColor: showNotes ? 'var(--accent-primary)' : 'transparent',
                  color: showNotes ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                <Lightbulb className="w-4 h-4 inline mr-2" />
                My Notes ({notes.length})
              </button>
              <button
                onClick={() => {
                  setShowNotes(false);
                  setShowDiscussion(false);
                  setShowTranscript(true);
                }}
                className={`shrink-0 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all ${
                  showTranscript ? '' : 'opacity-60'
                }`}
                style={{
                  borderColor: showTranscript ? 'var(--accent-primary)' : 'transparent',
                  color: showTranscript ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Transcript
              </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6" style={{ background: 'var(--bg-card)' }}>
            {/* Discussion Tab */}
            {showDiscussion && (
              <div className="space-y-4">
                {/* Add Comment */}
                <div className="p-4 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <textarea
                    value={discussionText}
                    onChange={(e) => setDiscussionText(e.target.value)}
                    placeholder="Ask a question or share your thoughts..."
                    className="w-full px-3 py-2 text-sm mb-3 resize-none"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                      color: 'var(--text-primary)',
                      minHeight: '80px'
                    }}
                  />
                  <button
                    onClick={() => {
                      if (discussionText.trim()) {
                        alert('Comment posted!');
                        setDiscussionText('');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase"
                    style={{
                      background: 'var(--accent-primary)',
                      color: '#ffffff',
                    }}
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                </div>

                {/* Discussion Threads */}
                {discussionThreads.map(thread => (
                  <div key={thread.id} className="p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                        <User className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{thread.user}</span>
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{thread.time}</span>
                        </div>
                        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{thread.message}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-xs hover:opacity-70" style={{ color: 'var(--text-tertiary)' }}>
                            <ThumbsUp className="w-3 h-3" />
                            {thread.likes}
                          </button>
                          <button className="text-xs hover:opacity-70" style={{ color: 'var(--text-tertiary)' }}>
                            {thread.replies} replies
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notes Tab */}
            {showNotes && (
              <div className="space-y-4">
                {/* Add Note */}
                <div className="p-4 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
                  <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    Add Note at {formatTime(currentTime)}
                  </div>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write your note here..."
                    className="w-full px-3 py-2 text-sm mb-3 resize-none"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-soft)',
                      color: 'var(--text-primary)',
                      minHeight: '80px'
                    }}
                  />
                  <button
                    onClick={handleAddNote}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase"
                    style={{
                      background: 'var(--accent-primary)',
                      color: '#ffffff',
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Save Note
                  </button>
                </div>

                {/* Notes List */}
                {notes.length === 0 ? (
                  <div className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                    <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notes yet. Add your first note!</p>
                  </div>
                ) : (
                  notes.map((note, idx) => (
                    <div key={idx} className="p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>{note.timestamp}</span>
                        </div>
                        <button
                          onClick={() => handleSeek(note.time)}
                          className="text-xs font-semibold hover:opacity-70"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          Jump to time
                        </button>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Transcript Tab */}
            {showTranscript && (
              <div className="space-y-3">
                {transcript.map((item, idx) => (
                  <div key={idx} className="p-3 border hover:bg-slate-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border-soft)' }}
                    onClick={() => {
                      const [mins, secs] = item.time.split(':');
                      handleSeek(parseInt(mins) * 60 + parseInt(secs));
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-bold px-2 py-1" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                        {item.time}
                      </span>
                      <p className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Course Resources */}
        <div className="xl:col-span-1 border-l" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <div className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>
              Course Resources
            </h3>

            {/* Quick Actions */}
            <div className="space-y-2 mb-6">
              <button 
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <span>📄 Lecture Notes PDF</span>
                <Download className="w-4 h-4" />
              </button>
              <button 
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <span>📝 Practice Problems</span>
                <Download className="w-4 h-4" />
              </button>
              <button 
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <span>📊 Formula Sheet</span>
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Instructor Info */}
            <div className="mb-6 p-4 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-soft)' }}>
              <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Instructor
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
                  <span className="text-white font-bold">DR</span>
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{lesson.instructor}</div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>PhD in Physics</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3" style={{ color: '#F59E0B' }} />
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{lesson.rating}</span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>• 15k students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mark as Complete */}
            <button
              onClick={onComplete}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all"
              style={{
                background: 'var(--accent-primary)',
                color: '#ffffff',
              }}
            >
              <CheckCircle2 className="w-5 h-5" />
              Mark as Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

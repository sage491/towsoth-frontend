import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, Download, BookmarkPlus, ZoomIn, ZoomOut, ChevronLeft as ChevronLeftIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getResourceViewerContent,
  type ConceptItem,
  type DiagramItem,
  type FormulaItem,
  type MistakeItem,
  type StrategyItem,
} from '@/services/subjectResourceService';

type ResourceType = 'formula' | 'concept' | 'diagram' | 'mistakes' | 'strategy' | 'reference';

interface ResourceViewerProps {
  type: ResourceType;
  subject: string;
  topic: string;
  resourceTitle: string;
  onBack: () => void;
  onNavigateToSubject: () => void;
  onNavigateToTopic: () => void;
  onNavigateToNotes: () => void;
}

export function ResourceViewer({
  type,
  subject,
  topic,
  resourceTitle,
  onBack,
  onNavigateToSubject,
  onNavigateToTopic,
  onNavigateToNotes
}: ResourceViewerProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedFormula, setExpandedFormula] = useState<number | null>(null);
  const [currentDiagram, setCurrentDiagram] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [formulaData, setFormulaData] = useState<FormulaItem[]>([]);
  const [conceptData, setConceptData] = useState<ConceptItem[]>([]);
  const [diagramData, setDiagramData] = useState<DiagramItem[]>([]);
  const [mistakeData, setMistakeData] = useState<MistakeItem[]>([]);
  const [strategyData, setStrategyData] = useState<StrategyItem[]>([]);
  const [quickFacts, setQuickFacts] = useState<string[]>([]);
  const [keyEquations, setKeyEquations] = useState<string[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const showMicroFeedback = (message: string) => {
    setShowFeedback(message);
    setTimeout(() => setShowFeedback(null), 2000);
  };

  useEffect(() => {
    let isMounted = true;

    getResourceViewerContent()
      .then((data) => {
        if (!isMounted) return;
        setFormulaData(data.formulaData);
        setConceptData(data.conceptData);
        setDiagramData(data.diagramData);
        setMistakeData(data.mistakeData);
        setStrategyData(data.strategyData);
        setQuickFacts(data.quickFacts);
        setKeyEquations(data.keyEquations);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsContentLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isContentLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="px-4 md:px-6 py-6 space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      case 'Medium': return { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' };
      case 'Low': return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 px-3 py-2 text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent-primary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notes
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button onClick={onNavigateToSubject} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-tertiary)' }}>
            My Subjects
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <button onClick={onNavigateToSubject} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-tertiary)' }}>
            {subject}
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <button onClick={onNavigateToTopic} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-tertiary)' }}>
            {topic}
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <button onClick={onNavigateToNotes} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-tertiary)' }}>
            Notes & Resources
          </button>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {resourceTitle}
          </span>
        </div>

        {/* Title and Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {resourceTitle}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showMicroFeedback('⬇ Downloading...');
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase hover:opacity-90"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => {
                setIsBookmarked(!isBookmarked);
                showMicroFeedback(isBookmarked ? '✓ Bookmark removed' : '✓ Bookmarked');
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase hover:opacity-90"
              style={{
                background: isBookmarked ? '#FEF3C7' : 'var(--bg-secondary)',
                color: isBookmarked ? '#92400E' : 'var(--text-primary)',
                border: `1px solid ${isBookmarked ? '#FCD34D' : 'var(--border-medium)'}`
              }}
            >
              <BookmarkPlus className="w-4 h-4" />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        </div>
      </div>

      {/* Micro Feedback */}
      {showFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 shadow-lg animate-fadeIn" style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46' }}>
          <span className="text-sm font-semibold">{showFeedback}</span>
        </div>
      )}

      {/* Content */}
      <div className="px-4 md:px-6 py-6">
        {/* FORMULA SHEET VIEW */}
        {type === 'formula' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {formulaData.map((item) => {
              const isExpanded = expandedFormula === item.id;
              return (
                <div key={item.id} className="border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                  <button
                    onClick={() => setExpandedFormula(isExpanded ? null : item.id)}
                    className="w-full p-6 text-left hover:bg-opacity-50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                        <div className="px-4 py-3 mb-3 font-mono text-lg" style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }}>
                          {item.formula}
                        </div>
                        {!isExpanded && (
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.explanation}</p>
                        )}
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                          Explanation
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.explanation}</p>
                      </div>
                      
                      {item.variables.length > 0 && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                            Variables
                          </div>
                          <div className="space-y-2">
                            {item.variables.map((v, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2" style={{ background: 'var(--bg-secondary)' }}>
                                <code className="px-2 py-1 font-mono font-bold" style={{ background: '#DBEAFE', color: '#1E3A8A' }}>
                                  {v.symbol}
                                </code>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{v.meaning}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
                          Applications
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.applications.map((app, idx) => (
                            <span key={idx} className="px-3 py-1 text-xs font-semibold" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => showMicroFeedback('→ Opening related practice...')}
                        className="px-4 py-2 text-sm font-bold uppercase"
                        style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                      >
                        Practice with this formula
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CONCEPT NOTES VIEW */}
        {type === 'concept' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {conceptData.map((concept) => (
              <div key={concept.id} className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{concept.title}</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{concept.content}</p>
                <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Key Points
                </div>
                <div className="space-y-2">
                  {concept.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--accent-primary)' }} />
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DIAGRAM GALLERY VIEW */}
        {type === 'diagram' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              {/* Main Diagram Display */}
              <div className="relative aspect-video border mb-4" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', borderColor: 'var(--border-soft)' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {diagramData[currentDiagram].title}
                    </p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                      {diagramData[currentDiagram].description}
                    </p>
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentDiagram(Math.max(0, currentDiagram - 1))}
                  disabled={currentDiagram === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full disabled:opacity-30"
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#ffffff' }}
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentDiagram(Math.min(diagramData.length - 1, currentDiagram + 1))}
                  disabled={currentDiagram === diagramData.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full disabled:opacity-30"
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#ffffff' }}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Zoom Controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
                    className="p-2 rounded" style={{ background: 'rgba(0,0,0,0.5)', color: '#ffffff' }}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 rounded text-sm font-bold" style={{ background: 'rgba(0,0,0,0.5)', color: '#ffffff' }}>
                    {(zoomLevel * 100).toFixed(0)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                    className="p-2 rounded" style={{ background: 'rgba(0,0,0,0.5)', color: '#ffffff' }}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {diagramData.map((diagram, idx) => (
                  <button
                    key={diagram.id}
                    onClick={() => setCurrentDiagram(idx)}
                    className={`p-3 border-2 transition-all ${idx === currentDiagram ? 'border-blue-500' : ''}`}
                    style={{
                      background: 'var(--bg-secondary)',
                      borderColor: idx === currentDiagram ? 'var(--accent-primary)' : 'var(--border-soft)'
                    }}
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{diagram.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMMON MISTAKES VIEW */}
        {type === 'mistakes' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {mistakeData.map((item) => {
              const severityColors = getSeverityColor(item.severity);
              return (
                <div key={item.id} className="border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="px-2 py-1 text-xs font-bold uppercase"
                            style={{
                              background: severityColors.bg,
                              color: severityColors.text,
                              border: `1px solid ${severityColors.border}`
                            }}
                          >
                            {item.severity} Priority
                          </span>
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                          ❌ {item.mistake}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
                        <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#92400E' }}>
                          Why This Happens
                        </div>
                        <p className="text-sm" style={{ color: '#92400E' }}>{item.why}</p>
                      </div>

                      <div className="p-3" style={{ background: '#D1FAE5', border: '1px solid #10B981' }}>
                        <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#065F46' }}>
                          ✓ How to Fix It
                        </div>
                        <p className="text-sm" style={{ color: '#065F46' }}>{item.fix}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => showMicroFeedback('→ Opening practice problems...')}
                      className="mt-4 px-4 py-2 text-sm font-bold uppercase"
                      style={{ background: 'var(--accent-primary)', color: '#ffffff' }}
                    >
                      Practice to Avoid This
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EXAM STRATEGY VIEW */}
        {type === 'strategy' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {strategyData.map((strategy) => (
              <div key={strategy.id} className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{strategy.title}</h3>
                <div className="space-y-2">
                  {strategy.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 hover:bg-opacity-50 transition-all" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--accent-primary)', color: '#ffffff' }}>
                        {idx + 1}
                      </div>
                      <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QUICK REFERENCE VIEW */}
        {type === 'reference' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Facts</h3>
                <div className="space-y-3">
                  {quickFacts.map((fact, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ background: 'var(--accent-primary)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Key Equations</h3>
                <div className="space-y-3">
                  {keyEquations.map((eq, idx) => (
                    <div key={idx} className="px-3 py-2 font-mono" style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }}>
                      {eq}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

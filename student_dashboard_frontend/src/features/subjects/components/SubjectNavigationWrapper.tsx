import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopicSelectionPage } from './TopicSelectionPage';
import { EnterpriseTopicView } from './EnterpriseTopicView';
import { NotesResourcesPage } from './NotesResourcesPage';
import { ResourceViewer } from './ResourceViewer';
import { RevisionPlannerPage } from './RevisionPlannerPage';
import { topicCatalog } from './topicCatalog';
import { ROUTES } from '@/shared/config/routes';
import { toSlug } from '@/features/subjects/utils/routing';

type ViewState = 'topics' | 'topicView' | 'notes' | 'resource' | 'revision';
type ResourceType = 'formula' | 'concept' | 'diagram' | 'mistakes' | 'strategy' | 'reference';

interface TopicSubtopic {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface SubjectTopic {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  subtopics: TopicSubtopic[];
}

interface NavigationWrapperProps {
  subject: string;
  subjectSlug: string;
  topicSlug?: string;
  subtopicSlug?: string;
  onBack: () => void;
  onBackToSubjects?: () => void;
}

export function SubjectNavigationWrapper({ subject, subjectSlug, topicSlug, subtopicSlug, onBack, onBackToSubjects }: NavigationWrapperProps) {
  const navigate = useNavigate();
  const [overlayView, setOverlayView] = useState<'resource' | 'revision' | null>(null);
  const [selectedResource, setSelectedResource] = useState<{ type: ResourceType; title: string } | null>(null);

  const selectedTopic = useMemo(() => {
    if (!topicSlug) return null;
    return topicCatalog.find((topic) => topic.id === topicSlug) ?? null;
  }, [topicSlug]);

  const selectedSubtopic = useMemo(() => {
    if (!selectedTopic || !subtopicSlug) return null;
    return selectedTopic.subtopics.find((subtopic) => toSlug(subtopic.title) === subtopicSlug) ?? null;
  }, [selectedTopic, subtopicSlug]);

  const subjectBasePath = `${ROUTES.student["my-subjects"]}/${subjectSlug}`;

  const handleBackToSubjects = () => {
    setOverlayView(null);
    setSelectedResource(null);
    if (onBack) onBack();
    if (onBackToSubjects) onBackToSubjects();
  };

  const handleTopicSelect = (topic: SubjectTopic, selectedSubtopicSlug?: string) => {
    setOverlayView(null);
    setSelectedResource(null);
    const topicPath = `${subjectBasePath}/${topic.id}`;

    if (selectedSubtopicSlug) {
      navigate(`${topicPath}/${selectedSubtopicSlug}`);
      return;
    }

    navigate(topicPath);
  };

  const handleResourceSelect = (type: ResourceType, title: string) => {
    setSelectedResource({ type, title });
    setOverlayView('resource');
  };

  const handleOpenRevision = () => {
    setOverlayView('revision');
  };

  const handleBackToTopics = () => {
    setOverlayView(null);
    setSelectedResource(null);
    navigate(subjectBasePath);
  };

  const handleBackToNotes = () => {
    setOverlayView(null);
    setSelectedResource(null);
  };

  const handleBackFromRevision = () => {
    setOverlayView(null);
  };

  const routeView: ViewState = selectedSubtopic ? 'notes' : selectedTopic ? 'topicView' : 'topics';
  const currentView: ViewState = overlayView === 'resource' || overlayView === 'revision' ? overlayView : routeView;

  const selectedNotesSubtopic = selectedSubtopic ?? (selectedTopic ? selectedTopic.subtopics[0] : null);
  const notesSubtopicModel = selectedNotesSubtopic
    ? {
        id: selectedNotesSubtopic.id,
        title: selectedNotesSubtopic.title,
        description: `Deep dive into ${selectedNotesSubtopic.title}`,
        estimatedTime: selectedNotesSubtopic.duration,
        difficulty: selectedTopic?.difficulty || 'Intermediate',
        concepts: [selectedNotesSubtopic.title],
        progress: selectedNotesSubtopic.completed ? 100 : 60,
      }
    : null;

  return (
    <>
      {currentView === 'topics' && (
        <TopicSelectionPage
          subject={subject}
          onBack={handleBackToSubjects}
          onNavigateToTopic={handleTopicSelect}
          onNavigateToSubject={handleBackToSubjects}
        />
      )}

      {currentView === 'topicView' && selectedTopic && (
        <EnterpriseTopicView
          subject={subject}
          topic={selectedTopic.title}
          topicDescription={selectedTopic.description}
          onBack={handleBackToTopics}
          onNavigateToSubject={handleBackToSubjects}
          onNavigateToChapter={handleBackToTopics}
        />
      )}

      {currentView === 'notes' && selectedTopic && notesSubtopicModel && (
        <NotesResourcesPage
          subject={subject}
          topic={selectedTopic.title}
          subtopic={notesSubtopicModel}
          onBack={handleBackToTopics}
          onNavigateToSubject={handleBackToSubjects}
          onNavigateToTopic={handleBackToTopics}
          onMarkComplete={() => console.log('Marked complete')}
          onAddToRevision={handleOpenRevision}
          onStartPractice={() => console.log('Start practice')}
          onResourceClick={handleResourceSelect}
        />
      )}

      {currentView === 'resource' && selectedResource && selectedTopic && (
        <ResourceViewer
          type={selectedResource.type}
          subject={subject}
          topic={selectedTopic.title}
          resourceTitle={selectedResource.title}
          onBack={handleBackToNotes}
          onNavigateToSubject={handleBackToSubjects}
          onNavigateToTopic={handleBackToTopics}
          onNavigateToNotes={handleBackToNotes}
        />
      )}

      {currentView === 'revision' && (
        <RevisionPlannerPage
          subject={subject}
          onBack={handleBackFromRevision}
          onNavigateToSubject={handleBackToSubjects}
        />
      )}
    </>
  );
}
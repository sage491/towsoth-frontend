import {
  mockAIGuidanceRecommendations,
  mockAnalyticsViewContent,
  mockDividedLearnNotesResources,
  mockDividedLearnVideoLectures,
  mockLearningPathContent,
  mockNotesResourcesPageContent,
  mockRevisionPlannerContent,
  mockResourceViewerContent,
  mockTestAnalyticsTemplates,
  mockVideoPlayerSupportData,
} from "@/mocks/mockSubjectResources";

export interface AIGuidanceRecommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  estimatedTime: string;
  iconName: "AlertCircle" | "BookOpen" | "FileQuestion";
  color: string;
}

export interface DividedLearnVideo {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  views: number;
  rating: number;
  thumbnail: string;
  description: string;
  lastUpdated: string;
}

export interface DividedLearnNote {
  id: string;
  title: string;
  type: string;
  pages: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  downloads: number;
  rating: number;
  iconName: "FileText" | "BookOpen" | "Lightbulb" | "FileQuestion";
  description: string;
  lastUpdated: string;
}

export interface EnterpriseVideo {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  views: number;
  completed: boolean;
}

export interface EnterpriseMaterial {
  id: string;
  title: string;
  type: string;
  pages: number;
}

export interface TopicVideoResource {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  views: number;
  rating: number;
  description: string;
}

export interface TopicNoteResource {
  id: string;
  title: string;
  type: string;
  pages: number;
  downloads: number;
  rating: number;
  description: string;
}

export interface FormulaItem {
  id: number;
  name: string;
  formula: string;
  explanation: string;
  variables: Array<{ symbol: string; meaning: string }>;
  applications: string[];
}

export interface ConceptItem {
  id: number;
  title: string;
  content: string;
  keyPoints: string[];
}

export interface DiagramItem {
  id: number;
  title: string;
  description: string;
}

export interface MistakeItem {
  id: number;
  category: string;
  mistake: string;
  why: string;
  fix: string;
  severity: string;
}

export interface StrategyItem {
  id: number;
  title: string;
  items: string[];
}

export interface DiscussionThread {
  id: number;
  user: string;
  time: string;
  message: string;
  likes: number;
  replies: number;
}

export interface TranscriptItem {
  time: string;
  text: string;
}

export interface NotesSection {
  id: number;
  title: string;
  content: string;
  keyPoints?: string[];
  formulas?: Array<{ name: string; formula: string }>;
  steps?: string[];
  misconceptions?: string[];
}

export interface NotesResourcesCollections {
  videos: Array<{ id: number; title: string; instructor: string; duration: string; views: number }>;
  pdfs: Array<{ id: number; title: string; pages: number; size: string }>;
  practice: Array<{ id: number; title: string; questions: number; difficulty: string }>;
  links: Array<{ id: number; title: string; type: string }>;
}

export interface RevisionSession {
  id: string;
  topic: string;
  subject: string;
  scheduledDate: string;
  duration: string;
  priority: string;
  revisionNumber: number;
  lastRevised: string;
  nextRevision: string;
  confidence: number;
  status: string;
}

export interface RevisionTopic {
  id: string;
  title: string;
  subtopics: number;
  lastStudied: string;
  mastery: number;
  needsRevision: boolean;
  difficulty: string;
}

export interface RevisionCalendarEvent {
  date: string;
  sessions: number;
  topics: string[];
}

export interface LearningPathModule {
  id: number;
  title: string;
  status: string;
  progress: number;
  lessons: number;
  duration: string;
  currentLesson?: string;
  currentLessonDuration?: string;
  remainingTime?: string;
  prerequisite?: string;
}

export interface LearningPathInsight {
  message: string;
  type: string;
}

export interface AnalyticsHeatmapTopic {
  name: string;
  strength: string;
  accuracy: number;
}

export interface AnalyticsSnapshot {
  accuracy: string;
  avgTimePerQuestion: string;
  avgTimeTarget: string;
  scoreTrendIndicator: string;
  scoreTrendLabel: string;
  rankImpact: string;
  rankImpactLabel: string;
}

export interface TestAnalyticsVideo {
  title: string;
  instructor: string;
  duration: string;
  level: string;
  views: string;
  rating: string;
}

export interface TestAnalyticsNote {
  title: string;
  pages: number;
  size: string;
  downloads: string;
  rating: string;
}

export async function getAIGuidanceRecommendations(weakTopicsCount: number): Promise<AIGuidanceRecommendation[]> {
  // Future API call
  // return apiRequest<AIGuidanceRecommendation[]>("/subjects/ai-recommendations");
  return Promise.resolve(
    mockAIGuidanceRecommendations.map((item, index) => ({
      ...item,
      priority: index === 0 ? (weakTopicsCount > 0 ? "high" : "medium") : index === 1 ? "medium" : "low",
    }))
  );
}

export async function getDividedLearnContent(): Promise<{ videoLectures: DividedLearnVideo[]; notesResources: DividedLearnNote[] }> {
  // Future API call
  // return apiRequest<{ videoLectures: DividedLearnVideo[]; notesResources: DividedLearnNote[] }>("/subjects/divided-learn");
  return Promise.resolve({
    videoLectures: mockDividedLearnVideoLectures.map((item) => ({ ...item })),
    notesResources: mockDividedLearnNotesResources.map((item) => ({ ...item })),
  });
}

export async function getEnterpriseTopicContent(topic: string): Promise<{ videoLectures: EnterpriseVideo[]; studyMaterials: EnterpriseMaterial[] }> {
  // Future API call
  // return apiRequest<{ videoLectures: EnterpriseVideo[]; studyMaterials: EnterpriseMaterial[] }>(`/subjects/topic/${topic}`);
  return Promise.resolve({
    videoLectures: [
      { id: "v1", title: `${topic} - Introduction`, instructor: "Dr. Rajesh Verma", duration: "25 min", views: 1247, completed: true },
      { id: "v2", title: `${topic} - Advanced Concepts`, instructor: "Prof. Anita Sharma", duration: "32 min", views: 1156, completed: false },
      { id: "v3", title: `${topic} - Problem Solving`, instructor: "Dr. Rajesh Verma", duration: "28 min", views: 1089, completed: false },
    ],
    studyMaterials: [
      { id: "m1", title: `${topic} - Complete Formula Sheet`, type: "Formula Sheet", pages: 8 },
      { id: "m2", title: `${topic} - Concept Notes`, type: "Concept Notes", pages: 12 },
      { id: "m3", title: `${topic} - Common Mistakes`, type: "Error Analysis", pages: 6 },
      { id: "m4", title: `${topic} - Practice Problems`, type: "Practice Set", pages: 24 },
    ],
  });
}

export async function getTopicResources(topicTitle: string): Promise<{ videoResources: TopicVideoResource[]; noteResources: TopicNoteResource[] }> {
  // Future API call
  // return apiRequest<{ videoResources: TopicVideoResource[]; noteResources: TopicNoteResource[] }>(`/subjects/topic-resources/${topicTitle}`);
  return Promise.resolve({
    videoResources: [
      { id: "v1", title: `${topicTitle} - Introduction`, instructor: "Dr. Rajesh Verma", duration: "25 min", views: 1247, rating: 4.8, description: "Foundational concepts and theory" },
      { id: "v2", title: `${topicTitle} - Advanced Concepts`, instructor: "Prof. Anita Sharma", duration: "32 min", views: 1156, rating: 4.9, description: "Deep dive into complex applications" },
      { id: "v3", title: `${topicTitle} - Problem Solving`, instructor: "Dr. Rajesh Verma", duration: "28 min", views: 1089, rating: 4.7, description: "Step-by-step problem solving techniques" },
    ],
    noteResources: [
      { id: "n1", title: `${topicTitle} - Complete Formula Sheet`, type: "Formula Sheet", pages: 8, downloads: 2341, rating: 4.9, description: "All important formulas in one place" },
      { id: "n2", title: `${topicTitle} - Concept Notes`, type: "Concept Notes", pages: 12, downloads: 1876, rating: 4.8, description: "Detailed explanation with diagrams" },
      { id: "n3", title: `${topicTitle} - Common Mistakes`, type: "Error Analysis", pages: 6, downloads: 1654, rating: 4.7, description: "Avoid these frequent errors" },
      { id: "n4", title: `${topicTitle} - Practice Problems`, type: "Practice Problems", pages: 24, downloads: 1234, rating: 4.8, description: "50+ challenging problems with solutions" },
    ],
  });
}

export async function getResourceViewerContent(): Promise<{
  formulaData: FormulaItem[];
  conceptData: ConceptItem[];
  diagramData: DiagramItem[];
  mistakeData: MistakeItem[];
  strategyData: StrategyItem[];
  quickFacts: string[];
  keyEquations: string[];
}> {
  // Future API call
  // return apiRequest("/subjects/resource-viewer");
  return Promise.resolve({
    formulaData: mockResourceViewerContent.formulaData.map((item) => ({
      ...item,
      variables: item.variables.map((v) => ({ ...v })),
      applications: [...item.applications],
    })),
    conceptData: mockResourceViewerContent.conceptData.map((item) => ({ ...item, keyPoints: [...item.keyPoints] })),
    diagramData: mockResourceViewerContent.diagramData.map((item) => ({ ...item })),
    mistakeData: mockResourceViewerContent.mistakeData.map((item) => ({ ...item })),
    strategyData: mockResourceViewerContent.strategyData.map((item) => ({ ...item, items: [...item.items] })),
    quickFacts: [...mockResourceViewerContent.quickFacts],
    keyEquations: [...mockResourceViewerContent.keyEquations],
  });
}

export async function getVideoPlayerSupportData(): Promise<{ discussionThreads: DiscussionThread[]; transcript: TranscriptItem[] }> {
  // Future API call
  // return apiRequest<{ discussionThreads: DiscussionThread[]; transcript: TranscriptItem[] }>("/subjects/video-player/support");
  return Promise.resolve({
    discussionThreads: mockVideoPlayerSupportData.discussionThreads.map((item) => ({ ...item })),
    transcript: mockVideoPlayerSupportData.transcript.map((item) => ({ ...item })),
  });
}

export async function getNotesResourcesPageContent(): Promise<{
  notesSections: NotesSection[];
  resources: NotesResourcesCollections;
  relatedTopics: string[];
}> {
  // Future API call
  // return apiRequest("/subjects/notes-resources/content");
  return Promise.resolve({
    notesSections: mockNotesResourcesPageContent.notesSections.map((section) => {
      const mappedSection: NotesSection = {
        id: section.id,
        title: section.title,
        content: section.content,
      };

      if ("keyPoints" in section) {
        mappedSection.keyPoints = [...section.keyPoints];
      }

      if ("formulas" in section) {
        mappedSection.formulas = section.formulas.map((formula) => ({ ...formula }));
      }

      if ("steps" in section) {
        mappedSection.steps = [...section.steps];
      }

      if ("misconceptions" in section) {
        mappedSection.misconceptions = [...section.misconceptions];
      }

      return mappedSection;
    }),
    resources: {
      videos: mockNotesResourcesPageContent.resources.videos.map((video) => ({ ...video })),
      pdfs: mockNotesResourcesPageContent.resources.pdfs.map((pdf) => ({ ...pdf })),
      practice: mockNotesResourcesPageContent.resources.practice.map((practice) => ({ ...practice })),
      links: mockNotesResourcesPageContent.resources.links.map((link) => ({ ...link })),
    },
    relatedTopics: [...mockNotesResourcesPageContent.relatedTopics],
  });
}

export async function getRevisionPlannerContent(): Promise<{
  revisionSchedule: RevisionSession[];
  topicsToRevise: RevisionTopic[];
  calendarEvents: RevisionCalendarEvent[];
}> {
  // Future API call
  // return apiRequest("/subjects/revision-planner/content");
  return Promise.resolve({
    revisionSchedule: mockRevisionPlannerContent.revisionSchedule.map((session) => ({ ...session })),
    topicsToRevise: mockRevisionPlannerContent.topicsToRevise.map((topic) => ({ ...topic })),
    calendarEvents: mockRevisionPlannerContent.calendarEvents.map((event) => ({ ...event, topics: [...event.topics] })),
  });
}

export async function getLearningPathContent(): Promise<{ modules: LearningPathModule[]; aiInsight: LearningPathInsight }> {
  // Future API call
  // return apiRequest<{ modules: LearningPathModule[]; aiInsight: LearningPathInsight }>("/subjects/learning-path");
  return Promise.resolve({
    modules: mockLearningPathContent.modules.map((module) => ({ ...module })),
    aiInsight: { ...mockLearningPathContent.aiInsight },
  });
}

export async function getAnalyticsViewContent(): Promise<{ snapshot: AnalyticsSnapshot; topics: AnalyticsHeatmapTopic[] }> {
  // Future API call
  // return apiRequest<{ snapshot: AnalyticsSnapshot; topics: AnalyticsHeatmapTopic[] }>("/subjects/analytics-view");
  return Promise.resolve({
    snapshot: { ...mockAnalyticsViewContent.snapshot },
    topics: mockAnalyticsViewContent.topics.map((topic) => ({ ...topic })),
  });
}

export async function getTestAnalyticsResourcesForTopic(topic: string, isWeak: boolean): Promise<{ videos: TestAnalyticsVideo[]; notes: TestAnalyticsNote[] }> {
  // Future API call
  // return apiRequest<{ videos: TestAnalyticsVideo[]; notes: TestAnalyticsNote[] }>(`/subjects/test-analytics/resources/${topic}`);
  const videos = mockTestAnalyticsTemplates.videos.map((item) => ({
    title: item.titlePattern.replace("{topic}", topic),
    instructor: item.instructor,
    duration: item.duration,
    level: item.level,
    views: item.views,
    rating: item.rating,
  }));

  const notes = mockTestAnalyticsTemplates.notes.map((item) => ({
    title: item.titlePattern.replace("{topic}", topic),
    pages: item.pages,
    size: item.size,
    downloads: item.downloads,
    rating: item.rating,
  }));

  return Promise.resolve({
    videos: isWeak ? videos : videos.slice(0, 2),
    notes: isWeak ? notes : notes.slice(0, 2),
  });
}

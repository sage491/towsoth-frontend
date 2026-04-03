export interface TopicSubtopic {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface SubjectTopic {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  subtopics: TopicSubtopic[];
}

export const topicCatalog: SubjectTopic[] = [
  {
    id: 'em-induction',
    title: 'Electromagnetic Induction',
    description: "Faraday's law, Lenz's law, and induced EMF",
    estimatedTime: '3h 30m',
    difficulty: 'Advanced',
    progress: 85,
    status: 'in-progress',
    subtopics: [
      { id: '1', title: "Faraday's Law", duration: '45 min', completed: true },
      { id: '2', title: "Lenz's Law", duration: '35 min', completed: true },
      { id: '3', title: 'Induced EMF', duration: '50 min', completed: false },
      { id: '4', title: 'Applications', duration: '40 min', completed: false },
    ]
  },
  {
    id: 'rotation',
    title: 'Rotational Dynamics',
    description: 'Torque, angular momentum, and rotational motion',
    estimatedTime: '4h 15m',
    difficulty: 'Advanced',
    progress: 60,
    status: 'in-progress',
    subtopics: [
      { id: '1', title: 'Torque & Angular Momentum', duration: '55 min', completed: true },
      { id: '2', title: 'Moment of Inertia', duration: '50 min', completed: true },
      { id: '3', title: 'Rolling Motion', duration: '45 min', completed: false },
      { id: '4', title: 'Conservation Laws', duration: '40 min', completed: false },
    ]
  },
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    description: 'Laws of thermodynamics, heat engines, and entropy',
    estimatedTime: '5h 20m',
    difficulty: 'Expert',
    progress: 25,
    status: 'in-progress',
    subtopics: [
      { id: '1', title: 'First Law', duration: '60 min', completed: true },
      { id: '2', title: 'Second Law', duration: '65 min', completed: false },
      { id: '3', title: 'Heat Engines', duration: '55 min', completed: false },
      { id: '4', title: 'Entropy', duration: '70 min', completed: false },
    ]
  },
  {
    id: 'optics',
    title: 'Ray Optics and Wave Optics',
    description: 'Reflection, refraction, interference, and diffraction',
    estimatedTime: '4h 45m',
    difficulty: 'Intermediate',
    progress: 0,
    status: 'not-started',
    subtopics: [
      { id: '1', title: 'Ray Optics', duration: '50 min', completed: false },
      { id: '2', title: 'Wave Theory', duration: '55 min', completed: false },
      { id: '3', title: 'Interference', duration: '60 min', completed: false },
      { id: '4', title: 'Diffraction', duration: '50 min', completed: false },
    ]
  },
];

// Dummy data for the application
export const subjects = [
  {
    id: 1,
    name: "Mathematics",
    description: "Advanced calculus and algebra concepts",
    progress: 75,
    totalNotes: 12,
    completedNotes: 9,
    totalVideos: 8,
    watchedVideos: 6
  },
  {
    id: 2,
    name: "Physics",
    description: "Classical and modern physics principles",
    progress: 60,
    totalNotes: 15,
    completedNotes: 9,
    totalVideos: 10,
    watchedVideos: 6
  },
  {
    id: 3,
    name: "Chemistry",
    description: "Organic and inorganic chemistry",
    progress: 45,
    totalNotes: 18,
    completedNotes: 8,
    totalVideos: 12,
    watchedVideos: 5
  },
  {
    id: 4,
    name: "Biology",
    description: "Cell biology and genetics",
    progress: 80,
    totalNotes: 10,
    completedNotes: 8,
    totalVideos: 6,
    watchedVideos: 5
  }
];

export const notes = {
  1: [ // Mathematics
    {
      id: 1,
      title: "Differential Calculus Basics",
      description: "Introduction to derivatives and their applications",
      type: "pdf",
      url: "/notes/math/differential-calculus.pdf",
      completed: true
    },
    {
      id: 2,
      title: "Integration Techniques",
      description: "Various methods of integration",
      type: "pdf",
      url: "/notes/math/integration.pdf",
      completed: true
    },
    {
      id: 3,
      title: "Linear Algebra Fundamentals",
      description: "Matrices, vectors, and linear transformations",
      type: "text",
      url: "/notes/math/linear-algebra.html",
      completed: false
    }
  ],
  2: [ // Physics
    {
      id: 4,
      title: "Newton's Laws of Motion",
      description: "Classical mechanics principles",
      type: "pdf",
      url: "/notes/physics/newtons-laws.pdf",
      completed: true
    },
    {
      id: 5,
      title: "Electromagnetic Theory",
      description: "Electric and magnetic fields",
      type: "pdf",
      url: "/notes/physics/electromagnetism.pdf",
      completed: false
    }
  ],
  3: [ // Chemistry
    {
      id: 6,
      title: "Organic Reactions",
      description: "Common organic chemistry reactions",
      type: "pdf",
      url: "/notes/chemistry/organic-reactions.pdf",
      completed: false
    },
    {
      id: 7,
      title: "Periodic Table Trends",
      description: "Understanding periodic properties",
      type: "text",
      url: "/notes/chemistry/periodic-trends.html",
      completed: true
    }
  ],
  4: [ // Biology
    {
      id: 8,
      title: "Cell Structure and Function",
      description: "Detailed study of cellular components",
      type: "pdf",
      url: "/notes/biology/cell-structure.pdf",
      completed: true
    },
    {
      id: 9,
      title: "DNA and RNA",
      description: "Molecular biology fundamentals",
      type: "pdf",
      url: "/notes/biology/dna-rna.pdf",
      completed: true
    }
  ]
};

export const videos = {
  1: [ // Mathematics
    {
      id: 1,
      title: "Calculus Made Easy",
      description: "Visual explanation of calculus concepts",
      youtubeId: "WUvTyaaNkzM",
      duration: "15:30",
      watched: true
    },
    {
      id: 2,
      title: "Linear Algebra Essence",
      description: "Understanding linear transformations",
      youtubeId: "fNk_zzaMoSs",
      duration: "12:45",
      watched: false
    }
  ],
  2: [ // Physics
    {
      id: 3,
      title: "Physics Fundamentals",
      description: "Basic physics concepts explained",
      youtubeId: "ZM8ECpBuQYE",
      duration: "18:20",
      watched: true
    },
    {
      id: 4,
      title: "Quantum Mechanics Intro",
      description: "Introduction to quantum physics",
      youtubeId: "7kb1VT0J3DE",
      duration: "22:15",
      watched: false
    }
  ],
  3: [ // Chemistry
    {
      id: 5,
      title: "Chemical Bonding",
      description: "How atoms bond together",
      youtubeId: "QqjcCvzWwww",
      duration: "14:30",
      watched: false
    }
  ],
  4: [ // Biology
    {
      id: 6,
      title: "Cell Division Process",
      description: "Mitosis and meiosis explained",
      youtubeId: "f-ldPgEfAHI",
      duration: "16:45",
      watched: true
    }
  ]
};

export const leaderboard = [
  {
    id: 1,
    name: "Alice Johnson",
    points: 2450,
    completedNotes: 45,
    watchedVideos: 32,
    rank: 1
  },
  {
    id: 2,
    name: "Bob Smith",
    points: 2380,
    completedNotes: 42,
    watchedVideos: 30,
    rank: 2
  },
  {
    id: 3,
    name: "Carol Davis",
    points: 2290,
    completedNotes: 38,
    watchedVideos: 28,
    rank: 3
  },
  {
    id: 4,
    name: "David Wilson",
    points: 2150,
    completedNotes: 35,
    watchedVideos: 25,
    rank: 4
  },
  {
    id: 5,
    name: "Eva Brown",
    points: 2080,
    completedNotes: 33,
    watchedVideos: 24,
    rank: 5
  }
];

export const userProgress = {
  totalNotesCompleted: 34,
  totalVideosWatched: 22,
  totalPoints: 1950,
  currentRank: 8,
  weeklyGoal: 5,
  weeklyProgress: 3,
  subjects: subjects.map(subject => ({
    ...subject,
    recentActivity: [
      { type: 'note', title: 'Completed: Integration Techniques', date: '2024-01-20' },
      { type: 'video', title: 'Watched: Calculus Made Easy', date: '2024-01-19' }
    ]
  }))
};

// Mock users for authentication
export const users = [
  {
    id: 1,
    name: "Student User",
    email: "student@example.com",
    role: "student",
    enrolledSubjects: [1, 2, 3],
    profileImage: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    profileImage: "https://i.pravatar.cc/150?img=2"
  }
];

// Mock quizzes
export const quizzes = {
  1: [ // Mathematics
    {
      id: 1,
      title: "Calculus Fundamentals",
      description: "Test your knowledge of basic calculus concepts",
      timeLimit: 30, // minutes
      questions: 10,
      completed: false
    }
  ],
  2: [ // Physics
    {
      id: 2,
      title: "Classical Mechanics",
      description: "Questions on Newton's laws and applications",
      timeLimit: 25,
      questions: 8,
      completed: true
    }
  ]
};

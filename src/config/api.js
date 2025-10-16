// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  SUBJECTS: {
    ALL: '/subjects',
    BY_ID: (id) => `/subjects/${id}`,
    ENROLLED: '/subjects/enrolled',
    ENROLL: (id) => `/subjects/enroll/${id}`,
  },
  NOTES: {
    ALL: '/notes',
    BY_ID: (id) => `/notes/${id}`,
    BY_SUBJECT: (subjectId) => `/subjects/${subjectId}/notes`,
    COMPLETE: (id) => `/notes/${id}/complete`,
  },
  VIDEOS: {
    ALL: '/videos',
    BY_ID: (id) => `/videos/${id}`,
    BY_SUBJECT: (subjectId) => `/subjects/${subjectId}/videos`,
    WATCH: (id) => `/videos/${id}/watch`,
  },
  PROGRESS: {
    OVERALL: '/progress',
    BY_SUBJECT: (subjectId) => `/progress/subject/${subjectId}`,
    COMPLETED: '/progress/completed',
    PENDING: '/progress/pending',
  },
  QUIZZES: {
    ALL: '/quizzes',
    BY_ID: (id) => `/quizzes/${id}`,
    BY_SUBJECT: (subjectId) => `/quizzes/subject/${subjectId}`,
    SUBMIT: (quizId) => `/quizzes/${quizId}/submit`,
    ATTEMPTS: '/quizzes/attempts/me',
  },
  LEADERBOARD: {
    GLOBAL: '/leaderboard',
    BY_SUBJECT: (subjectId) => `/leaderboard/subject/${subjectId}`,
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id) => `/admin/users/${id}`,
    UPDATE_ROLE: (id) => `/admin/users/${id}/role`,
    DELETE_USER: (id) => `/admin/users/${id}`,
    STATS: '/admin/stats',
  },
};

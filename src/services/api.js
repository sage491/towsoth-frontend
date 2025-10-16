import { API_CONFIG } from '@/config/api';

// API Base URL - Using the configured base URL
const API_BASE_URL = API_CONFIG.BASE_URL;

// Simple in-memory cache with TTL
class APICache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data, expiresAt });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

const apiCache = new APICache();

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to create headers with auth
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API request function with caching
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  // Build fetch config safely: merge options but normalize cache flag
  const baseConfig = {
    headers: createHeaders(options.auth !== false),
    mode: 'cors',
    ...options,
  };
  const config = { ...baseConfig };
  // Normalize invalid cache values: map boolean false to 'no-store'
  if (options && Object.prototype.hasOwnProperty.call(options, 'cache')) {
    if (options.cache === false) {
      config.cache = 'no-store';
    } else if (typeof options.cache === 'string') {
      // Allow explicit RequestCache strings (e.g., 'no-store', 'reload')
      config.cache = options.cache;
    } else {
      // Remove invalid cache values
      delete config.cache;
    }
  }

  // Check cache for GET requests (unless explicitly disabled)
  const method = config.method || 'GET';
  const cacheKey = `${method}:${endpoint}`;
  const shouldCache = method === 'GET' && options.cache !== false;
  
  if (shouldCache) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for: ${endpoint}`);
      return cachedData;
    }
  }

  try {
    console.log(`Making API request to: ${url}`);
    
    // Always use real API. Mock data is disabled to avoid redundancy.
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      console.error(`API Error for ${endpoint}:`, errorMessage, errorData);
      
      // If unauthorized, clear token and redirect to appropriate login page
      if (response.status === 401) {
        try {
          const profileStr = localStorage.getItem('userProfile');
          let role = null;
          if (profileStr) {
            try { role = JSON.parse(profileStr)?.role; } catch {}
          }
          localStorage.removeItem('authToken');
          localStorage.removeItem('userProfile');
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname || '';
            const target = role === 'admin' ? '/admin-login' : '/login';
            // Avoid redundant redirects if already on a login page
            if (!currentPath.startsWith('/login') && !currentPath.startsWith('/admin-login')) {
              window.location.replace(target);
            }
          }
        } catch {}
      }

      // Check for specific database connection errors
      if (errorMessage.includes('database') || errorMessage.includes('MongoDB') || response.status === 503) {
        console.error('Database connection issue detected');
        // You could trigger a specific UI notification here
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Cache successful GET responses
    if (shouldCache) {
      apiCache.set(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    
    // Enhanced error logging
    console.error(`API request failed for ${endpoint}:`, error.message || error);
    
    // Check if this might be a database connection issue
    if (error.message && (error.message.includes('timeout') || error.message.includes('network') || error.message.includes('failed to fetch'))) {
      console.error('Possible database or server connection issue');
      // You could trigger a specific UI notification here
    }
    
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    });
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      auth: false,
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  updateProfile: async (data) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
  },

  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      auth: false,
    });
  },

  resetPassword: async (token, password) => {
    return apiRequest(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
      auth: false,
    });
  },
};

// Subjects API
export const subjectsAPI = {
  getAll: async (filters = {}, options = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    const path = queryString ? `/subjects?${queryString}` : '/subjects';
    return apiRequest(path, options);
  },

  getById: async (id) => {
    return apiRequest(`/subjects/${id}`);
  },

  getEnrolled: async () => {
    return apiRequest('/subjects/enrolled');
  },

  enroll: async (subjectId) => {
    return apiRequest(`/subjects/enroll/${subjectId}`, {
      method: 'POST',
    });
  },
};

// Notes API
export const notesAPI = {
  getAll: async () => {
    return apiRequest('/notes');
  },

  getById: async (id) => {
    return apiRequest(`/notes/${id}`);
  },

  getBySubject: async (subjectId) => {
    // Align with backend route: GET /api/subjects/:id/notes
    // Notes lists change frequently; avoid caching to prevent stale dashboards
    return apiRequest(`/subjects/${subjectId}/notes`, { cache: false });
  },

  markComplete: async (noteId) => {
    return apiRequest(`/notes/${noteId}/complete`, {
      method: 'POST',
    });
  },
};

// Videos API
export const videosAPI = {
  getAll: async () => {
    return apiRequest('/videos');
  },

  getById: async (id) => {
    return apiRequest(`/videos/${id}`);
  },

  getBySubject: async (subjectId) => {
    // Align with backend route: GET /api/subjects/:subjectId/videos
    // Disable caching to prevent stale video counts/lists
    return apiRequest(`/subjects/${subjectId}/videos`, { cache: false });
  },

  markWatched: async (videoId) => {
    return apiRequest(`/videos/${videoId}/watch`, {
      method: 'POST',
    });
  },
};

// Quizzes API
export const quizzesAPI = {
  getAll: async () => {
    return apiRequest('/quizzes');
  },

  getById: async (id) => {
    return apiRequest(`/quizzes/${id}`);
  },

  getBySubject: async (subjectId) => {
    return apiRequest(`/quizzes/subject/${subjectId}`);
  },

  submit: async (quizId, answers) => {
    return apiRequest(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  getAttempts: async () => {
    return apiRequest('/quizzes/attempts/me');
  },
};

// Progress API
export const progressAPI = {
  getOverall: async () => {
    return apiRequest('/progress');
  },

  getBySubject: async (subjectId) => {
    return apiRequest(`/progress/subject/${subjectId}`);
  },

  getCompleted: async () => {
    return apiRequest('/progress/completed');
  },

  getPending: async () => {
    return apiRequest('/progress/pending');
  },
  
  updateProgress: async (data) => {
    // Clear related cache entries when updating progress
    apiCache.delete('GET:/progress');
    apiCache.delete('GET:/progress/completed');
    apiCache.delete('GET:/progress/pending');
    apiCache.delete('GET:/progress/dashboard');
    apiCache.delete('GET:/progress/enhanced-dashboard');
    
    return apiRequest('/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getDashboardData: async () => {
    return apiRequest('/progress/dashboard');
  },

  getEnhancedDashboardData: async () => {
    return apiRequest('/progress/enhanced-dashboard');
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: async () => {
    return apiRequest('/leaderboard');
  },

  getBySubject: async (subjectId) => {
    return apiRequest(`/leaderboard/subject/${subjectId}`);
  },
};

// Subject Options API
export const subjectOptionsAPI = {
  getAll: async (filters = {}) => {
    const { year, semester } = filters;
    let url = '/subject-options';
    
    // Add query parameters if filters are provided
    if (year || semester) {
      const params = new URLSearchParams();
      if (year) params.append('year', year);
      if (semester) params.append('semester', semester);
      url = `${url}?${params.toString()}`;
    }
    
    return apiRequest(url);
  },

  getById: async (id) => {
    return apiRequest(`/subject-options/${id}`);
  },

  create: async (data) => {
    // Clear subject options cache when creating new data
    apiCache.delete('GET:/subject-options');
    
    return apiRequest('/subject-options', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    // Clear subject options cache when updating data
    apiCache.delete('GET:/subject-options');
    apiCache.delete(`GET:/subject-options/${id}`);
    
    return apiRequest(`/subject-options/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    // Clear subject options cache when deleting data
    apiCache.delete('GET:/subject-options');
    apiCache.delete(`GET:/subject-options/${id}`);
    
    return apiRequest(`/subject-options/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  login: async (email, password) => {
    return apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    });
  },

  getUsers: async () => {
    return apiRequest('/admin/users');
  },

  getUserById: async (id) => {
    return apiRequest(`/admin/users/${id}`);
  },

  updateUserRole: async (id, role) => {
    // Clear admin cache when updating user roles
    apiCache.delete('GET:/admin/users');
    apiCache.delete(`GET:/admin/users/${id}`);
    apiCache.delete('GET:/admin/stats');
    
    return apiRequest(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (id) => {
    // Clear admin cache when deleting users
    apiCache.delete('GET:/admin/users');
    apiCache.delete(`GET:/admin/users/${id}`);
    apiCache.delete('GET:/admin/stats');
    
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  listAdmins: async () => {
    return apiRequest('/admin/list');
  },
  
  // Subject management
  createSubject: async (subjectData) => {
    // Clear subject-related cache when creating subjects
    apiCache.delete('GET:/subjects');
    apiCache.delete('GET:/admin/stats');
    
    return apiRequest('/admin/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  },
  
  updateSubject: async (id, subjectData) => {
    // Clear subject-related cache when updating subjects
    apiCache.delete('GET:/subjects');
    apiCache.delete(`GET:/subjects/${id}`);
    apiCache.delete('GET:/admin/stats');
    
    return apiRequest(`/admin/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
  },
  
  deleteSubject: async (id) => {
    // Clear subject-related cache when deleting subjects
    apiCache.delete('GET:/subjects');
    apiCache.delete(`GET:/subjects/${id}`);
    apiCache.delete('GET:/admin/stats');
    
    return apiRequest(`/admin/subjects/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Note management
  createNote: async (noteData) => {
    const result = await apiRequest('/admin/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
    // Invalidate caches so subject lists and counts refresh in real-time
    try {
      apiCache.delete('GET:/subjects');
      const subject = noteData?.subject || noteData?.subject_id || noteData?.subjectId;
      if (subject) {
        apiCache.delete(`GET:/subjects/${subject}/notes`);
        apiCache.delete(`GET:/subjects/${subject}/videos`);
      }
    } catch {}
    return result;
  },
  
  updateNote: async (id, noteData) => {
    const result = await apiRequest(`/admin/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
    // Invalidate caches so subject lists and counts refresh in real-time
    try {
      apiCache.delete('GET:/subjects');
      const subject = noteData?.subject || noteData?.subject_id || noteData?.subjectId;
      if (subject) {
        apiCache.delete(`GET:/subjects/${subject}/notes`);
        apiCache.delete(`GET:/subjects/${subject}/videos`);
      }
    } catch {}
    return result;
  },
  
  deleteNote: async (id, subjectId) => {
    const result = await apiRequest(`/admin/notes/${id}`, {
      method: 'DELETE',
    });
    // Invalidate caches so deletions reflect immediately on student dashboards
    try {
      apiCache.delete('GET:/notes');
      apiCache.delete('GET:/subjects');
      if (subjectId) {
        apiCache.delete(`GET:/subjects/${subjectId}/notes`);
        // Progress dashboards may aggregate counts by subject
        apiCache.delete(`GET:/progress/subject/${subjectId}`);
      }
      // Clear general progress dashboards
      apiCache.delete('GET:/progress');
      apiCache.delete('GET:/progress/dashboard');
      apiCache.delete('GET:/progress/enhanced-dashboard');
    } catch {}
    return result;
  },

  // Video management
  deleteVideo: async (id, subjectId) => {
    const result = await apiRequest(`/admin/videos/${id}`, {
      method: 'DELETE',
    });
    // Invalidate caches so deletions reflect immediately on dashboards and pages
    try {
      apiCache.delete('GET:/videos');
      apiCache.delete('GET:/subjects');
      if (subjectId) {
        apiCache.delete(`GET:/subjects/${subjectId}/videos`);
        // Progress dashboards may aggregate video counts by subject
        apiCache.delete(`GET:/progress/subject/${subjectId}`);
      }
      apiCache.delete('GET:/progress');
      apiCache.delete('GET:/progress/dashboard');
      apiCache.delete('GET:/progress/enhanced-dashboard');
    } catch {}
    return result;
  },

  // Announcement management
  getAnnouncements: async () => {
    return apiRequest('/announcements');
  },

  getAnnouncement: async (id) => {
    return apiRequest(`/announcements/${id}`);
  },

  createAnnouncement: async (announcementData) => {
    const result = await apiRequest('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
    try {
      apiCache.delete('GET:/announcements');
    } catch {}
    return result;
  },

  updateAnnouncement: async (id, announcementData) => {
    const result = await apiRequest(`/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
    try {
      apiCache.delete('GET:/announcements');
      apiCache.delete(`GET:/announcements/${id}`);
    } catch {}
    return result;
  },

  deleteAnnouncement: async (id) => {
    const result = await apiRequest(`/admin/announcements/${id}`, {
      method: 'DELETE',
    });
    try {
      apiCache.delete('GET:/announcements');
      apiCache.delete(`GET:/announcements/${id}`);
    } catch {}
    return result;
  },

  // Unified content upload (PDF or Video)
  uploadContent: async ({ title, description, year, subject, type, fileURL, videoURL }) => {
    // Direct uploads happen in the frontend via Supabase; backend receives JSON metadata
    const result = await apiRequest('/admin/upload-content', {
      method: 'POST',
      body: JSON.stringify({ title, description, year, subject, type, fileURL, videoURL }),
    });
    // Invalidate caches so newly uploaded content appears immediately
    try {
      apiCache.delete('GET:/subjects');
      if (subject) {
        apiCache.delete(`GET:/subjects/${subject}/notes`);
        apiCache.delete(`GET:/subjects/${subject}/videos`);
      }
    } catch {}
    return result;
  },
  // New: upload a raw file via multipart/form-data to backend which stores in Supabase
  uploadFile: async (formData) => {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const result = await apiRequest('/admin/upload', {
      method: 'POST',
      body: formData,
      headers,
    });
    // Clear broad caches since subject is unknown here; UI will refetch
    try {
      apiCache.clear();
    } catch {}
    return result;
  },
};

// Create announcementsAPI object
export const announcementsAPI = {
  getAnnouncements: async () => {
    return apiRequest('/announcements');
  },

  getAnnouncement: async (id) => {
    return apiRequest(`/announcements/${id}`);
  },

  createAnnouncement: async (announcementData) => {
    return apiRequest('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  },

  updateAnnouncement: async (id, announcementData) => {
    return apiRequest(`/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  },

  deleteAnnouncement: async (id) => {
    return apiRequest(`/admin/announcements/${id}`, {
      method: 'DELETE',
    });
  },
};

// Utility functions
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const setUserProfile = (profile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

export const getUserProfile = () => {
  const profile = localStorage.getItem('userProfile');
  if (!profile || profile === 'undefined') {
    return null;
  }
  try {
    return JSON.parse(profile);
  } catch (error) {
    console.warn('Failed to parse user profile from localStorage:', error);
    localStorage.removeItem('userProfile');
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

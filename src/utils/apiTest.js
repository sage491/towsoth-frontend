import { API_CONFIG } from '../config/api';
import axios from 'axios';

/**
 * Tests the connection to the backend API
 * @returns {Promise<{success: boolean, message: string}>} Result of the connection test
 */
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', API_CONFIG.BASE_URL);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: API_CONFIG.TIMEOUT,
    });
    
    if (response.ok) {
      return { 
        success: true, 
        message: 'Successfully connected to the backend API' 
      };
    } else {
      return { 
        success: false, 
        message: `Failed to connect to API: HTTP ${response.status}` 
      };
    }
  } catch (error) {
    console.error('API connection test failed:', error);
    return { 
      success: false, 
      message: `Connection error: ${error.message}` 
    };
  }
};

// Export a function to log the current API configuration
export const logApiConfig = () => {
  console.log('Current API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    TIMEOUT: API_CONFIG.TIMEOUT,
    ENV: typeof import.meta !== 'undefined' ? import.meta.env.MODE : 'unknown',
    IS_PROD: typeof import.meta !== 'undefined' ? import.meta.env.PROD : false,
  });
};

/**
 * Comprehensive API testing functions for integration testing
 */

// Test authentication endpoints
export const testAuthEndpoints = async () => {
  const results = {
    register: { success: false, data: null, error: null },
    login: { success: false, data: null, error: null },
    profile: { success: false, data: null, error: null },
  };

  // Test user data
  const testUser = {
    name: 'Frontend Test User',
    email: `test-${Date.now()}@example.com`, // Ensure unique email
    password: 'test123',
    university: 'Test University',
    year: '2nd',
  };

  try {
    // Test registration
    try {
      const registerResponse = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/register`, testUser);
      results.register = {
        success: true,
        data: registerResponse.data,
        error: null,
      };
    } catch (error) {
      results.register = {
        success: false,
        data: null,
        error: error.response?.data || error.message,
      };
    }

    // Test login
    try {
      const loginResponse = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password,
      });
      results.login = {
        success: true,
        data: loginResponse.data,
        error: null,
      };

      // If login successful, test profile
      if (loginResponse.data.token) {
        try {
          const profileResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${loginResponse.data.token}` },
          });
          results.profile = {
            success: true,
            data: profileResponse.data,
            error: null,
          };
        } catch (error) {
          results.profile = {
            success: false,
            data: null,
            error: error.response?.data || error.message,
          };
        }
      }
    } catch (error) {
      results.login = {
        success: false,
        data: null,
        error: error.response?.data || error.message,
      };
    }
  } catch (error) {
    console.error('Test failed:', error);
  }

  return results;
};

// Test subject endpoints
export const testSubjectEndpoints = async () => {
  const results = {
    getAllSubjects: { success: false, data: null, error: null },
    getSubject: { success: false, data: null, error: null },
    getSubjectNotes: { success: false, data: null, error: null },
  };

  try {
    // Test get all subjects
    try {
      const subjectsResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/subjects`);
      results.getAllSubjects = {
        success: true,
        data: subjectsResponse.data,
        error: null,
      };

      // If subjects exist, test get single subject and subject notes
      if (subjectsResponse.data.data && subjectsResponse.data.data.length > 0) {
        const subjectId = subjectsResponse.data.data[0]._id;

        // Test get subject by ID
        try {
          const subjectResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/subjects/${subjectId}`);
          results.getSubject = {
            success: true,
            data: subjectResponse.data,
            error: null,
          };
        } catch (error) {
          results.getSubject = {
            success: false,
            data: null,
            error: error.response?.data || error.message,
          };
        }

        // Test get subject notes
        try {
          const notesResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/subjects/${subjectId}/notes`);
          results.getSubjectNotes = {
            success: true,
            data: notesResponse.data,
            error: null,
          };
        } catch (error) {
          results.getSubjectNotes = {
            success: false,
            data: null,
            error: error.response?.data || error.message,
          };
        }
      }
    } catch (error) {
      results.getAllSubjects = {
        success: false,
        data: null,
        error: error.response?.data || error.message,
      };
    }
  } catch (error) {
    console.error('Test failed:', error);
  }

  return results;
};

// Test note endpoints
export const testNoteEndpoints = async () => {
  const results = {
    getAllNotes: { success: false, data: null, error: null },
    getNote: { success: false, data: null, error: null },
  };

  try {
    // Test get all notes
    try {
      const notesResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/notes`);
      results.getAllNotes = {
        success: true,
        data: notesResponse.data,
        error: null,
      };

      // If notes exist, test get single note
      if (notesResponse.data.data && notesResponse.data.data.length > 0) {
        const noteId = notesResponse.data.data[0]._id;

        // Test get note by ID
        try {
          const noteResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/notes/${noteId}`);
          results.getNote = {
            success: true,
            data: noteResponse.data,
            error: null,
          };
        } catch (error) {
          results.getNote = {
            success: false,
            data: null,
            error: error.response?.data || error.message,
          };
        }
      }
    } catch (error) {
      results.getAllNotes = {
        success: false,
        data: null,
        error: error.response?.data || error.message,
      };
    }
  } catch (error) {
    console.error('Test failed:', error);
  }

  return results;
};

// Test progress endpoints (requires authentication)
export const testProgressEndpoints = async (token) => {
  if (!token) {
    return {
      error: 'Authentication token is required for progress endpoints',
    };
  }

  const results = {
    getUserProgress: { success: false, data: null, error: null },
    updateProgress: { success: false, data: null, error: null },
    getDashboardData: { success: false, data: null, error: null },
  };

  const headers = { Authorization: `Bearer ${token}` };

  try {
    // Test get user progress
    try {
      const progressResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/progress`, { headers });
      results.getUserProgress = {
        success: true,
        data: progressResponse.data,
        error: null,
      };
    } catch (error) {
      results.getUserProgress = {
        success: false,
        data: null,
        error: error.response?.data || error.message,
      };
    }

    // Get a note ID to update progress
    let noteId = null;
    try {
      const notesResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/notes`);
      if (notesResponse.data.data && notesResponse.data.data.length > 0) {
        noteId = notesResponse.data.data[0]._id;
      }
    } catch (error) {
      console.error('Could not get notes for progress test:', error);
    }

    // Test update progress if we have a note ID
    if (noteId) {
      try {
        const updateResponse = await axios.post(
          `${API_CONFIG.BASE_URL}/api/progress`,
          { noteId, status: 'in_progress' },
          { headers }
        );
        results.updateProgress = {
          success: true,
          data: updateResponse.data,
          error: null,
        };
      } catch (error) {
        results.updateProgress = {
          success: false,
          data: null,
          error: error.response?.data || error.message,
        };
      }
    }

    // Test get dashboard data
    try {
      const dashboardResponse = await axios.get(`${API_CONFIG.BASE_URL}/api/progress/dashboard`, { headers });
      results.getDashboardData = {
        success: true,
        data: dashboardResponse.data,
        error: null,
      };
    } catch (error) {
      results.getDashboardData = {
        success: false,
        data: null,
        error: error.response?.data || error.message,
      };
    }
  } catch (error) {
    console.error('Test failed:', error);
  }

  return results;
};

// Run all tests
export const runAllTests = async () => {
  console.log('Starting API integration tests...');
  
  // Test auth endpoints
  const authResults = await testAuthEndpoints();
  console.log('Auth endpoints test results:', authResults);
  
  // Test subject endpoints
  const subjectResults = await testSubjectEndpoints();
  console.log('Subject endpoints test results:', subjectResults);
  
  // Test note endpoints
  const noteResults = await testNoteEndpoints();
  console.log('Note endpoints test results:', noteResults);
  
  // Test progress endpoints if login was successful
  if (authResults.login.success && authResults.login.data.token) {
    const progressResults = await testProgressEndpoints(authResults.login.data.token);
    console.log('Progress endpoints test results:', progressResults);
  } else {
    console.log('Skipping progress endpoints tests due to failed login');
  }
  
  console.log('API integration tests completed!');
  
  return {
    auth: authResults,
    subjects: subjectResults,
    notes: noteResults,
    progress: authResults.login.success ? await testProgressEndpoints(authResults.login.data.token) : null,
  };
};
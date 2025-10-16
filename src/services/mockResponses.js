import { subjects, notes, videos, quizzes, users } from '../data/dummyData';

// Mock response generator for API endpoints
export const getMockResponse = (endpoint, options = {}) => {
  console.log(`Generating mock response for: ${endpoint}`);
  
  // Extract request data if available
  let requestData = {};
  if (options.body) {
    try {
      requestData = JSON.parse(options.body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
    }
  }

  // Auth endpoints
  if (endpoint.startsWith('/auth/login')) {
    const { email, password } = requestData;
    const user = users.find(u => u.email === email);
    
    if (user && password === 'password') { // Simple mock password check
      localStorage.setItem('mockUser', JSON.stringify(user));
      return {
        success: true,
        token: 'mock-jwt-token',
        user: { ...user, password: undefined }
      };
    }
    return { success: false, message: 'Invalid credentials' };
  }
  
  if (endpoint.startsWith('/auth/register')) {
    const newUser = {
      id: users.length + 1,
      ...requestData,
      role: 'student'
    };
    return {
      success: true,
      token: 'mock-jwt-token',
      user: { ...newUser, password: undefined }
    };
  }
  
  if (endpoint.startsWith('/auth/profile')) {
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      return { success: true, user: JSON.parse(mockUser) };
    }
    return { success: false, message: 'User not found' };
  }

  // Subjects endpoints
  if (endpoint === '/subjects') {
    return { success: true, data: subjects };
  }
  
  if (endpoint.match(/\/subjects\/\d+$/)) {
    const id = parseInt(endpoint.split('/').pop());
    const subject = subjects.find(s => s.id === id);
    return subject 
      ? { success: true, data: subject }
      : { success: false, message: 'Subject not found' };
  }
  
  if (endpoint === '/subjects/enrolled') {
    // Return enrolled subjects for the current user
    const mockUser = localStorage.getItem('mockUser');
    let enrolledSubjectIds = [];
    
    if (mockUser) {
      const user = JSON.parse(mockUser);
      enrolledSubjectIds = user.enrolledSubjects || [1, 2]; // Default to some subjects if not specified
    }
    
    const enrolledSubjects = subjects.filter(s => enrolledSubjectIds.includes(s.id));
    return { success: true, data: enrolledSubjects };
  }

  // Notes endpoints
  if (endpoint === '/notes') {
    return { 
      success: true, 
      data: Object.values(notes).flat() 
    };
  }
  
  // New path aligned with backend: /subjects/:id/notes
  if (endpoint.match(/^\/subjects\/[^\/]+\/notes$/)) {
    const parts = endpoint.split('/');
    const idSegment = parts[2];
    const subjectId = parseInt(idSegment, 10);
    const subjectNotes = Number.isNaN(subjectId) ? [] : (notes[subjectId] || []);
    return { success: true, data: subjectNotes };
  }
  
  if (endpoint.match(/\/notes\/subject\/\d+$/)) {
    const subjectId = parseInt(endpoint.split('/').pop());
    const subjectNotes = notes[subjectId] || [];
    return { success: true, data: subjectNotes };
  }

  // Videos endpoints
  if (endpoint === '/videos') {
    return { 
      success: true, 
      data: Object.values(videos || {}).flat() 
    };
  }
  
  // New path aligned with backend: /subjects/:id/videos
  if (endpoint.match(/^\/subjects\/[^\/]+\/videos$/)) {
    const parts = endpoint.split('/');
    const idSegment = parts[2];
    const subjectId = parseInt(idSegment, 10);
    const subjectVideos = Number.isNaN(subjectId) ? [] : (videos?.[subjectId] || []);
    return { success: true, data: subjectVideos };
  }
  
  if (endpoint.match(/\/videos\/subject\/\d+$/)) {
    const subjectId = parseInt(endpoint.split('/').pop());
    const subjectVideos = videos?.[subjectId] || [];
    return { success: true, data: subjectVideos };
  }

  // Progress endpoints
  if (endpoint === '/progress') {
    return {
      success: true,
      data: {
        overall: 65,
        subjects: subjects.map(s => ({
          id: s.id,
          name: s.name,
          progress: s.progress
        }))
      }
    };
  }
  
  if (endpoint === '/progress/dashboard') {
    const mockUser = localStorage.getItem('mockUser');
    let user = { name: 'Student', email: 'student@example.com' };
    
    if (mockUser) {
      user = JSON.parse(mockUser);
    }
    
    return {
      success: true,
      user: {
        ...user,
        _id: user.id || 1,
        university: 'Mock University',
        year: 2,
        semester: 1,
        subjectOption: 'Computer Science'
      },
      subjects: subjects.map(s => ({
        id: s.id,
        name: s.name,
        progress: s.progress || Math.floor(Math.random() * 100),
        totalNotes: Math.floor(Math.random() * 10) + 5,
        completedNotes: Math.floor(Math.random() * 5) + 2,
        totalVideos: Math.floor(Math.random() * 8) + 3,
        watchedVideos: Math.floor(Math.random() * 4) + 1
      }))
    };
  }
  
  if (endpoint === '/progress/enhanced-dashboard') {
    const mockUser = localStorage.getItem('mockUser');
    let user = { name: 'Student', email: 'student@example.com' };
    
    if (mockUser) {
      user = JSON.parse(mockUser);
    }
    
    // Generate mock performance trends data
    const today = new Date();
    const performanceTrends = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      performanceTrends.push({
        date: date.toISOString().split('T')[0],
        completedItems: Math.floor(Math.random() * 5) + 1,
        points: Math.floor(Math.random() * 50) + 10,
      });
    }
    
    // Mock upcoming events
    const upcomingEvents = [
      {
        id: 1,
        title: 'Assignment Due',
        date: '2023-11-15',
        type: 'assignment',
        subject: subjects[0]?.name || 'General'
      },
      {
        id: 2,
        title: 'Midterm Exam',
        date: '2023-11-20',
        type: 'exam',
        subject: subjects[1]?.name || 'General'
      },
      {
        id: 3,
        title: 'Study Group Meeting',
        date: '2023-11-12',
        type: 'meeting',
        subject: 'General'
      }
    ];
    
    return {
      success: true,
      user: {
        ...user,
        _id: user.id || 1,
        university: 'Mock University',
        year: 2,
        semester: 1,
        subjectOption: 'Computer Science',
        totalPoints: Math.floor(Math.random() * 500) + 100,
        rank: Math.floor(Math.random() * 100) + 1,
        studyHours: Math.floor(Math.random() * 50) + 20
      },
      subjects: subjects.map(s => ({
        id: s.id,
        name: s.name,
        progress: s.progress || Math.floor(Math.random() * 100),
        totalNotes: Math.floor(Math.random() * 10) + 5,
        completedNotes: Math.floor(Math.random() * 5) + 2,
        totalVideos: Math.floor(Math.random() * 8) + 3,
        watchedVideos: Math.floor(Math.random() * 4) + 1
      })),
      performanceTrends,
      upcomingEvents
    };
  }

  // Quizzes endpoints
  if (endpoint === '/quizzes') {
    return { 
      success: true, 
      data: Object.values(quizzes || {}).flat() 
    };
  }

  // Default response for unhandled endpoints
  console.warn(`No mock handler for endpoint: ${endpoint}`);
  return {
    success: false,
    message: 'Mock API: Endpoint not implemented',
    endpoint
  };
};
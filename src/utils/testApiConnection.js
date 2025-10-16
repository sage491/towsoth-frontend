// API Connection Test Utility
import { API_CONFIG } from '../config/api';

/**
 * Tests the connection to the backend API
 * @returns {Promise<Object>} Result of the connection test
 */
export const testApiConnection = async () => {
  const startTime = performance.now();
  const results = {
    success: false,
    baseUrl: API_CONFIG.BASE_URL,
    endpoints: [],
    error: null,
    responseTime: 0
  };

  try {
    // Test the base API endpoint
    console.log(`Testing API connection to ${API_CONFIG.BASE_URL}...`);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api-test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(5000)
    });
    
    const data = await response.json();
    const endTime = performance.now();
    
    results.success = response.ok;
    results.statusCode = response.status;
    results.responseTime = Math.round(endTime - startTime);
    results.data = data;
    
    if (response.ok) {
      console.log(`✅ API connection successful! Response time: ${results.responseTime}ms`);
      console.log('Response:', data);
    } else {
      console.error(`❌ API responded with status ${response.status}`);
      results.error = `API responded with status ${response.status}: ${response.statusText}`;
    }
    
    return results;
  } catch (error) {
    const endTime = performance.now();
    results.responseTime = Math.round(endTime - startTime);
    results.success = false;
    
    if (error.name === 'AbortError') {
      console.error('❌ API connection timed out after 5000ms');
      results.error = 'Connection timed out';
    } else if (error.message && error.message.includes('fetch')) {
      console.error('❌ Network error - API server may be down');
      results.error = 'Network error - API server may be down';
    } else {
      console.error('❌ API connection error:', error.message || error);
      results.error = error.message || 'Unknown error';
    }
    
    return results;
  }
};

/**
 * Tests specific API endpoints
 * @param {Array<string>} endpoints - List of endpoints to test
 * @returns {Promise<Object>} Results of endpoint tests
 */
export const testApiEndpoints = async (endpoints = ['/auth/profile', '/subjects', '/subject-options']) => {
  const results = {
    success: false,
    baseUrl: API_CONFIG.BASE_URL,
    endpoints: [],
    overallSuccess: false
  };
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    const endpointResult = {
      endpoint,
      success: false,
      statusCode: null,
      responseTime: 0,
      error: null
    };
    
    const startTime = performance.now();
    
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if available
          ...localStorage.getItem('authToken') ? {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          } : {}
        },
        signal: AbortSignal.timeout(5000)
      });
      
      const endTime = performance.now();
      endpointResult.responseTime = Math.round(endTime - startTime);
      endpointResult.statusCode = response.status;
      
      if (response.ok) {
        endpointResult.success = true;
        successCount++;
        console.log(`✅ Endpoint ${endpoint} responded successfully in ${endpointResult.responseTime}ms`);
      } else {
        endpointResult.success = false;
        endpointResult.error = `Status ${response.status}: ${response.statusText}`;
        console.error(`❌ Endpoint ${endpoint} failed with status ${response.status}`);
      }
    } catch (error) {
      const endTime = performance.now();
      endpointResult.responseTime = Math.round(endTime - startTime);
      
      if (error.name === 'AbortError') {
        endpointResult.error = 'Connection timed out';
      } else {
        endpointResult.error = error.message || 'Unknown error';
      }
      
      console.error(`❌ Error testing endpoint ${endpoint}:`, endpointResult.error);
    }
    
    results.endpoints.push(endpointResult);
  }
  
  results.overallSuccess = successCount === endpoints.length;
  results.successRate = `${successCount}/${endpoints.length}`;
  
  return results;
};

// Export a function to run all tests
export const runApiTests = async () => {
  console.group('API Connection Tests');
  
  // Test basic connection
  const connectionResult = await testApiConnection();
  
  // Only test endpoints if basic connection succeeded
  let endpointResults = null;
  if (connectionResult.success) {
    endpointResults = await testApiEndpoints();
  }
  
  console.groupEnd();
  
  return {
    connection: connectionResult,
    endpoints: endpointResults
  };
};

export default {
  testApiConnection,
  testApiEndpoints,
  runApiTests
};
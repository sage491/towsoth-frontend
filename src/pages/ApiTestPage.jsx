import React from 'react';
import ApiTestComponent from '../components/ApiTestComponent';
import { API_CONFIG } from '../config/api';

const ApiTestPage = () => {
  // Log API configuration on component mount
  React.useEffect(() => {
    console.log('API Configuration:', API_CONFIG);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">API Integration Testing</h1>
      <p className="mb-4 text-gray-700">
        This page allows you to test the connection and integration between the frontend and backend API.
        Use the controls below to run different tests and view the results.
      </p>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Testing Instructions</h2>
        <ul className="list-disc pl-5 text-blue-700">
          <li>First test the basic API connection to ensure the backend is reachable</li>
          <li>Then run the comprehensive tests to check all endpoints</li>
          <li>Green indicators show successful tests, red indicators show failures</li>
          <li>Check the browser console for detailed test results and error messages</li>
        </ul>
      </div>
      
      <ApiTestComponent />
    </div>
  );
};

export default ApiTestPage;
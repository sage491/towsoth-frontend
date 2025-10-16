import React from 'react';
import ApiConnectionTest from './ApiConnectionTest';

const ApiTestComponent = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">API Integration Test</h2>
      
      <ApiConnectionTest />
    </div>
  );
};

export default ApiTestComponent;
import React, { useState, useEffect } from 'react';
import { runApiTests } from '../utils/testApiConnection';
import { Button } from './ui/button';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ApiConnectionTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      const results = await runApiTests();
      setTestResults(results);
    } catch (error) {
      console.error('Error running API tests:', error);
      setTestResults({
        error: error.message || 'Unknown error occurred while testing API'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">API Connection Status</h3>
        <Button 
          onClick={runTests} 
          disabled={loading}
          size="sm"
          variant={loading ? "outline" : "default"}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>
      </div>

      {testResults && (
        <div className="space-y-4">
          {/* Connection Test Results */}
          <div className="p-3 rounded-md bg-gray-50">
            <div className="flex items-center">
              <div className="mr-2">
                {testResults.connection?.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {testResults.connection?.success 
                    ? 'API Connection Successful' 
                    : 'API Connection Failed'}
                </p>
                <p className="text-sm text-gray-500">
                  {testResults.connection?.baseUrl} 
                  {testResults.connection?.responseTime && 
                    `(${testResults.connection.responseTime}ms)`}
                </p>
              </div>
            </div>

            {testResults.connection?.error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-sm text-red-700">
                {testResults.connection.error}
              </div>
            )}
          </div>

          {/* Endpoint Test Results */}
          {testResults.endpoints && (
            <div>
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => setExpanded(!expanded)}
              >
                <h4 className="text-sm font-medium">Endpoint Tests</h4>
                <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-gray-100">
                  {testResults.endpoints.successRate}
                </span>
                <button className="ml-auto text-xs text-blue-600">
                  {expanded ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {expanded && (
                <div className="mt-2 space-y-2 text-sm">
                  {testResults.endpoints.endpoints.map((endpoint, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded flex items-center ${endpoint.success ? 'bg-green-50' : 'bg-red-50'}`}
                    >
                      {endpoint.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="font-mono">{endpoint.endpoint}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {endpoint.responseTime}ms
                      </span>
                      {endpoint.error && (
                        <span className="ml-2 text-xs text-red-600">
                          {endpoint.error}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Database Connection Indicator */}
          <div className="flex items-center text-sm mt-2 pt-2 border-t border-gray-100">
            <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
            <span>
              Database connection status is inferred from API responses.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTest;
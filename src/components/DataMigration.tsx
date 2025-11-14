import React, { useState } from 'react';
import { Database, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { migrateLocalStorageData, createTestUsers, migrateExistingLocalStorageData } from '../utils/dataMigration';

export function DataMigration() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<{ type: 'success' | 'error'; message: string }[]>([]);

  const handleMigration = async (type: 'sample' | 'test-users' | 'existing') => {
    setLoading(type);
    
    try {
      let result;
      switch (type) {
        case 'sample':
          result = await migrateLocalStorageData();
          break;
        case 'test-users':
          result = await createTestUsers();
          break;
        case 'existing':
          result = await migrateExistingLocalStorageData();
          break;
      }
      
      setResults(prev => [...prev, {
        type: result.success ? 'success' : 'error',
        message: result.success ? result.message : result.error
      }]);
    } catch (error: any) {
      setResults(prev => [...prev, {
        type: 'error',
        message: error.message || 'Migration failed'
      }]);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Database className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Migration</h1>
          <p className="text-gray-600">Seed your Supabase database with sample data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Upload className="h-5 w-5 mr-2 text-green-600" />
                Sample Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Create sample blood requests for testing the application
              </p>
              <Button
                onClick={() => handleMigration('sample')}
                disabled={loading === 'sample'}
                className="w-full"
              >
                {loading === 'sample' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Seed Sample Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                Test Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Create test donor accounts for development and testing
              </p>
              <Button
                onClick={() => handleMigration('test-users')}
                disabled={loading === 'test-users'}
                className="w-full"
                variant="outline"
              >
                {loading === 'test-users' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Create Test Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Database className="h-5 w-5 mr-2 text-purple-600" />
                Existing Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Migrate existing localStorage data to Supabase
              </p>
              <Button
                onClick={() => handleMigration('existing')}
                disabled={loading === 'existing'}
                className="w-full"
                variant="outline"
              >
                {loading === 'existing' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Migrate Existing
              </Button>
            </CardContent>
          </Card>
        </div>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Migration Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      result.type === 'success' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {result.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${
                        result.type === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.type === 'success' ? 'Success' : 'Error'}
                      </p>
                      <p className={`text-sm ${
                        result.type === 'success' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Back to App
          </Button>
        </div>
      </div>
    </div>
  );
}
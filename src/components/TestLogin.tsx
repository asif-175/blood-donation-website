import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface TestLoginProps {
  onLogin: (email: string, password: string) => void;
}

export function TestLogin({ onLogin }: TestLoginProps) {
  const testAccounts = [
    { email: 'admin@lifelink.com', password: 'admin123', role: 'Admin' },
    { email: 'donor@lifelink.com', password: 'donor123', role: 'Donor' },
    { email: 'test@test.com', password: '123456', role: 'Test User' }
  ];

  return (
    <Card className="mt-4 border-blue-200">
      <CardHeader>
        <CardTitle className="text-sm text-blue-600">Quick Test Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {testAccounts.map((account, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="w-full text-left justify-start"
              onClick={() => onLogin(account.email, account.password)}
            >
              <div>
                <div className="font-medium">{account.role}</div>
                <div className="text-xs text-gray-500">{account.email}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
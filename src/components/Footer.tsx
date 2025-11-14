import React from 'react';
import { Heart, Database } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-gray-700 font-medium">LifeLink</span>
            <span className="text-gray-500">- Blood Donation Platform</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-600" />
              <span>Backend: <strong className="text-green-600">Supabase</strong></span>
            </div>
            <div className="hidden md:block">•</div>
            <span className="text-gray-500">
              © 2024 LifeLink. Saving lives together.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
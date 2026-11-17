import React from 'react';
import { Users } from 'lucide-react';

export default function EmailPreferencesPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-2">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Email Preferences
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Email preferences coming soon. Customize your email notification settings.
        </p>
      </div>
    </div>
  );
}


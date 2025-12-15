import React from 'react';
import { UserCircle } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-2">
          <UserCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Profile management coming soon. Update your personal information and preferences.
        </p>
      </div>
    </div>
  );
}


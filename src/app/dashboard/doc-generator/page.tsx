import React from 'react';
import { FileText } from 'lucide-react';

export default function DocGeneratorPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/20 mb-2">
          <FileText className="w-8 h-8 text-violet-600 dark:text-violet-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Document Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI document generation coming soon. Create bid documents automatically.
        </p>
      </div>
    </div>
  );
}


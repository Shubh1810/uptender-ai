'use client';

import React from 'react';
import { LineChart, Sparkles } from 'lucide-react';

export default function IntelliGraphPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#1B4332] to-[#84cc16]">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IntelliGraph™</h1>
              <p className="text-sm text-gray-600">Create and visualize your tender data analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="
              bg-white
              border-2 border-dashed border-gray-300
              rounded-lg
              min-h-[calc(100vh-250px)]
              flex items-center justify-center
              hover:border-[#1B4332]/50
              transition-colors
            "
          >
            <div className="text-center max-w-md px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Blank Canvas
              </h2>
              <p className="text-gray-600 mb-6">
                Start building your visualization by adding data sources, charts, and insights.
              </p>
              <button
                className="
                  px-4 py-2
                  bg-[#1B4332] text-white
                  rounded-lg
                  font-medium
                  hover:bg-[#1B4332]/90
                  transition-colors
                "
              >
                Create New Visualization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


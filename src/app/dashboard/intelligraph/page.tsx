'use client';

import React from 'react';
import { LineChart, Sparkles } from 'lucide-react';

export default function IntelliGraphPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-lime-500 shadow-lg shadow-emerald-200">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IntelliGraph™</h1>
              <p className="text-sm text-gray-500">Create and visualize your tender data analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="
              bg-black/[0.02]
              border-2 border-dashed border-black/10
              rounded-xl
              min-h-[calc(100vh-350px)]
              flex items-center justify-center
              hover:border-emerald-500/30
              hover:bg-emerald-50/30
              transition-all duration-200
            "
          >
            <div className="text-center max-w-md px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/[0.04] mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Blank Canvas
              </h2>
              <p className="text-gray-500 mb-6">
                Start building your visualization by adding data sources, charts, and insights.
              </p>
              <button
                className="
                  px-5 py-2.5
                  bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                  rounded-lg
                  font-medium
                  shadow-lg shadow-emerald-200
                  hover:shadow-emerald-300 hover:scale-[1.02]
                  transition-all duration-200
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


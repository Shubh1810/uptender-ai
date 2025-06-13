"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ 
  placeholder = "Search tenders by keyword...", 
  onSearch,
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSearchClick = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Animated gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 animate-pulse"></div>
          
          {/* Main search container */}
          <div className="relative bg-white/90 backdrop-blur-xl rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:shadow-2xl focus-within:bg-white/95 group-hover:border-blue-300/30 group-focus-within:border-blue-400/50">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-12 pr-14 py-3.5 bg-transparent rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 font-medium text-sm"
            />
            <button
              type="submit"
              onClick={handleSearchClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-2 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 
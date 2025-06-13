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
        <div className="relative bg-white/90 backdrop-blur-xl rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:shadow-2xl focus-within:border-blue-200/50 focus-within:bg-white/95">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
} 
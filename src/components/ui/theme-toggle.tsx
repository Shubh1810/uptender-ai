'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 opacity-50">
        <div className="w-6 h-6 rounded-full bg-white" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
          : 'linear-gradient(135deg, #87ceeb 0%, #ffd89b 100%)',
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Stars for dark mode */}
      {theme === 'dark' && (
        <>
          <span className="absolute top-1.5 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
          <span className="absolute top-3 left-4 w-0.5 h-0.5 bg-white/70 rounded-full animate-pulse delay-150" />
          <span className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white/50 rounded-full animate-pulse delay-300" />
        </>
      )}
      
      {/* Toggle knob */}
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
          theme === 'dark' 
            ? 'translate-x-7 bg-slate-800' 
            : 'translate-x-0.5 bg-white'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-blue-300" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </div>
    </button>
  );
}


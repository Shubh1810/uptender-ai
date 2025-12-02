"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  preferences: any;
  updateField: (field: string, value: any) => void;
}

export function KeywordEditor({ preferences, updateField }: Props) {
  const [input, setInput] = useState("");

  const keywords = preferences.keywords || [];

  const addKeyword = () => {
    const term = input.trim();
    if (!term || keywords.includes(term)) return;

    updateField("keywords", [...keywords, term]);
    setInput("");
  };

  const removeKeyword = (word: string) => {
    updateField(
      "keywords",
      keywords.filter((k: string) => k !== word)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
    if (e.key === "Backspace" && input === "" && keywords.length > 0) {
      // Delete last keyword
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-800">Include Keywords</h3>

      <div className="flex flex-wrap gap-2">
        {keywords.map((word: string) => (
          <div
            key={word}
            className="group flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-300 rounded-full text-sm transition-all"
          >
            <span className="text-neutral-800">{word}</span>
            <button
              onClick={() => removeKeyword(word)}
              className="opacity-60 group-hover:opacity-100 transition text-neutral-600"
            >
              ✕
            </button>
          </div>
        ))}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={addKeyword}
          onKeyDown={handleKeyDown}
          placeholder="Add keyword…"
          className={cn(
            "outline-none px-2 py-1 text-sm text-neutral-800 rounded-md",
            "border border-neutral-300 focus:border-neutral-500",
            "bg-white"
          )}
        />
      </div>

      <p className="text-xs text-neutral-500">
        Tenders must contain at least one of these keywords.
      </p>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  preferences: any;
  updateField: (field: string, value: any) => void;
}

export function ExclusionKeywordEditor({ preferences, updateField }: Props) {
  const [input, setInput] = useState("");

  const exclusions = preferences.exclusion_keywords || [];

  const addWord = () => {
    const term = input.trim();
    if (!term || exclusions.includes(term)) return;

    updateField("exclusion_keywords", [...exclusions, term]);
    setInput("");
  };

  const removeWord = (word: string) => {
    updateField(
      "exclusion_keywords",
      exclusions.filter((k: string) => k !== word)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addWord();
    }
    if (e.key === "Backspace" && input === "" && exclusions.length > 0) {
      removeWord(exclusions[exclusions.length - 1]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-800">
        Exclude Keywords
      </h3>

      <div className="flex flex-wrap gap-2">
        {exclusions.map((word: string) => (
          <div
            key={word}
            className="group flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-300 rounded-full text-sm transition-all"
          >
            <span className="text-red-800">{word}</span>
            <button
              onClick={() => removeWord(word)}
              className="opacity-60 group-hover:opacity-100 transition text-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={addWord}
          onKeyDown={handleKeyDown}
          placeholder="Add excluded keyword…"
          className={cn(
            "outline-none px-2 py-1 text-sm rounded-md",
            "border border-neutral-300 focus:border-neutral-500",
            "bg-white text-neutral-800"
          )}
        />
      </div>

      <p className="text-xs text-neutral-500">
        Tenders containing any of these words will be filtered out.
      </p>
    </div>
  );
}
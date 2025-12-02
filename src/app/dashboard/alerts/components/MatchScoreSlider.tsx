"use client";

import { useState } from "react";

interface Props {
  preferences: any;
  updateField: (field: string, value: any) => void;
}

export function MatchScoreSlider({ preferences, updateField }: Props) {
  const score = preferences.match_score_threshold ?? 60;
  const [temp, setTemp] = useState(score);

  const save = () => updateField("match_score_threshold", temp);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-800">
        AI Match Score Filter
      </h3>

      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-700">
          Relevance: {temp}%
        </span>
        <button
          onClick={save}
          className="text-sm px-3 py-1.5 rounded-md bg-neutral-900 text-white"
        >
          Save
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={temp}
        onChange={(e) => setTemp(Number(e.target.value))}
        className="w-full accent-neutral-900"
      />

      <div className="flex justify-between text-xs text-neutral-500">
        <span>Broad</span>
        <span>Balanced</span>
        <span>Ultra-specific</span>
      </div>

      <p className="text-xs text-neutral-500">
        Higher values send fewer but more relevant alerts using AI embeddings.
      </p>
    </div>
  );
}
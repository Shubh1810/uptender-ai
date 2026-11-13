"use client";

import type { AlertFieldProps } from "../types";
import React from "react";

type Props = AlertFieldProps;

const formatValue = (lakhs: number) => {
  if (lakhs >= 1000) return `₹${(lakhs / 100).toFixed(1)} Cr`;
  return `₹${lakhs} Lakh`;
};

const RANGE_MIN = 0;
const RANGE_MAX = 1000; // lakhs

export function ValueRange({ preferences, updateField }: Props) {
  const min = preferences.project_value_min ?? RANGE_MIN;
  const max = preferences.project_value_max ?? RANGE_MAX;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-neutral-800">Project Value Range</h3>

      {/* Min */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm text-neutral-700">Minimum</span>
          <span className="text-sm font-medium">{formatValue(min)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          step={10}
          value={min}
          onChange={(e) =>
            updateField("project_value_min", Math.min(Number(e.target.value), max))
          }
          className="w-full accent-neutral-900"
        />
      </div>

      {/* Max */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm text-neutral-700">Maximum</span>
          <span className="text-sm font-medium">{formatValue(max)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          step={10}
          value={max}
          onChange={(e) =>
            updateField("project_value_max", Math.max(Number(e.target.value), min))
          }
          className="w-full accent-neutral-900"
        />
      </div>

      <p className="text-xs text-neutral-500">
        Tenders outside this range will be filtered out.
      </p>
    </div>
  );
}
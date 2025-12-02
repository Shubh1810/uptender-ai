"use client";

import React from "react";
import { cn } from "@/lib/utils";

const INDIAN_STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Uttar Pradesh",
  "Haryana",
  "Bihar",
  "Kerala",
  "Punjab",
];

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

interface Props {
  preferences: any;
  updateField: (field: string, value: any) => void;
}

export function LocationSelector({ preferences, updateField }: Props) {
  const type = preferences.location_type;

  const toggleState = (s: string) => {
    const current = preferences.selected_states || [];
    if (current.includes(s)) {
      updateField(
        "selected_states",
        current.filter((x: string) => x !== s)
      );
    } else {
      updateField("selected_states", [...current, s]);
    }
  };

  const toggleCity = (c: string) => {
    const current = preferences.selected_cities || [];
    if (current.includes(c)) {
      updateField(
        "selected_cities",
        current.filter((x: string) => x !== c)
      );
    } else {
      updateField("selected_cities", [...current, c]);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-neutral-800">Location</h3>

      {/* Segmented Control */}
      <div className="flex gap-2">
        {[
          { id: "all_india", label: "All India" },
          { id: "states", label: "States" },
          { id: "cities", label: "Cities" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateField("location_type", opt.id)}
            className={cn(
              "px-4 py-2 rounded-lg border transition-all font-medium text-sm",
              type === opt.id
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* States */}
      {type === "states" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {INDIAN_STATES.map((st) => {
            const active = preferences.selected_states?.includes(st);
            return (
              <button
                key={st}
                onClick={() => toggleState(st)}
                className={cn(
                  "p-2 rounded-lg border text-left text-sm transition-all",
                  active
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white border-neutral-300 hover:bg-neutral-50"
                )}
              >
                {st}
              </button>
            );
          })}
        </div>
      )}

      {/* Cities */}
      {type === "cities" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {CITIES.map((city) => {
            const active = preferences.selected_cities?.includes(city);
            return (
              <button
                key={city}
                onClick={() => toggleCity(city)}
                className={cn(
                  "p-2 rounded-lg border text-left text-sm transition-all",
                  active
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white border-neutral-300 hover:bg-neutral-50"
                )}
              >
                {city}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
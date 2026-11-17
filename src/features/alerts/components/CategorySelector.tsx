"use client";

import type { AlertFieldProps } from "../types";
import React from "react";
import { cn } from "@/lib/utils";

type Props = AlertFieldProps;

const categories = [
  { id: "it_services", label: "IT Services", icon: "💻" },
  { id: "construction", label: "Construction", icon: "🏗️" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "healthcare", label: "Healthcare", icon: "🏥" },
  { id: "electrical", label: "Electrical", icon: "⚡" },
  { id: "consulting", label: "Consulting", icon: "📊" },
  { id: "printing", label: "Printing", icon: "🖨️" },
  { id: "manufacturing", label: "Manufacturing", icon: "🏭" },
  { id: "logistics", label: "Logistics", icon: "📦" },
  { id: "telecom", label: "Telecom", icon: "📱" },
  { id: "finance", label: "Finance", icon: "💰" },
  { id: "energy", label: "Energy", icon: "🔋" },
];

export function CategorySelector({ preferences, updateField }: Props) {
  const selected = preferences.categories || [];

  const toggle = (id: string) => {
    const exists = selected.includes(id);

    if (exists) {
      updateField(
        "categories",
        selected.filter((c: string) => c !== id)
      );
    } else {
      if (selected.length >= 3) return; // enforce limit
      updateField("categories", [...selected, id]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-800">
        Industry Categories <span className="text-neutral-500">(1–3)</span>
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const active = selected.includes(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
                active
                  ? "border-neutral-800 bg-neutral-100"
                  : "border-neutral-200 hover:bg-neutral-50"
              )}
            >
              <span className="text-xl">{cat.icon}</span>
              <span
                className={cn(
                  "font-medium text-sm",
                  active ? "text-neutral-900" : "text-neutral-700"
                )}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-neutral-500">
        {selected.length} of 3 selected
      </p>
    </div>
  );
}
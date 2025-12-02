"use client";

import { useEffect } from "react";

interface Props {
  isDirty: boolean;
  onSave: () => void;
  saving: boolean;
}

export function SaveBar({ isDirty, onSave, saving }: Props) {
  if (!isDirty) return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        bg-white border-t border-neutral-200
        shadow-[0_-4px_20px_rgba(0,0,0,0.04)]
        px-6 py-4
        flex items-center justify-between
        z-50
      "
    >
      <span className="text-sm text-neutral-600">
        Unsaved changes
      </span>

      <button
        onClick={onSave}
        disabled={saving}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium
          ${saving
            ? "bg-neutral-300 text-neutral-500"
            : "bg-neutral-900 text-white"
          }
        `}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
"use client";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  previewData?: {
    title: string;
    organisation: string;
    match_score: number;
    closing_date: string;
  };
}

export function TestAlertPreview({ open, onClose, previewData }: Props) {
  if (!open) return null;

  const data = previewData || {
    title: "Construction of Water Pipeline Network",
    organisation: "Public Works Department",
    match_score: 87,
    closing_date: "2025-02-14",
  };

  return (
    <div
      className="
        fixed inset-0 bg-black/40 backdrop-blur-sm
        flex items-center justify-center
        z-50
      "
    >
      <div
        className="
          bg-white rounded-xl p-6 w-[90%] max-w-lg
          shadow-lg border border-neutral-200
          space-y-4
        "
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Alert Preview
          </h2>
          <button onClick={onClose} className="text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-neutral-700">Title</p>
            <p className="font-medium text-neutral-900">{data.title}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-700">Organisation</p>
            <p className="font-medium text-neutral-900">{data.organisation}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-700">AI Match Score</p>
              <p className="font-medium text-neutral-900">{data.match_score}%</p>
            </div>

            <div>
              <p className="text-sm text-neutral-700">Closing Date</p>
              <p className="font-medium text-neutral-900">{data.closing_date}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="
            w-full py-2 px-4 rounded-lg
            bg-neutral-900 text-white text-sm
          "
        >
          Got it
        </button>
      </div>
    </div>
  );
}
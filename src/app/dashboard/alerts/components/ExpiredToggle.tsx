"use client";

interface Props {
  preferences: any;
  updateField: (field: string, value: any) => void;
}

export function ExpiredToggle({ preferences, updateField }: Props) {
  const value = preferences.show_expired || false;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-800">Expired Tenders</h3>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => updateField("show_expired", e.target.checked)}
        />
        <span className="text-sm text-neutral-700">
          Show expired tenders (for research / competitor analysis)
        </span>
      </div>

      <p className="text-xs text-neutral-500">
        Disable this to only receive alerts for active, open tenders.
      </p>
    </div>
  );
}
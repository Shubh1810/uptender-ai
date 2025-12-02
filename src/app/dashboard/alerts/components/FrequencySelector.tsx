"use client";

interface Props {
  preferences: any;
  updateField: (field: string, value: any) => void;
}

export function FrequencySelector({ preferences, updateField }: Props) {
  const value = preferences.frequency || "instant";

  const options = [
    { key: "instant", label: "Instant", desc: "Receive alerts immediately" },
    { key: "hourly", label: "Hourly Digest", desc: "Group alerts every hour" },
    { key: "daily", label: "Daily Summary", desc: "One clean summary per day" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-800">Frequency</h3>

      <div className="space-y-3">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => updateField("frequency", o.key)}
            className={`
              w-full flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border transition-all text-left
              ${value === o.key
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-300 bg-white text-neutral-800"
              }
            `}
          >
            <span className="font-medium">{o.label}</span>
            <span
              className={`text-xs ${
                value === o.key ? "text-neutral-300" : "text-neutral-500"
              }`}
            >
              {o.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";

interface Props {
  preferences: any;
  updateField: (field: string, value: any) => void;
}

export function QuietHoursSelector({ preferences, updateField }: Props) {
  const quiet = preferences.quiet_hours || { enabled: false, from: "23:00", to: "07:00" };
  const [temp, setTemp] = useState(quiet);

  const apply = () => updateField("quiet_hours", temp);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-800">Quiet Hours</h3>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={temp.enabled}
          onChange={(e) =>
            setTemp({ ...temp, enabled: e.target.checked })
          }
        />
        <span className="text-sm text-neutral-700">Mute notifications at night</span>
      </div>

      {temp.enabled && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-neutral-600">From</label>
            <input
              type="time"
              value={temp.from}
              onChange={(e) => setTemp({ ...temp, from: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-600">To</label>
            <input
              type="time"
              value={temp.to}
              onChange={(e) => setTemp({ ...temp, to: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
            />
          </div>
        </div>
      )}

      <button
        onClick={apply}
        className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm"
      >
        Save Quiet Hours
      </button>

      <p className="text-xs text-neutral-500">
        Alerts will be paused during these hours.
      </p>
    </div>
  );
}
"use client";

import { Briefcase, ShoppingCart, Wrench, UserCog } from "lucide-react";

interface Props {
  preferences: any;
  updateField: (field: string, value: any) => void;
}

export function TenderTypeSelector({ preferences, updateField }: Props) {
  const selected = preferences.tender_types || [];

  const toggle = (key: string) => {
    const next = selected.includes(key)
      ? selected.filter((t: string) => t !== key)
      : [...selected, key];
    updateField("tender_types", next);
  };

  const types = [
    { key: "goods", label: "Goods", icon: ShoppingCart },
    { key: "services", label: "Services", icon: Briefcase },
    { key: "works", label: "Works", icon: Wrench },
    { key: "consultancy", label: "Consultancy", icon: UserCog },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-800">
        Tender Type Filters
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {types.map(({ key, label, icon: Icon }) => {
          const active = selected.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm
                ${active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white text-neutral-800"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-neutral-500">
        Choose which procurement categories you care about.
      </p>
    </div>
  );
}
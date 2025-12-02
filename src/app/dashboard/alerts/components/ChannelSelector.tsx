"use client";

import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

interface Props {
  preferences: any;
  updateField: (field: string, value: any) => void;
}

export function ChannelSelector({ preferences, updateField }: Props) {
  const channels = preferences.channels || [];

  const toggle = (key: string) => {
    const next = channels.includes(key)
      ? channels.filter((c: string) => c !== key)
      : [...channels, key];
    updateField("channels", next);
  };

  const items = [
    { key: "email", label: "Email", icon: Mail },
    { key: "whatsapp", label: "WhatsApp", icon: MessageSquare },
    { key: "sms", label: "SMS", icon: Smartphone },
    { key: "inapp", label: "In-App", icon: Bell }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-800">Channels</h3>

      <div className="grid grid-cols-2 gap-4">
        {items.map(({ key, label, icon: Icon }) => {
          const active = channels.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border
                transition-all text-sm
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
        Choose how you want to receive alerts.
      </p>
    </div>
  );
}
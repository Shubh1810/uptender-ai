"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

type Preferences = {
  keywords?: string[];
  exclusion_keywords?: string[];
  categories?: string[];
  locations?: string[];
  tender_value_min?: number | null;
  tender_value_max?: number | null;
  tender_types?: string[];
  show_expired?: boolean;
  match_score_threshold?: number;
  channels?: string[];
  frequency?: string;
  quiet_hours?: {
    enabled: boolean;
    from: string;
    to: string;
  };
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAlertPreferences(userId: string | null) {
  const [preferences, setPreferences] = useState<Preferences>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch preferences
  useEffect(() => {
    if (!userId) return;

    (async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("alert_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        setPreferences(data.preferences || {});
      }

      setLoading(false);
    })();
  }, [userId]);

  // Update a single field
  const updateField = useCallback((field: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
    setDirty(true);
  }, []);

  // Save to Supabase
  const savePreferences = useCallback(async () => {
    if (!userId) return;

    setSaving(true);

    const { error } = await supabase
      .from("alert_preferences")
      .upsert({
        user_id: userId,
        preferences,
      });

    setSaving(false);
    if (!error) setDirty(false);
  }, [preferences, userId]);

  return {
    preferences,
    loading,
    updateField,
    savePreferences,
    saving,
    isDirty,
    showPreview,
    setShowPreview,
  };
}
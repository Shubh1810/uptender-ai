"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AlertPreferences, UpdateAlertField } from "./types";

export function useAlertPreferences(userId: string | null) {
  // Create Supabase client inside the hook to ensure fresh auth state
  const supabase = useMemo(() => createClient(), []);
  const [preferences, setPreferences] = useState<AlertPreferences>({});
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
  }, [supabase, userId]);

  // Update a single field
  const updateField: UpdateAlertField = useCallback((field, value) => {
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
  }, [preferences, supabase, userId]);

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
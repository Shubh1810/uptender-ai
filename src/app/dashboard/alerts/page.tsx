"use client";

import { useAlertPreferences } from "./useAlertPreferences";
import { Section } from "./components/Section";
import { SectionHeader } from "./components/SectionHeader";

import { CategorySelector } from "./components/CategorySelector";
import { LocationSelector } from "./components/LocationSelector";
import { ValueRange } from "./components/ValueRange";

import { KeywordEditor } from "./components/KeywordEditor";
import { ExclusionKeywordEditor } from "./components/ExclusionKeywordEditor";

import { ChannelSelector } from "./components/ChannelSelector";
import { FrequencySelector } from "./components/FrequencySelector";
import { QuietHoursSelector } from "./components/QuietHoursSelector";

import { TenderTypeSelector } from "./components/TenderTypeSelector";
import { ExpiredToggle } from "./components/ExpiredToggle";
import { MatchScoreSlider } from "./components/MatchScoreSlider";

import { SaveBar } from "./components/SaveBar";
import { TestAlertPreview } from "./components/TestAlertPreview";

import {
  SlidersHorizontal,
  Filter,
  MailCheck,
  Brain,
} from "lucide-react";

export default function AlertSettingsPage() {
  const userId = "example-user-id"; // Replace with auth session
  const {
    preferences,
    loading,
    updateField,
    savePreferences,
    saving,
    isDirty,
    showPreview,
    setShowPreview,
  } = useAlertPreferences(userId);

  if (loading) {
    return (
      <div className="p-10 text-neutral-600">Loading preferences…</div>
    );
  }

  return (
    <div className="w-full">

      {/* ---------- BUSINESS PROFILE ---------- */}
      <div className="w-full">
        <Section>
          <SectionHeader
            icon={Filter}
            title="Business Profile"
            description="Tell us what kind of tenders matter to you."
          />

          <CategorySelector
            preferences={preferences}
            updateField={updateField}
          />

          <LocationSelector
            preferences={preferences}
            updateField={updateField}
          />

          <ValueRange
            preferences={preferences}
            updateField={updateField}
          />
        </Section>
      </div>

      {/* ---------- KEYWORDS ---------- */}
      <div className="w-full bg-black/[0.02]">
        <Section>
          <SectionHeader
            icon={Brain}
            title="AI Keywords"
            description="Improve the precision of your tender recommendations."
          />

          <KeywordEditor
            preferences={preferences}
            updateField={updateField}
          />

          <ExclusionKeywordEditor
            preferences={preferences}
            updateField={updateField}
          />
        </Section>
      </div>

      {/* ---------- DELIVERY SETTINGS ---------- */}
      <div className="w-full">
        <Section>
          <SectionHeader
            icon={MailCheck}
            title="Delivery Settings"
            description="Control how and when you receive alerts."
          />

          <ChannelSelector
            preferences={preferences}
            updateField={updateField}
          />

          <FrequencySelector
            preferences={preferences}
            updateField={updateField}
          />

          <QuietHoursSelector
            preferences={preferences}
            updateField={updateField}
          />
        </Section>
      </div>

      {/* ---------- ADVANCED AI FILTERS ---------- */}
      <div className="w-full bg-black/[0.02]">
        <Section>
          <SectionHeader
            icon={SlidersHorizontal}
            title="AI Filters"
            description="Fine-tune the accuracy and volume of notifications."
          />

          <TenderTypeSelector
            preferences={preferences}
            updateField={updateField}
          />

          <ExpiredToggle
            preferences={preferences}
            updateField={updateField}
          />

          <MatchScoreSlider
            preferences={preferences}
            updateField={updateField}
          />
        </Section>
      </div>

      {/* SAVE BAR */}
      <SaveBar
        isDirty={isDirty}
        onSave={savePreferences}
        saving={saving}
      />

      {/* TEST PREVIEW MODAL */}
      <TestAlertPreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}
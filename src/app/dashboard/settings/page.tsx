'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface ProfileData {
  full_name: string;
  company: string;
  business_type: string;
  gst_number: string;
  years_in_operation: number;
  primary_industry: string;
  secondary_industries: string[];
}

interface PreferencesData {
  notify_whatsapp: boolean;
  notify_sms: boolean;
  notify_email: boolean;
  notify_inapp: boolean;
  frequency: 'real_time' | 'daily' | 'weekly';
  alert_threshold: number;
  keywords: string[];
  categories: string[];
  regions: string[];
}

export default function SettingsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    company: '',
    business_type: 'Proprietorship',
    gst_number: '',
    years_in_operation: 0,
    primary_industry: '',
    secondary_industries: [],
  });
  const [preferences, setPreferences] = useState<PreferencesData>({
    notify_whatsapp: false,
    notify_sms: false,
    notify_email: true,
    notify_inapp: true,
    frequency: 'daily',
    alert_threshold: 70,
    keywords: [],
    categories: [],
    regions: [],
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [regionInput, setRegionInput] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user.id);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData && !profileError) {
        setProfile({
          full_name: profileData.full_name || '',
          company: profileData.company || '',
          business_type: profileData.business_type || 'Proprietorship',
          gst_number: '', // Don't expose encrypted GST
          years_in_operation: profileData.years_in_operation || 0,
          primary_industry: profileData.primary_industry || '',
          secondary_industries: profileData.secondary_industries || [],
        });
      }

      // Fetch preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (prefsData && !prefsError) {
        setPreferences({
          notify_whatsapp: prefsData.notify_whatsapp || false,
          notify_sms: prefsData.notify_sms || false,
          notify_email: prefsData.notify_email || true,
          notify_inapp: prefsData.notify_inapp || true,
          frequency: prefsData.frequency || 'daily',
          alert_threshold: prefsData.alert_threshold || 70,
          keywords: prefsData.keywords || [],
          categories: prefsData.categories || [],
          regions: prefsData.regions || [],
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          company: profile.company,
          business_type: profile.business_type,
          years_in_operation: profile.years_in_operation,
          primary_industry: profile.primary_industry,
          secondary_industries: profile.secondary_industries,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile changes.');
      return false;
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          notify_whatsapp: preferences.notify_whatsapp,
          notify_sms: preferences.notify_sms,
          notify_email: preferences.notify_email,
          notify_inapp: preferences.notify_inapp,
          frequency: preferences.frequency,
          alert_threshold: preferences.alert_threshold,
          keywords: preferences.keywords,
          categories: preferences.categories,
          regions: preferences.regions,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences.');
      return false;
    }
  };

  const addKeyword = async () => {
    if (keywordInput.trim() && !preferences.keywords.includes(keywordInput.trim())) {
      const newKeywords = [...preferences.keywords, keywordInput.trim()];
      setPreferences({
        ...preferences,
        keywords: newKeywords,
      });
      setKeywordInput('');
      // Auto-save
      await savePreferences();
    }
  };

  const removeKeyword = async (keyword: string) => {
    setPreferences({
      ...preferences,
      keywords: preferences.keywords.filter(k => k !== keyword),
    });
    // Auto-save
    setTimeout(() => savePreferences(), 100);
  };

  const addCategory = async () => {
    if (categoryInput.trim() && !preferences.categories.includes(categoryInput.trim())) {
      const newCategories = [...preferences.categories, categoryInput.trim()];
      setPreferences({
        ...preferences,
        categories: newCategories,
      });
      setCategoryInput('');
      // Auto-save
      await savePreferences();
    }
  };

  const removeCategory = async (category: string) => {
    setPreferences({
      ...preferences,
      categories: preferences.categories.filter(c => c !== category),
    });
    // Auto-save
    setTimeout(() => savePreferences(), 100);
  };

  const addRegion = async () => {
    if (regionInput.trim() && !preferences.regions.includes(regionInput.trim())) {
      const newRegions = [...preferences.regions, regionInput.trim()];
      setPreferences({
        ...preferences,
        regions: newRegions,
      });
      setRegionInput('');
      // Auto-save
      await savePreferences();
    }
  };

  const removeRegion = async (region: string) => {
    setPreferences({
      ...preferences,
      regions: preferences.regions.filter(r => r !== region),
    });
    // Auto-save
    setTimeout(() => savePreferences(), 100);
  };

  const removeSecondaryIndustry = async (industry: string) => {
    setProfile({
      ...profile,
      secondary_industries: profile.secondary_industries.filter(i => i !== industry),
    });
    // Auto-save
    setTimeout(() => saveProfile(), 100);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account preferences and AI configuration
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Profile Section */}
          <section>
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Profile
            </h2>
            <div className="space-y-0">
              <SettingRow
                label="Name"
                value={profile.full_name}
                onEdit={() => setActiveSection('full_name')}
                isEditing={activeSection === 'full_name'}
                onSave={async () => {
                  await saveProfile();
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-0 py-1 bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-0"
                  placeholder="Your name"
                />
              </SettingRow>

              <SettingRow
                label="Company"
                value={profile.company}
                onEdit={() => setActiveSection('company')}
                isEditing={activeSection === 'company'}
                onSave={async () => {
                  await saveProfile();
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  className="w-full px-0 py-1 bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-0"
                  placeholder="Company name"
                />
              </SettingRow>

              <SettingRow
                label="Business Type"
                value={profile.business_type}
                onEdit={() => setActiveSection('business_type')}
                isEditing={activeSection === 'business_type'}
                onSave={async () => {
                  await saveProfile();
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <select
                  value={profile.business_type}
                  onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}
                  className="w-full px-0 py-1 bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-0"
                >
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Private Limited">Private Limited</option>
                  <option value="Limited Liability Partnership">Limited Liability Partnership</option>
                  <option value="Micro, Small & Medium Enterprises (MSME)">MSME</option>
                  <option value="Startup">Startup</option>
                  <option value="Consultant">Consultant</option>
                  <option value="Individual">Individual</option>
                </select>
              </SettingRow>

              <SettingRow
                label="Years in Operation"
                value={profile.years_in_operation === 20 ? '20+' : profile.years_in_operation.toString()}
                onEdit={() => setActiveSection('years')}
                isEditing={activeSection === 'years'}
                onSave={async () => {
                  await saveProfile();
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <select
                  value={profile.years_in_operation}
                  onChange={(e) => setProfile({ ...profile, years_in_operation: parseInt(e.target.value) })}
                  className="w-full px-0 py-1 bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-0"
                >
                  {Array.from({ length: 21 }, (_, i) => i).map(v => (
                    <option key={v} value={v}>{v === 20 ? '20+' : v}</option>
                  ))}
                </select>
              </SettingRow>

              <SettingRow
                label="Primary Industry"
                value={profile.primary_industry}
                onEdit={() => setActiveSection('primary_industry')}
                isEditing={activeSection === 'primary_industry'}
                onSave={async () => {
                  await saveProfile();
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <input
                  type="text"
                  value={profile.primary_industry}
                  onChange={(e) => setProfile({ ...profile, primary_industry: e.target.value })}
                  className="w-full px-0 py-1 bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-0"
                  placeholder="Primary industry"
                />
              </SettingRow>

              <SettingRow
                label="Secondary Industries"
                value={profile.secondary_industries.length > 0 ? profile.secondary_industries.join(', ') : 'None'}
                onEdit={() => setActiveSection('secondary_industries')}
                isEditing={activeSection === 'secondary_industries'}
                onSave={() => setActiveSection(null)}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <div className="space-y-2">
                  {profile.secondary_industries.map((industry) => (
                    <div key={industry} className="flex items-center justify-between py-1">
                      <span className="text-sm text-gray-900 dark:text-white">{industry}</span>
                      <button
                        onClick={() => removeSecondaryIndustry(industry)}
                        className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Update in onboarding to add more industries
                  </p>
                </div>
              </SettingRow>
            </div>
          </section>

          {/* Notifications Section */}
          <section>
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Notifications
            </h2>
            <div className="space-y-0">
              <ToggleRow
                label="Email Notifications"
                description="Receive tender alerts via email"
                checked={preferences.notify_email}
                onChange={async (checked) => {
                  setPreferences({ ...preferences, notify_email: checked });
                  setTimeout(() => savePreferences(), 100);
                }}
              />

              <ToggleRow
                label="In-App Notifications"
                description="Show notifications in the dashboard"
                checked={preferences.notify_inapp}
                onChange={async (checked) => {
                  setPreferences({ ...preferences, notify_inapp: checked });
                  setTimeout(() => savePreferences(), 100);
                }}
              />

              <ToggleRow
                label="WhatsApp Notifications"
                description="Receive alerts on WhatsApp (coming soon)"
                checked={preferences.notify_whatsapp}
                onChange={async (checked) => {
                  setPreferences({ ...preferences, notify_whatsapp: checked });
                  setTimeout(() => savePreferences(), 100);
                }}
              />

              <ToggleRow
                label="SMS Notifications"
                description="Receive alerts via SMS (coming soon)"
                checked={preferences.notify_sms}
                onChange={async (checked) => {
                  setPreferences({ ...preferences, notify_sms: checked });
                  setTimeout(() => savePreferences(), 100);
                }}
              />

              <SettingRow
                label="Frequency"
                value={preferences.frequency.replace('_', ' ')}
                onEdit={() => setActiveSection('frequency')}
                isEditing={activeSection === 'frequency'}
                onSave={async () => {
                  await savePreferences();
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <select
                  value={preferences.frequency}
                  onChange={(e) => setPreferences({ ...preferences, frequency: e.target.value as any })}
                  className="w-full px-0 py-1 bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-0"
                >
                  <option value="real_time">Real Time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </SettingRow>

              <SettingRow
                label="Alert Threshold"
                value={`${preferences.alert_threshold}%`}
                onEdit={() => setActiveSection('alert_threshold')}
                isEditing={activeSection === 'alert_threshold'}
                onSave={async () => {
                  await savePreferences();
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={preferences.alert_threshold}
                    onChange={(e) => setPreferences({ ...preferences, alert_threshold: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {preferences.alert_threshold}% - Minimum match score to trigger alerts
                  </div>
                </div>
              </SettingRow>
            </div>
          </section>

          {/* AI Preferences Section */}
          <section>
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              AI Preferences
            </h2>
            <div className="space-y-0">
              <SettingRow
                label="Keywords"
                value={preferences.keywords.length > 0 ? `${preferences.keywords.length} keywords` : 'None'}
                onEdit={() => setActiveSection('keywords')}
                isEditing={activeSection === 'keywords'}
                onSave={async () => {
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add keyword"
                    />
                    <button
                      onClick={addKeyword}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-blue-900 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </SettingRow>

              <SettingRow
                label="Categories"
                value={preferences.categories.length > 0 ? `${preferences.categories.length} categories` : 'None'}
                onEdit={() => setActiveSection('categories')}
                isEditing={activeSection === 'categories'}
                onSave={async () => {
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add category"
                    />
                    <button
                      onClick={addCategory}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                      >
                        {category}
                        <button
                          onClick={() => removeCategory(category)}
                          className="hover:text-purple-900 dark:hover:text-purple-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </SettingRow>

              <SettingRow
                label="Regions"
                value={preferences.regions.length > 0 ? `${preferences.regions.length} regions` : 'None'}
                onEdit={() => setActiveSection('regions')}
                isEditing={activeSection === 'regions'}
                onSave={async () => {
                  setActiveSection(null);
                }}
                onCancel={() => {
                  setActiveSection(null);
                  fetchUserData(user!.id);
                }}
              >
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={regionInput}
                      onChange={(e) => setRegionInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addRegion()}
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add region"
                    />
                    <button
                      onClick={addRegion}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.regions.map((region) => (
                      <span
                        key={region}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                      >
                        {region}
                        <button
                          onClick={() => removeRegion(region)}
                          className="hover:text-green-900 dark:hover:text-green-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </SettingRow>
            </div>
          </section>
        </div>

        {/* Info - Auto-save enabled */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Changes are saved automatically
          </p>
        </div>
      </div>
    </div>
  );
}

// Minimal Setting Row Component
function SettingRow({
  label,
  value,
  onEdit,
  isEditing,
  onSave,
  onCancel,
  children,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
        {!isEditing ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{value || 'Not set'}</div>
        ) : (
          <div className="mt-2">{children}</div>
        )}
      </div>
      <div className="ml-4 flex items-center gap-2">
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={onSave}
              className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
            >
              Done
            </button>
            <button
              onClick={onCancel}
              className="text-xs text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 font-medium"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Minimal Toggle Row Component
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
        {description && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

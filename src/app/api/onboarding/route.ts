import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { ApiError, apiHandler, assertSameOrigin, parseJson } from '@/server/http';
import { encryptField } from '@/server/crypto';

const shortText = z.string().trim().min(1).max(200);
const tagList = z.array(z.string().trim().min(1).max(100)).max(50).default([]);

/** Indian GSTIN: 2-digit state code, PAN, entity code, 'Z', checksum. */
const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const profileSchema = z.object({
  full_name: shortText,
  company: shortText,
  business_type: z.enum(['Proprietorship', 'Pvt Ltd', 'LLP', 'MSME', 'Startup', 'Consultant', 'Individual']),
  gst_number: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() ? val.trim().toUpperCase() : undefined),
    z.string().regex(GSTIN, 'Invalid GST number').optional()
  ),
  years_in_operation: z.number().int().min(0).max(100),
  primary_industry: shortText,
  secondary_industries: tagList,
});

const preferencesSchema = z.object({
  notify_whatsapp: z.boolean().default(false),
  notify_sms: z.boolean().default(false),
  notify_email: z.boolean().default(true),
  notify_inapp: z.boolean().default(true),
  frequency: z.enum(['real_time', 'daily', 'weekly']).default('daily'),
  alert_threshold: z.number().int().min(0).max(100).default(70),
  keywords: tagList,
  categories: tagList,
  regions: tagList,
  roles: z.array(z.string().trim().min(1).max(100)).min(1, 'At least one role must be selected').max(20),
  user_goal: z.string().trim().min(1, 'User goal is required').max(100),
  tender_documentation_comfort: z.enum(['experienced', 'guided', 'new'], {
    error: 'Tender documentation comfort level is required',
  }),
});

const payloadSchema = z.object({
  profile: profileSchema,
  preferences: preferencesSchema,
});

/** POST /api/onboarding: saves the onboarding profile + alert preferences. */
export const POST = apiHandler('onboarding', async (request) => {
  assertSameOrigin(request);
  const { supabase, user } = await requireUser();
  const { profile, preferences } = await parseJson(request, payloadSchema);

  // Only the columns listed here are writable; `role` is never accepted from the client.
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: profile.full_name,
    company: profile.company,
    business_type: profile.business_type,
    gst_number_enc: profile.gst_number ? encryptField(profile.gst_number) : null,
    years_in_operation: profile.years_in_operation,
    primary_industry: profile.primary_industry,
    secondary_industries: profile.secondary_industries,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    console.error('[api:onboarding] profile upsert failed', profileError);
    throw new ApiError(500, 'DB_ERROR', 'Failed to save profile');
  }

  const { error: prefError } = await supabase.from('user_preferences').upsert(
    {
      user_id: user.id,
      ...preferences,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (prefError) {
    console.error('[api:onboarding] preferences upsert failed', prefError);
    throw new ApiError(500, 'DB_ERROR', 'Failed to save preferences');
  }

  return NextResponse.json({ ok: true });
});

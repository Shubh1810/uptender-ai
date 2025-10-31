import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const profileSchema = z.object({
  full_name: z.string().min(1),
  company: z.string().min(1),
  business_type: z.enum(['Proprietorship','Pvt Ltd','LLP','MSME','Startup','Consultant','Individual']),
  gst_number: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.string().min(5).optional()
  ),
  years_in_operation: z.number().int().min(0).max(50),
  primary_industry: z.string().min(1),
  secondary_industries: z.array(z.string()).default([]),
});

const preferencesSchema = z.object({
  notify_whatsapp: z.boolean().default(false),
  notify_sms: z.boolean().default(false),
  notify_email: z.boolean().default(true),
  notify_inapp: z.boolean().default(true),
  frequency: z.enum(['real_time','daily','weekly']).default('daily'),
  alert_threshold: z.number().int().min(0).max(100).default(70),
  keywords: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
});

const payloadSchema = z.object({
  profile: profileSchema,
  preferences: preferencesSchema,
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const json = await req.json();
    
    // Validate with detailed error messages
    let parsed;
    try {
      parsed = payloadSchema.parse(json);
    } catch (validationError: any) {
      console.error('Validation error:', validationError.errors);
      return NextResponse.json({ 
        error: 'Validation failed',
        details: validationError.errors,
        receivedData: json
      }, { status: 400 });
    }

    // Optional: encrypt GST here if needed
    const gstCipher: Uint8Array | null = null;

    const { error: pErr, data: profileData } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: parsed.profile.full_name,
        company: parsed.profile.company,
        business_type: parsed.profile.business_type,
        gst_number_enc: gstCipher, // null if not provided or encryption skipped
        years_in_operation: parsed.profile.years_in_operation,
        primary_industry: parsed.profile.primary_industry,
        secondary_industries: parsed.profile.secondary_industries,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .select();
    
    if (pErr) {
      console.error('Profile upsert error:', pErr);
      return NextResponse.json({ 
        error: 'Failed to save profile',
        details: pErr.message,
        code: pErr.code,
        hint: pErr.hint
      }, { status: 400 });
    }

    const pref = parsed.preferences;
    const { error: prefErr, data: prefData } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        notify_whatsapp: pref.notify_whatsapp,
        notify_sms: pref.notify_sms,
        notify_email: pref.notify_email,
        notify_inapp: pref.notify_inapp,
        frequency: pref.frequency,
        alert_threshold: pref.alert_threshold,
        keywords: pref.keywords,
        categories: pref.categories,
        regions: pref.regions,
        updated_at: new Date().toISOString(),
      })
      .select();
    
    if (prefErr) {
      console.error('Preferences upsert error:', prefErr);
      return NextResponse.json({ 
        error: 'Failed to save preferences',
        details: prefErr.message,
        code: prefErr.code,
        hint: prefErr.hint
      }, { status: 400 });
    }

    return NextResponse.json({ ok: true, profile: profileData, preferences: prefData });
  } catch (e: any) {
    console.error('Onboarding API error:', e);
    return NextResponse.json({ 
      error: e.message ?? 'Bad Request',
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
    }, { status: 400 });
  }
}



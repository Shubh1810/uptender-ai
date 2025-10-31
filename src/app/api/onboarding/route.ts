import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const profileSchema = z.object({
  full_name: z.string().min(1),
  company: z.string().min(1),
  business_type: z.enum(['Proprietorship','Pvt Ltd','LLP','MSME','Startup','Consultant','Individual']),
  gst_number: z.string().min(5).optional(),
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
    const parsed = payloadSchema.parse(json);

    // Optional: encrypt GST here if needed
    const gstCipher: Uint8Array | null = null;

    const { error: pErr } = await supabase
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
      });
    if (pErr) throw pErr;

    const pref = parsed.preferences;
    const { error: prefErr } = await supabase
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
      });
    if (prefErr) throw prefErr;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Bad Request' }, { status: 400 });
  }
}



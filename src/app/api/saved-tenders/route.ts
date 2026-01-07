import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ========================================
// Validation Schema
// ========================================
const SaveTenderSchema = z.object({
  tender_ref: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  tender_organisation: z.string().optional(),
  tender_closing_date: z.string().optional(),
  tender_published_date: z.string().optional(),
  tender_opening_date: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// ========================================
// GET: Fetch all saved tenders
// ========================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_ERROR' }, 
        { status: 401 }
      );
    }

    // Fetch from the enhanced view with computed fields
    const { data, error } = await supabase
      .from('saved_tenders_with_stats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved tenders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch saved tenders', code: 'DB_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      saved_tenders: data,
      total_count: data?.length || 0,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// ========================================
// POST: Save a new tender
// ========================================
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_ERROR' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = SaveTenderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const tenderData = validationResult.data;

    // Insert saved tender (unique constraint will prevent duplicates)
    const { data, error } = await supabase
      .from('saved_tenders')
      .insert({
        user_id: user.id,
        tender_ref: tenderData.tender_ref,
        title: tenderData.title,
        url: tenderData.url,
        tender_organisation: tenderData.tender_organisation,
        tender_closing_date: tenderData.tender_closing_date,
        tender_published_date: tenderData.tender_published_date,
        tender_opening_date: tenderData.tender_opening_date,
        notes: tenderData.notes,
        tags: tenderData.tags || [],
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate constraint
      if (error.code === '23505') {
        return NextResponse.json(
          { 
            error: 'Tender already saved', 
            code: 'DUPLICATE_ERROR',
            already_saved: true 
          },
          { status: 409 }
        );
      }

      console.error('Error saving tender:', error);
      return NextResponse.json(
        { error: 'Failed to save tender', code: 'DB_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      saved_tender: data,
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE: Remove a saved tender
// ========================================
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_ERROR' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tender_ref = searchParams.get('tender_ref');

    if (!tender_ref) {
      return NextResponse.json(
        { error: 'Missing tender_ref parameter', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Delete saved tender (RLS ensures user can only delete their own)
    const { error } = await supabase
      .from('saved_tenders')
      .delete()
      .eq('user_id', user.id)
      .eq('tender_ref', tender_ref);

    if (error) {
      console.error('Error deleting saved tender:', error);
      return NextResponse.json(
        { error: 'Failed to delete tender', code: 'DB_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tender removed from saved list',
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}


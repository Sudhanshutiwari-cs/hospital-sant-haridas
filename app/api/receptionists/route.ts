// app/api/receptionists/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  try {
    // 1. Get role_id for receptionist
    const { data: roleData } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('role_name', 'receptionist')
      .maybeSingle();

    let query = supabaseAdmin
      .from('staff')
      .select(`
        *,
        roles:role_id (role_name)
      `)
      .order('created_at', { ascending: false });

    if (roleData?.id) {
      query = query.eq('role_id', roleData.id);
    }

    const { data: receptionists, error } = await query;
    if (error) throw error;

    return NextResponse.json(receptionists || []);
  } catch (error: any) {
    console.error('Error fetching receptionists:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch receptionists' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      password,
      create_account = true,
      full_name,
      email: rawEmail,
      phone,
    } = body;

    const email = (rawEmail || '').trim().toLowerCase();
    const fullName = (full_name || '').trim();

    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Get the role_id for receptionist
    const { data: roleData } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('role_name', 'receptionist')
      .maybeSingle();

    if (!roleData?.id) {
      return NextResponse.json({ error: 'Receptionist role not configured' }, { status: 500 });
    }

    let userId: string | null = null;

    // Create auth account if requested or password provided
    if (password && (create_account !== false)) {
      if (typeof password !== 'string' || password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      // Check if user already exists in auth
      let existingAuthUser: any = null;
      try {
        const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });

        if (!listErr && list?.users) {
          existingAuthUser = list.users.find(
            (u) => u.email?.toLowerCase() === email
          );
        }
      } catch (e) {
        console.warn('Could not list users for email lookup:', e);
      }

      if (existingAuthUser) {
        // Update password and metadata of existing auth user
        const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(
          existingAuthUser.id,
          {
            password,
            email_confirm: true,
            user_metadata: {
              role: 'receptionist',
              full_name: fullName,
            },
          }
        );

        if (updErr) {
          console.error('Error updating existing receptionist auth user:', updErr);
          return NextResponse.json(
            { error: updErr.message || 'Failed to update credentials' },
            { status: 500 }
          );
        }
        userId = existingAuthUser.id;
      } else {
        // Create new auth user
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
              role: 'receptionist',
              full_name: fullName,
            },
          });

        if (authError) {
          console.error('Error creating receptionist auth user:', authError);
          return NextResponse.json(
            { error: authError.message || 'Failed to create auth account' },
            { status: 500 }
          );
        }
        userId = authData.user.id;
      }
    }

    const receptionistData = {
      full_name: fullName,
      email,
      phone: phone || null,
      user_id: userId,
      role_id: roleData.id,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: createdStaff, error } = await supabaseAdmin
      .from('staff')
      .insert([receptionistData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        ...createdStaff,
        account_created: !!userId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating receptionist:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create receptionist' },
      { status: 500 }
    );
  }
}

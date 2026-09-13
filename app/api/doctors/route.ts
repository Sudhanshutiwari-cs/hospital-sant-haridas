// app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let query = supabaseAdmin
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });

    const isActive = searchParams.get('is_active');
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const specialization = searchParams.get('specialization');
    if (specialization) {
      query = query.eq('specialization', specialization);
    }

    const { data: doctors, error } = await query;

    if (error) throw error;

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      password,
      create_account = true,
      ...rawDoctorData
    } = body;

    const email = (rawDoctorData.email || '').trim().toLowerCase();
    const fullName = (rawDoctorData.full_name || '').trim();

    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Get the role_id for doctor
    const { data: roleData } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('role_name', 'doctor')
      .maybeSingle();

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
              role: 'doctor',
              full_name: fullName,
            },
          }
        );

        if (updErr) {
          console.error('Error updating existing doctor auth user:', updErr);
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
              role: 'doctor',
              full_name: fullName,
            },
          });

        if (authError) {
          console.error('Error creating doctor auth user:', authError);
          return NextResponse.json(
            { error: authError.message || 'Failed to create auth account' },
            { status: 500 }
          );
        }
        userId = authData.user.id;
      }
    }

    const doctorData = {
      ...rawDoctorData,
      email,
      full_name: fullName,
      user_id: userId,
      role_id: roleData?.id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: doctor, error } = await supabaseAdmin
      .from('doctors')
      .insert([doctorData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        ...doctor,
        account_created: !!userId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating doctor:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create doctor' },
      { status: 500 }
    );
  }
}
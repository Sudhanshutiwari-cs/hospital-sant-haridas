// app/api/doctors/account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doctor_id, password, email: customEmail } = body;

    if (!doctor_id) {
      return NextResponse.json(
        { error: 'doctor_id is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // 1. Fetch doctor details
    const { data: doctor, error: doctorErr } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .eq('id', doctor_id)
      .single();

    if (doctorErr || !doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    const emailToUse = (customEmail || doctor.email || '').trim().toLowerCase();
    if (!emailToUse) {
      return NextResponse.json(
        { error: 'Doctor does not have a valid email address' },
        { status: 400 }
      );
    }

    // 2. Fetch doctor role id
    const { data: roleData } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('role_name', 'doctor')
      .maybeSingle();

    const doctorRoleId = roleData?.id || null;

    let targetUserId = doctor.user_id;

    // 3. If doctor already has a user_id linked
    if (targetUserId) {
      const { error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(
        targetUserId,
        {
          password,
          email: emailToUse,
          email_confirm: true,
          user_metadata: {
            role: 'doctor',
            full_name: doctor.full_name,
          },
        }
      );

      if (updateAuthErr) {
        console.error('Error updating existing doctor auth user:', updateAuthErr);
        return NextResponse.json(
          { error: updateAuthErr.message || 'Failed to update login credentials' },
          { status: 500 }
        );
      }
    } else {
      // 4. Doctor has no user_id yet - check if an auth user exists with this email
      let existingAuthUser: any = null;
      try {
        const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });

        if (!listErr && list?.users) {
          existingAuthUser = list.users.find(
            (u) => u.email?.toLowerCase() === emailToUse
          );
        }
      } catch (listErr) {
        console.warn('Could not list users for email lookup:', listErr);
      }

      if (existingAuthUser) {
        // Update password of existing auth user
        const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(
          existingAuthUser.id,
          {
            password,
            email_confirm: true,
            user_metadata: {
              role: 'doctor',
              full_name: doctor.full_name,
            },
          }
        );

        if (updErr) {
          console.error('Error updating existing auth user password:', updErr);
          return NextResponse.json(
            { error: updErr.message || 'Failed to update credentials' },
            { status: 500 }
          );
        }

        targetUserId = existingAuthUser.id;
      } else {
        // Create a new auth user
        const { data: createdUser, error: createErr } =
          await supabaseAdmin.auth.admin.createUser({
            email: emailToUse,
            password,
            email_confirm: true,
            user_metadata: {
              role: 'doctor',
              full_name: doctor.full_name,
            },
          });

        if (createErr) {
          console.error('Error creating doctor auth user:', createErr);
          return NextResponse.json(
            { error: createErr.message || 'Failed to create login account' },
            { status: 500 }
          );
        }

        targetUserId = createdUser.user.id;
      }
    }

    // 5. Update doctors table with user_id, role_id, and updated email
    const { data: updatedDoctor, error: updateDoctorErr } = await supabaseAdmin
      .from('doctors')
      .update({
        user_id: targetUserId,
        role_id: doctorRoleId || doctor.role_id,
        email: emailToUse,
        updated_at: new Date().toISOString(),
      })
      .eq('id', doctor.id)
      .select()
      .single();

    if (updateDoctorErr) {
      console.error('Error linking doctor user_id:', updateDoctorErr);
      return NextResponse.json(
        { error: 'Failed to update doctor profile with login credentials' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Doctor login account configured successfully',
      doctor: updatedDoctor,
      login_details: {
        email: emailToUse,
        login_url: '/login',
      },
    });
  } catch (error: any) {
    console.error('Unexpected error configuring doctor login:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

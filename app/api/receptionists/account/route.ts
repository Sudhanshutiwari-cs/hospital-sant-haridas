// app/api/receptionists/account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { receptionist_id, password, email: customEmail } = body;

    if (!receptionist_id) {
      return NextResponse.json(
        { error: 'receptionist_id is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // 1. Fetch staff member
    const { data: member, error: memberErr } = await supabaseAdmin
      .from('staff')
      .select('*')
      .eq('id', receptionist_id)
      .single();

    if (memberErr || !member) {
      return NextResponse.json(
        { error: 'Receptionist not found' },
        { status: 404 }
      );
    }

    const emailToUse = (customEmail || member.email || '').trim().toLowerCase();
    if (!emailToUse) {
      return NextResponse.json(
        { error: 'Receptionist does not have a valid email address' },
        { status: 400 }
      );
    }

    // 2. Fetch receptionist role id
    const { data: roleData } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('role_name', 'receptionist')
      .maybeSingle();

    const receptionistRoleId = roleData?.id || null;

    let targetUserId = member.user_id;

    // 3. If receptionist already has a user_id linked
    if (targetUserId) {
      const { error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(
        targetUserId,
        {
          password,
          email: emailToUse,
          email_confirm: true,
          user_metadata: {
            role: 'receptionist',
            full_name: member.full_name,
          },
        }
      );

      if (updateAuthErr) {
        console.error('Error updating existing receptionist auth user:', updateAuthErr);
        return NextResponse.json(
          { error: updateAuthErr.message || 'Failed to update login credentials' },
          { status: 500 }
        );
      }
    } else {
      // 4. Receptionist has no user_id yet - check if an auth user exists with this email
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
              role: 'receptionist',
              full_name: member.full_name,
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
              role: 'receptionist',
              full_name: member.full_name,
            },
          });

        if (createErr) {
          console.error('Error creating receptionist auth user:', createErr);
          return NextResponse.json(
            { error: createErr.message || 'Failed to create login account' },
            { status: 500 }
          );
        }

        targetUserId = createdUser.user.id;
      }
    }

    // 5. Update staff table with user_id, role_id, and updated email
    const { data: updatedMember, error: updateStaffErr } = await supabaseAdmin
      .from('staff')
      .update({
        user_id: targetUserId,
        role_id: receptionistRoleId || member.role_id,
        email: emailToUse,
        updated_at: new Date().toISOString(),
      })
      .eq('id', member.id)
      .select()
      .single();

    if (updateStaffErr) {
      console.error('Error linking receptionist user_id:', updateStaffErr);
      return NextResponse.json(
        { error: 'Failed to update receptionist profile with login credentials' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Receptionist login account configured successfully',
      receptionist: updatedMember,
      login_details: {
        email: emailToUse,
        login_url: '/login',
      },
    });
  } catch (error: any) {
    console.error('Unexpected error configuring receptionist login:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

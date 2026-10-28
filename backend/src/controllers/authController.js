import crypto from 'node:crypto';
import { supabaseAdmin, supabasePublic } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { hashPassword, verifyPassword, generateToken } from '../utils/security.js';

/**
 * Register a new user and store credentials in the public.users table
 * Completely bypasses Supabase Auth email rate limits
 */
export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName?.trim() || cleanEmail.split('@')[0];

    // 1. Check if user already exists in public.users
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (checkError && checkError.code === '42P01') {
      return sendError(
        res,
        'TABLE_NOT_FOUND',
        'The users table has not been created yet. Please execute 002_create_users_table.sql in your Supabase SQL Editor.',
        500
      );
    }

    if (existingUser) {
      return sendError(res, 'ALREADY_EXISTS', 'An account with this email already exists', 409);
    }

    // 2. Also attempt to sync with Supabase Auth admin (auto-confirmed, zero emails sent)
    let assignedId = crypto.randomUUID();
    try {
      const { data: sbUser } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: { full_name: cleanName },
      });
      if (sbUser?.user?.id) {
        assignedId = sbUser.user.id;
      }
    } catch (sbErr) {
      // Supabase admin create user warning (e.g. user exists in auth or auth disabled)
      console.warn('Supabase Auth sync skipped or non-fatal:', sbErr.message);
    }

    // 3. Store credentials securely in public.users
    const passwordHash = hashPassword(password);
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: assignedId,
        email: cleanEmail,
        password_hash: passwordHash,
        full_name: cleanName,
        role: 'customer',
      })
      .select('id, email, full_name, role, created_at')
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return sendError(res, 'ALREADY_EXISTS', 'An account with this email already exists', 409);
      }
      console.error('Error inserting into users table:', insertError);
      return sendError(res, 'DATABASE_ERROR', 'Failed to create user record', 500);
    }

    // 4. Issue authenticated JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
    });

    return sendSuccess(
      res,
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          role: newUser.role,
          createdAt: newUser.created_at,
        },
        token,
      },
      201
    );
  } catch (err) {
    console.error('Registration controller error:', err);
    return sendError(res, 'SERVER_ERROR', 'Registration failed', 500);
  }
};

/**
 * Log in a user by verifying credentials against public.users table
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    // 1. Find user in public.users
    const { data: user, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (dbError && dbError.code === '42P01') {
      return sendError(
        res,
        'TABLE_NOT_FOUND',
        'The users table has not been created yet. Please execute 002_create_users_table.sql in your Supabase SQL Editor.',
        500
      );
    }

    // 2. If found in public.users, verify password
    if (user && user.password_hash) {
      const isValid = verifyPassword(password, user.password_hash);
      if (!isValid) {
        return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      });

      return sendSuccess(res, {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          createdAt: user.created_at,
        },
        token,
      });
    }

    // 3. Fallback: Check Supabase Auth for existing accounts
    try {
      const { data: sbAuth, error: sbError } = await supabasePublic.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!sbError && sbAuth?.user) {
        const sbUser = sbAuth.user;
        const name = sbUser.user_metadata?.full_name || cleanEmail.split('@')[0];
        const pwdHash = hashPassword(password);

        // Auto-save into public.users for fast subsequent logins
        await supabaseAdmin.from('users').upsert({
          id: sbUser.id,
          email: cleanEmail,
          password_hash: pwdHash,
          full_name: name,
          role: 'customer',
        });

        const token = generateToken({
          id: sbUser.id,
          email: sbUser.email,
          full_name: name,
          role: 'customer',
        });

        return sendSuccess(res, {
          user: {
            id: sbUser.id,
            email: sbUser.email,
            fullName: name,
            role: 'customer',
          },
          token,
        });
      }
    } catch {
      // Ignore Supabase fallback error
    }

    return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
  } catch (err) {
    console.error('Login controller error:', err);
    return sendError(res, 'SERVER_ERROR', 'Login failed', 500);
  }
};

/**
 * Return current authenticated user profile
 */
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    return sendSuccess(res, {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name || user.user_metadata?.full_name || user.email?.split('@')[0],
        role: user.role || 'customer',
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('getMe error:', err);
    return sendError(res, 'AUTH_ERROR', 'Failed to retrieve user profile', 500);
  }
};

/**
 * Handle server-side logout
 */
export const logout = async (req, res) => {
  try {
    if (req.token) {
      await supabaseAdmin.auth.admin.signOut(req.token).catch(() => {});
    }
    return sendSuccess(res, { message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return sendSuccess(res, { message: 'Logged out successfully' });
  }
};

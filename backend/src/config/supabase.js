import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Privileged Supabase Admin Client using the Service Role Key.
 * Kept strictly on the backend to execute trusted server operations.
 */
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Public Supabase client using Anon Key for general queries or auth checks.
 */
export const supabasePublic = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Creates a scoped Supabase client with the user's Bearer token.
 * Ensures Supabase Row Level Security (RLS) policies are honored.
 */
export const createScopedSupabaseClient = (accessToken) => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};

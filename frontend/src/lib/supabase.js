import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder-project') &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-anon-key';

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase credentials missing or dev server was not restarted after editing frontend/.env. Please restart your Vite dev server.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

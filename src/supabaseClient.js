import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create Supabase client if valid credentials are provided.
// Supports both legacy JWT keys (starting with 'eyJ') and
// newer Supabase publishable keys (starting with 'sb_publishable_').
const isValidConfig =
  supabaseUrl &&
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey &&
  (supabaseAnonKey.startsWith('eyJ') || supabaseAnonKey.startsWith('sb_'));

export const supabase = isValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Disable background auth operations that can cause
        // unhandled errors and crash the React app (resetting
        // state back to login screen)
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  : null;

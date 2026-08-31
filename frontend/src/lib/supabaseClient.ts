import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns a lazily-initialized Supabase client.
 * The URL + anon key are fetched from the backend /api/config endpoint so we
 * never hard-code secrets into the frontend bundle.
 */
export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (supabaseInstance) return supabaseInstance;

  const res = await fetch('/api/config');
  const { supabaseUrl, supabaseAnonKey } = await res.json();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase config not available from server');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,           // stores session in localStorage
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  return supabaseInstance;
}

/** Synchronous accessor — only safe after getSupabaseClient() has been awaited once */
export function getSupabaseClientSync(): SupabaseClient | null {
  return supabaseInstance;
}

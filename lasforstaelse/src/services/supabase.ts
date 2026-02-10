import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase konfiguration - dessa värden behöver fyllas i med ditt Supabase-projekt
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

/**
 * Kontrollera om Supabase är konfigurerat
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * Hämta Supabase-klienten
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return supabaseClient;
}

/**
 * Generera en unik synkkod (6 tecken, lätt att komma ihåg)
 */
export function generateSyncCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Utan I, O, 0, 1 för att undvika förväxling
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Database types för TypeScript
 */
export interface SyncedUserData {
  id?: string;
  sync_code: string;
  name: string;
  user_data: object;
  created_at?: string;
  updated_at?: string;
}

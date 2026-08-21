import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client, constructed on first use.
 *
 * Do not create this at module load. `/api/ai-policies/[id]` (and every
 * other route that imports this file) is evaluated during `next build`
 * page-data collection. `@supabase/supabase-js` throws
 * "supabaseUrl is required" when NEXT_PUBLIC_SUPABASE_URL is unset, which
 * is what 500ed every recent Vercel production deploy of this project.
 *
 * Same lazy Proxy pattern as getStripe() in lib/stripe.ts. Call sites keep
 * using `supabaseAdmin.from(...)`. Auth is unchanged: the service role is
 * still required at request time for admin reads and writes.
 */
let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
      );
    }
    client = createClient(url, key);
  }
  return client;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[
      prop
    ];
  },
});

import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { ACCESS_COOKIE } from "./commerce.ts";
import { hasActiveAccess } from "./entitlement.ts";
import {
  findPaidPurchase,
  findPaidPurchaseByToken,
  findUserPurchase,
  type PurchaseRow,
} from "./records.ts";

export async function currentLearner(): Promise<User | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

export async function accessToken(): Promise<string> {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? "";
}

/** The browser that paid holds the cookie. Any other device signs in. */
export async function findEntitledPurchase(slug: string): Promise<PurchaseRow | null> {
  const token = await accessToken();
  const byCookie = token ? await findPaidPurchase(token, slug) : null;
  if (byCookie && hasActiveAccess(byCookie.paid_at)) return byCookie;
  const user = await currentLearner();
  if (!user) return null;
  return findUserPurchase(user.id, user.email, slug);
}

export async function cookiePurchase(): Promise<PurchaseRow | null> {
  const token = await accessToken();
  return token ? findPaidPurchaseByToken(token) : null;
}

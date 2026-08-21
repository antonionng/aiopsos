import { test } from "node:test";
import assert from "node:assert/strict";

test("importing the admin module does not require env vars", async () => {
  const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prevKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const { supabaseAdmin } = await import("../supabase/admin.ts");
  assert.equal(typeof supabaseAdmin, "object");

  assert.throws(
    () => supabaseAdmin.from("ai_policies"),
    /NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/
  );

  if (prevUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
  if (prevKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  else process.env.SUPABASE_SERVICE_ROLE_KEY = prevKey;
});

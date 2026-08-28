import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveUserContext } from "@/lib/resolve-user-context";
import { ChatSurface } from "@/components/chat/chat-surface";
import type { UserRole } from "@/lib/role-helpers";

/**
 * Role and plan are resolved on the server and handed down as props.
 *
 * The client used to fetch both itself and render `null` until the role query
 * came back, so every load flashed an empty pane and the model selector and
 * Share/Export buttons popped into the toolbar afterwards.
 */
export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, ctx] = await Promise.all([
    supabase.from("user_profiles").select("role").eq("id", user.id).maybeSingle(),
    resolveUserContext(),
  ]);

  const role = (profile?.role ?? "user") as UserRole;
  const plan = ctx?.plan ?? "basic";

  return <ChatSurface role={role} plan={plan} />;
}

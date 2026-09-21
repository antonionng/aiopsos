import { redirect } from "next/navigation";

/** Existing home bookmarks now open the learning workspace. */
export default function HubPage() {
  redirect("/dashboard/learning");
}

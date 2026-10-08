import { NextResponse } from "next/server";
import {
  apiError,
  assertOrigin,
  readBody,
  requireParent,
  WonderlabError,
} from "@/lib/wonderlab/server";
import { cancelMembership } from "@/lib/wonderlab/memberships";
export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const user = await requireParent();
    const body = await readBody(req);
    if (body.action !== "cancel" || typeof body.membershipId !== "string")
      throw new WonderlabError("Choose a membership to cancel.");
    await cancelMembership(user.id, body.membershipId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

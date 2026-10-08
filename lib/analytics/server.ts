import { track } from "@vercel/analytics/server";
import { PURCHASE_EVENT, purchasePropsFromSession } from "@/lib/analytics/course-events";

type PaidSession = Parameters<typeof purchasePropsFromSession>[0];

/** Record a confirmed course payment. Errors are swallowed so fulfilment is unchanged. */
export async function trackPaidCoursePurchase(
  session: PaidSession,
  eventType?: string,
): Promise<void> {
  try {
    if (eventType && eventType !== "checkout.session.completed") return;
    const props = purchasePropsFromSession(session);
    if (!props) return;
    await track(PURCHASE_EVENT, props);
  } catch {
    // Custom events no-op on Hobby. A Pro outage must not fail the webhook.
  }
}

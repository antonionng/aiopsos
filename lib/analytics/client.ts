import { track } from "@vercel/analytics";
import { BUY_CLICK_EVENT, type BuyClickProps } from "@/lib/analytics/course-events";

/** Fire-and-forget. Checkout must continue if analytics is unavailable. */
export function trackBuyClick(props: BuyClickProps): void {
  try {
    track(BUY_CLICK_EVENT, props);
  } catch {
    // Vercel Web Analytics is optional on Hobby; never block a purchase click.
  }
}

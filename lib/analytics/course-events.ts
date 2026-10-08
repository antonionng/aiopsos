export const BUY_CLICK_EVENT = "buy_click";
export const PURCHASE_EVENT = "purchase";
export const AGENT_COURSE_PURPOSE = "agent_course";
const SELF_SERVE_PURPOSE = "self_serve_course";
const TEAM_PURPOSE = "self_serve_team";

export type BuyClickProps = {
  slug: string;
  price_gbp: number;
  placement: string;
  seats?: number;
};

export type PurchaseProps = {
  slug: string;
  amount: number;
  currency: string;
  promotion_code?: string;
  seats?: number;
};

type SessionDiscount = {
  promotion_code?: string | { id?: string; code?: string | null } | null;
  coupon?: string | { id?: string; name?: string | null } | null;
};

type SessionLike = {
  payment_status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  cancel_url?: string | null;
  success_url?: string | null;
  metadata?: Record<string, string> | null;
  discounts?: SessionDiscount[] | null;
  total_details?: {
    amount_discount?: number | null;
    breakdown?: { discounts?: Array<{ discount?: SessionDiscount | null }> | null } | null;
  } | null;
};

function namedCode(
  value: string | { id?: string; code?: string | null; name?: string | null } | null | undefined,
): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.code || value.name || value.id || undefined;
}

export function promotionCodeFromSession(session: SessionLike): string | undefined {
  for (const discount of session.discounts ?? []) {
    const code = namedCode(discount.promotion_code) ?? namedCode(discount.coupon);
    if (code) return code;
  }
  for (const row of session.total_details?.breakdown?.discounts ?? []) {
    const code =
      namedCode(row.discount?.promotion_code) ?? namedCode(row.discount?.coupon);
    if (code) return code;
  }
  return undefined;
}

function slugFromUrl(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const querySlug = url.searchParams.get("slug")?.trim();
    if (querySlug) return querySlug;
    const agent = url.pathname.match(/^\/courses\/agents\/([^/]+)$/);
    if (agent?.[1] && !["checkout", "learn", "welcome", "review"].includes(agent[1])) {
      return agent[1];
    }
    const learn = url.pathname.match(/^\/learn\/([^/]+)$/);
    if (learn?.[1]) return learn[1];
  } catch {
    return undefined;
  }
  return undefined;
}

export function courseSlugFromSession(session: SessionLike): string | undefined {
  const fromMeta = session.metadata?.course_slug?.trim();
  if (fromMeta) return fromMeta;
  return slugFromUrl(session.cancel_url) ?? slugFromUrl(session.success_url);
}

export function isCourseCheckout(metadata: Record<string, string> | null | undefined): boolean {
  const purpose = metadata?.purpose;
  return (
    purpose === SELF_SERVE_PURPOSE ||
    purpose === TEAM_PURPOSE ||
    purpose === AGENT_COURSE_PURPOSE
  );
}

export function purchasePropsFromSession(session: SessionLike): PurchaseProps | null {
  if (session.payment_status !== "paid") return null;
  if (!isCourseCheckout(session.metadata)) return null;
  const slug = courseSlugFromSession(session);
  if (!slug || session.amount_total == null || !session.currency) return null;

  const purpose = session.metadata?.purpose;
  const seats =
    purpose === TEAM_PURPOSE
      ? Number(session.metadata?.seats)
      : 1;

  const props: PurchaseProps = {
    slug,
    amount: session.amount_total,
    currency: session.currency.toUpperCase(),
  };
  const promotionCode = promotionCodeFromSession(session);
  if (promotionCode) props.promotion_code = promotionCode;
  if (Number.isInteger(seats) && seats > 0) props.seats = seats;
  return props;
}

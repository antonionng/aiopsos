/**
 * Where the cookie banner is allowed to appear.
 *
 * It is fixed to the bottom of the viewport at z-9999 and mounted in the root
 * layout, so inside the signed-in app it sat directly on top of the chat
 * composer's send button. Signed-in users have already accepted at sign-up,
 * so the banner belongs to the public site only.
 */
export function shouldShowCookieBanner(
  pathname: string | null | undefined,
  storedConsent: string | null
): boolean {
  if (storedConsent) return false;
  if (!pathname) return false;
  return !pathname.startsWith("/dashboard");
}

/**
 * Where the cookie banner is allowed to appear.
 *
 * It is fixed to the bottom of the viewport at z-9999 and mounted in the root
 * layout, so inside the signed-in app it sat directly on top of the chat
 * composer's send button. Signed-in users have already accepted at sign-up,
 * so the banner belongs to the public site only.
 *
 * Full-screen Wonderlab games are excluded for the same reason: the banner
 * covered a child's main game button. Without a stored choice, only essential
 * cookies apply, so the choice is offered again on the next ordinary page.
 */
const FULL_SCREEN_GAMES = ["/wonderlab/creature-crossing", "/wonderlab/arcade-preview", "/wonderlab/snack-sorter"];

export function shouldShowCookieBanner(
  pathname: string | null | undefined,
  storedConsent: string | null
): boolean {
  if (storedConsent) return false;
  if (!pathname) return false;
  if (FULL_SCREEN_GAMES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) return false;
  return !pathname.startsWith("/dashboard");
}

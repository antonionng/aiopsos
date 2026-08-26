/**
 * Paths that must render without a session, and without constructing a
 * Supabase client. Editorial and marketing live here; a missing
 * NEXT_PUBLIC_SUPABASE_URL must not 307 them to /login.
 */
export function isAuthPath(pathname: string): boolean {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  );
}

export function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/verify/") ||
    pathname === "/courses" ||
    pathname.startsWith("/courses/") ||
    pathname.startsWith("/assess/") ||
    pathname.startsWith("/assessment/") ||
    pathname.startsWith("/api/public/") ||
    pathname === "/api/assessment/public-submit" ||
    /^\/api\/assessment\/[^/]+\/public-info$/.test(pathname) ||
    // Anonymous by definition: you have no session while creating one.
    // "/contact" below matches the page, not the endpoint the form posts to.
    pathname === "/api/auth/register" ||
    pathname === "/api/auth/forgot" ||
    pathname === "/api/contact" ||
    // Mooov's servers post here with an HMAC signature, not a session;
    // the route verifies the signature itself.
    pathname === "/api/mooov/webhook" ||
    pathname.startsWith("/auth/callback") ||
    // Social-card crawlers never carry a session.
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/cookies") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/changelog") ||
    pathname.startsWith("/status") ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/insights" ||
    pathname.startsWith("/insights/")
  );
}

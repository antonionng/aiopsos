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
    pathname === "/accept-invite" ||
    pathname === "/api/auth/accept-invite" ||
    // Scheduler authentication is checked by the route, without a browser session.
    pathname === "/api/cron/learning-agent-recovery" ||
    pathname === "/api/cron/self-serve-nudges" ||
    pathname === "/llms.txt" ||
    pathname === "/llms-full.txt" ||
    pathname === "/ai-labs" ||
    pathname === "/case-studies" ||
    pathname.startsWith("/case-studies/") ||
    pathname === "/learning-agent" ||
    pathname === "/learning-agent/chat" ||
    pathname === "/resources/hr-automation-checklist.csv" ||
    pathname.startsWith("/verify/") ||
    pathname === "/courses" ||
    pathname.startsWith("/courses/") ||
    // Self-serve is public so a disabled flag 404s inside the page, rather
    // than the middleware sending an unknown path to /login.
    pathname === "/learn" ||
    pathname.startsWith("/learn/") ||
    pathname === "/api/learn/checkout" ||
    pathname === "/api/learn/claim" ||
    pathname === "/api/learn/progress" ||
    pathname === "/api/learn/account" ||
    pathname === "/api/learn/feedback" ||
    pathname.startsWith("/api/learn/certificate/") ||
    // Stripe posts here with a signature, not a session.
    pathname === "/api/stripe/webhook" ||
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
    pathname === "/api/learning-check" ||
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
    pathname.startsWith("/experrt-ai") ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/insights" ||
    pathname.startsWith("/insights/") ||
    pathname === "/use-cases" ||
    pathname.startsWith("/use-cases/")
  );
}

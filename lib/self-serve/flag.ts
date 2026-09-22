/**
 * Self-serve courses stay off unless an environment explicitly turns them on.
 * Unset means off, including production. No default that could publish the
 * player onto experrt.com by accident.
 */
export function isSelfServeEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_SELF_SERVE_COURSES === "true" ||
    process.env.SELF_SERVE_COURSES === "true"
  );
}

/**
 * The homepage link follows only the public env. A server-only flag must not
 * paint "Start a course" onto the live homepage, because that string is
 * inlined into the client bundle.
 */
export function showSelfServeOnHomepage(): boolean {
  return process.env.NEXT_PUBLIC_SELF_SERVE_COURSES === "true";
}

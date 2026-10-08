/**
 * Self-serve courses are on unless an environment turns them off.
 * Set NEXT_PUBLIC_SELF_SERVE_COURSES=false to hide the homepage pitch and
 * 404 the /learn room. A server-only SELF_SERVE_COURSES=false still 404s
 * the room without changing the inlined homepage string.
 */
function readFlag(name: string): boolean | undefined {
  const value = process.env[name];
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export function isSelfServeEnabled(): boolean {
  return readFlag("NEXT_PUBLIC_SELF_SERVE_COURSES") ?? readFlag("SELF_SERVE_COURSES") ?? true;
}

/**
 * The homepage link follows only the public env, because that string is
 * inlined into the client bundle. Unset means on.
 */
export function showSelfServeOnHomepage(): boolean {
  return readFlag("NEXT_PUBLIC_SELF_SERVE_COURSES") ?? true;
}

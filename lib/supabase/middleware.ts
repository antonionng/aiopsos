import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isAuthPath,
  isPublicPath,
  isSessionGatedPath,
} from "@/lib/public-routes";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthPage = isAuthPath(pathname);
  const isPublicRoute = isPublicPath(pathname);

  // Public marketing, /contact, /insights and /blog must not touch Supabase.
  // Constructing the client here is what turns a missing
  // NEXT_PUBLIC_SUPABASE_URL into a failed request (or, previously, a login
  // wall). /blog is public so crawlers get the 308 to /insights, not a 307
  // to /login.
  if (isPublicRoute) {
    return NextResponse.next({ request });
  }

  // Unknown paths (stale marketing URLs, typos) used to 307 to /login
  // because the default was "private". Let Next 404 them, or apply a
  // configured 301, instead of teaching crawlers that every miss is a
  // login wall.
  if (!isAuthPage && !isSessionGatedPath(pathname)) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isAuthPage) {
      return NextResponse.next({ request });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const isResetPage = pathname.startsWith("/reset-password");
  if (user && isAuthPage && !isResetPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

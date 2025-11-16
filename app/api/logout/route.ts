import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const callbackUrl = `${origin}/sign-in`;

  // Redirect to NextAuth signout endpoint which will finish clearing NextAuth
  // session server-side. We include a callbackUrl back to the app sign-in page.
  const signoutUrl = `${origin}/api/auth/signout?callbackUrl=${encodeURIComponent(
    callbackUrl
  )}`;

  const res = NextResponse.redirect(signoutUrl);

  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  // Also clear common NextAuth cookies to be safe
  res.cookies.set("next-auth.session-token", "", { path: "/", maxAge: 0 });
  res.cookies.set("__Secure-next-auth.session-token", "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}

export async function POST(req: Request) {
  return GET(req);
}

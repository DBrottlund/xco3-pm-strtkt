import { NextResponse } from "next/server";
import { auth, BASE_PATH } from "@/app/api/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth((req) => {
  const reqUrl = new URL(req.url);
  const isAuth = !!req.auth;
  const isSigninPage = reqUrl.pathname === "/signin";
  const isRootPage = reqUrl.pathname === "/";
  const callbackUrl = reqUrl.searchParams.get("callbackUrl");

  if (!isAuth && !isSigninPage) {
    // Avoid redirecting to /signin if already trying to access it
    return NextResponse.redirect(
      new URL(
        `${BASE_PATH}/signin?callbackUrl=${encodeURIComponent(reqUrl.pathname)}`,
        req.url
      )
    );
  }

  if (isAuth && isSigninPage) {
    // If already signed in and trying to access the sign-in page, redirect to the dashboard
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  }

  if (isAuth && isRootPage) {
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  }

  if (isAuth && reqUrl.pathname === "/dashboard" && callbackUrl) {
    // Prevent redirect loops when already at the dashboard with a callback URL
    return NextResponse.redirect(new URL(callbackUrl, req.url));
  }

  return NextResponse.next();
});

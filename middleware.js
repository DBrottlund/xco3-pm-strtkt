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

  if (!isAuth && !isSigninPage) {
    return NextResponse.redirect(
      new URL(
        `${BASE_PATH}/signin?callbackUrl=${encodeURIComponent(reqUrl.pathname)}`,
        req.url
      )
    );
  }

  if (isAuth && isRootPage) {
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  }

  return NextResponse.next();
});

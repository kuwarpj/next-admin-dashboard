import { NextResponse } from "next/server";

export default function middleware(request:any) {
  const user = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const redirectUrl = user ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if ((pathname === "/login" || pathname === "/registration") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

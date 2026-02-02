import { NextResponse } from "next/server";

export function middleware(req) {
  const page = req.nextUrl.searchParams.get("page") || "main";

  const url = req.nextUrl.clone();
  url.pathname = `/${page}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};

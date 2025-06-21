import { NextResponse } from "next/server";

// Middleware utama
export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Bypass middleware jika mengakses /login
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Jika tidak ada token, arahkan ke halaman 404
  if (!token) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  // Jika ada token, lanjutkan ke halaman yang diminta
  return NextResponse.next();
}

// Konfigurasi matcher untuk semua halaman, kecuali _next, api, static
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};

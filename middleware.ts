import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** 免登录模式：中间件仅做通行 */
export async function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "./lib/auth/auth";
 
export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
 
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
	matcher: ["/admin/:path*"], // Specify the routes the middleware applies to
};
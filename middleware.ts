import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const _auth = await auth();
  const metadata: Record<string, any> = (_auth.sessionClaims?.metadata ||
    {}) as Record<string, any>;
  if (isAdminRoute(req) && metadata.role !== "admin") {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

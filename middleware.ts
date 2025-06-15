import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);
const isUserRoute = createRouteMatcher(["/invitations(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  const role = (await auth()).sessionClaims?.metadata?.role;

  if (userId && req.nextUrl.pathname === "/") {
    const redirectUrl = role === "admin" ? "/dashboard" : "/invitations";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  if (isAdminRoute(req) && role !== "admin") {
    const url = new URL("/invitations", req.url);
    return NextResponse.redirect(url);
  }
  if (isUserRoute(req) && role === "admin") {
    const url = new URL("/dashboard", req.url);
    return NextResponse.redirect(url);
  }

  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

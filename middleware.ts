import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isUserRoute = createRouteMatcher(["/dashboard(.*)", "/invitation/:id*"]);

const allowedOrigins = [`${process.env.NEXT_PUBLIC_BASE_URL}`];

function withPathHeaders(res: NextResponse, req: NextRequest) {
  res.headers.set("x-invoke-path", req.nextUrl.pathname);
  res.headers.set("x-invoke-query", req.nextUrl.search);
  return res;
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  const pathname = req.nextUrl.pathname;
  const origin = req.headers.get("origin") || "";

  const client = await clerkClient();
  let role = null;
  if (userId) {
    const user = await client.users.getUser(userId);
    role = user.publicMetadata.role;
  }

  function addCorsHeaders(response: NextResponse, origin: string) {
    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      // response.headers.set("Access-Control-Allow-Origin", "*");
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, x-api-key, Authorization"
    );
    return response;
  }

  if (
    req.method === "OPTIONS" &&
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/public")
  ) {
    const res = new NextResponse(null, { status: 204 });
    return addCorsHeaders(res, origin);
  }

  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/public")) {
    const apiKey = req.headers.get("x-api-key");
    const validKeys = [process.env.NEXT_PUBLIC_API_KEY];

    if (!apiKey || !validKeys.includes(apiKey)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid or missing API key" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.next();
  }

  if (!userId && (isAdminRoute(req) || isUserRoute(req))) {
    return redirectToSignIn();
  }

  if (userId && req.nextUrl.pathname === "/") {
    const redirectUrl = role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  if (isAdminRoute(req) && role !== "admin") {
    const url = new URL("/dashboard", req.url);
    return NextResponse.redirect(url);
  }
  if (isUserRoute(req) && role === "admin") {
    const url = new URL("/admin", req.url);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/api/public")) {
    const res = NextResponse.next();
    return addCorsHeaders(res, origin);
  }

  if (!pathname.startsWith("/api")) {
    return withPathHeaders(NextResponse.next(), req);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

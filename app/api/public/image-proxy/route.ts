export async function GET(req: Request) {
  console.log("msuk");
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl || !imageUrl.startsWith("https://res.cloudinary.com/")) {
    return new Response("Invalid or missing image URL", { status: 400 });
  }

  const res = await fetch(imageUrl);

  const headers = new Headers(res.headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(res.body, {
    status: res.status,
    headers,
  });
}

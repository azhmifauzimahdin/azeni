import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    const role = (user.publicMetadata as { role?: "admin" | "user" })?.role;
    if (role === "admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to AZEN Digital Invitation</h1>
      <p>
        Please&nbsp;
        <Link href="/sign-in" className="text-blue-500">
          Login
        </Link>
        &nbsp;or&nbsp;
        <Link href="/sign-up" className="text-blue-500">
          Register
        </Link>
        &nbsp;to continue.
      </p>
      <UserButton />
    </main>
  );
}

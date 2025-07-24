import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
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

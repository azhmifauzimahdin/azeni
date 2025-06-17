import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to the Public Homepage</h1>
      <p>
        Please <a href="/sign-in">Login</a> or <a href="/sign-up">Register</a>{" "}
        to continue.
      </p>
      <UserButton />
    </main>
  );
}

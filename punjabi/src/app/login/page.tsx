import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = buildMetadata({
  title: "Sign in — Indian Grill, Edmonton",
  description: "Log in or create an account at Indian Grill.",
  path: "login",
});

// Next.js 16: searchParams is a Promise. Login and Signup route here; ?mode
// picks the initial view, then the client card toggles between the two.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return (
    <section className="grid min-h-svh place-items-center px-4 pt-[140px] pb-24">
      <AuthCard initialMode={mode === "signup" ? "signup" : "login"} />
    </section>
  );
}

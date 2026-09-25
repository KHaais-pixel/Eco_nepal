import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import LoginForm from "@/components/admin/LoginForm";
import { isAuthConfigured } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  // Read the env at request time, not build time, so setting the admin
  // variables on the server takes effect after a restart (no rebuild).
  await connection();
  const configured = isAuthConfigured();
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/brand/logo-full.png" className="h-auto w-[170px]" alt="Econepal Energy Industries Pvt. Ltd." width={170} height={174} priority />
          <h1 className="mt-6 font-display text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-3">Manage enquiries, products and company info.</p>
        </div>
        <div className="rounded-2xl border border-ink/[0.08] bg-white p-7 shadow-sm">
          {configured ? (
            <LoginForm />
          ) : (
            <p role="alert" className="text-sm leading-relaxed text-muted-1">
              Admin sign-in isn&rsquo;t configured on this server yet. Set{" "}
              <code className="font-mono-label text-xs">ADMIN_EMAIL</code>,{" "}
              <code className="font-mono-label text-xs">ADMIN_PASSWORD_HASH</code> and{" "}
              <code className="font-mono-label text-xs">SESSION_SECRET</code> — see ADMIN.md.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { logout } from "@/app/admin/actions";
import { verifyAdmin } from "@/lib/auth/dal";
import { listEnquiries } from "@/lib/cms/store";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await verifyAdmin();
  const newEnquiries = (await listEnquiries()).filter((e) => e.status === "new").length;

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-ink/[0.08] bg-white px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
        <div className="mb-4 flex items-center justify-between gap-3 lg:mb-8 lg:block">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/brand/logo-full.png" alt="" width={44} height={46} className="h-11 w-auto" />
            <span className="leading-tight">
              <span className="block text-sm font-bold">Econepal Energy</span>
              <span className="font-mono-label block text-[10px] text-muted-3">ADMIN PANEL</span>
            </span>
          </Link>
        </div>
        <AdminNav newEnquiries={newEnquiries} />
        <div className="mt-4 flex gap-2 border-t border-ink/[0.08] pt-4 lg:absolute lg:inset-x-5 lg:bottom-6 lg:mt-0 lg:flex-col">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-1 hover:bg-ink/[0.05]"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> View website
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-1 hover:bg-ink/[0.05]"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Images, Inbox, LayoutDashboard, Package } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/company", label: "Company info", icon: Building2 },
];

export default function AdminNav({ newEnquiries }: { newEnquiries: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-forest text-cream" : "text-muted-1 hover:bg-ink/[0.05]"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
            {href === "/admin/enquiries" && newEnquiries > 0 && (
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  active ? "bg-cream text-forest" : "bg-leaf text-cream"
                }`}
              >
                {newEnquiries}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

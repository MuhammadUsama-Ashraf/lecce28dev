"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/admin/actions/auth";
import type { Role } from "@/generated/prisma/enums";

const LINKS: { href: string; label: string; minRole: Role }[] = [
  { href: "/admin", label: "Overview", minRole: "STAFF" },
  { href: "/admin/orders", label: "Orders", minRole: "STAFF" },
  { href: "/admin/products", label: "Products", minRole: "STAFF" },
  { href: "/admin/promo-codes", label: "Promo codes", minRole: "ADMIN" },
  { href: "/admin/sales", label: "Sales", minRole: "ADMIN" },
  { href: "/admin/settings", label: "Settings", minRole: "ADMIN" },
  { href: "/admin/staff", label: "Staff", minRole: "OWNER" },
];

const RANK: Record<Role, number> = { STAFF: 1, ADMIN: 2, OWNER: 3 };

export default function AdminNav({
  user,
}: {
  user: { name: string; email: string; role: Role };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const visible = LINKS.filter((l) => RANK[user.role] >= RANK[l.minRole]);

  const isCurrent = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* phone bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
        <span className="text-[15px] tracking-tight">
          LECCE<span className="font-semibold">28</span> admin
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle admin menu"
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-[13px]"
        >
          Menu
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-neutral-200 px-5 py-5">
          <Link href="/admin" className="text-[17px] tracking-tight">
            LECCE<span className="font-semibold">28</span>
          </Link>
          <p className="mt-0.5 text-[12px] text-neutral-500">Store administration</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {visible.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(link.href) ? "page" : undefined}
              className={`mb-0.5 block rounded-lg px-3 py-2 text-[14px] transition ${
                isCurrent(link.href)
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-3 block rounded-lg px-3 py-2 text-[13px] text-neutral-500 hover:bg-neutral-100"
          >
            View storefront ↗
          </Link>
        </nav>

        <div className="border-t border-neutral-200 p-4">
          <p className="truncate text-[13px] font-medium text-neutral-800">{user.name}</p>
          <p className="truncate text-[12px] text-neutral-500">{user.email}</p>
          <p className="mt-1 text-[11px] tracking-wide text-neutral-400 uppercase">{user.role}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="mt-3 w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-[13px] text-neutral-700 hover:bg-neutral-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {open ? (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
        />
      ) : null}
      <div className="h-[52px] lg:hidden" />
    </>
  );
}

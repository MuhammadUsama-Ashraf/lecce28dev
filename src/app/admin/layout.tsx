import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { getCurrentUser } from "@/lib/dal";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Lecce 28 admin" },
  robots: { index: false, follow: false },
};

/** The login page renders its own full-screen shell, so the chrome only goes
 *  up once someone is signed in. Pages still guard themselves — this is
 *  presentation, not authorisation. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900">
      <AdminNav user={user} />
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

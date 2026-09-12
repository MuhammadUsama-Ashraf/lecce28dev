import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-[22px] tracking-tight text-neutral-900">
            LECCE<span className="font-semibold">28</span>
          </p>
          <p className="mt-1 text-[13px] text-neutral-500">Store administration</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

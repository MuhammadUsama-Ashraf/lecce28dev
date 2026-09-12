import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Shared shell pieces for the admin. Deliberately plain: this is a working
 *  surface, not the storefront, so it reads as a tool rather than a brand. */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] leading-tight font-semibold text-neutral-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-[14px] text-neutral-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
    >
      {title ? (
        <header className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-neutral-900">{title}</h2>
          {description ? <p className="mt-0.5 text-[13px] text-neutral-500">{description}</p> : null}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-neutral-700">{label}</span>
      {children}
      {hint && !error ? <span className="mt-1 block text-[12px] text-neutral-500">{hint}</span> : null}
      {error ? <span className="mt-1 block text-[12px] text-red-600">{error}</span> : null}
    </label>
  );
}

const controlClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[14px] text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-100 disabled:text-neutral-500";

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={`${controlClass} min-h-24 ${props.className ?? ""}`} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function Checkbox({ label, ...props }: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="flex items-center gap-2 text-[14px] text-neutral-800">
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900/20"
      />
      {label}
    </label>
  );
}

type ButtonTone = "primary" | "secondary" | "danger" | "ghost";

const tones: Record<ButtonTone, string> = {
  primary: "bg-neutral-900 text-white hover:bg-neutral-700 disabled:bg-neutral-400",
  secondary: "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  ghost: "text-neutral-600 hover:bg-neutral-100",
};

export function Button({
  tone = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { tone?: ButtonTone }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[14px] font-medium transition disabled:cursor-not-allowed ${tones[tone]} ${className}`}
    />
  );
}

export function LinkButton({
  tone = "secondary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { tone?: ButtonTone }) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[14px] font-medium transition ${tones[tone]} ${className}`}
    />
  );
}

const badgeTones: Record<string, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-800",
};

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center">
      <p className="text-[15px] font-medium text-neutral-800">{title}</p>
      {hint ? <p className="mx-auto mt-1 max-w-md text-[13px] text-neutral-500">{hint}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 text-[12px] font-semibold tracking-wide text-neutral-600 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle text-[14px] text-neutral-800 ${className}`}>{children}</td>;
}

export function FormMessage({ state }: { state?: { error?: string; success?: string } | null }) {
  if (!state?.error && !state?.success) return null;
  return (
    <p
      role="status"
      className={`rounded-lg px-3 py-2 text-[13px] ${
        state.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"
      }`}
    >
      {state.error ?? state.success}
    </p>
  );
}

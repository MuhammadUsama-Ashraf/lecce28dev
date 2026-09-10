"use client";

import { useState } from "react";
import { SUPPORT_EMAIL } from "@/content/site";

const FIELDS = [
  { name: "name", label: "Full Name", type: "text", autoComplete: "name" },
  { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Email Address", type: "email", autoComplete: "email" },
] as const;

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", phone: "", email: "", message: "" });

  // No backend on this rebuild — the form composes a message to the real
  // Lecce 28 support inbox so the enquiry still reaches a human.
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `Website enquiry from ${values.name || "a customer"}`,
  )}&body=${encodeURIComponent(
    `Name: ${values.name}\nPhone: ${values.phone}\nEmail: ${values.email}\n\n${values.message}`,
  )}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailto;
      }}
      className="space-y-7"
    >
      {FIELDS.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="eyebrow text-ink-soft">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            required={f.name !== "phone"}
            value={values[f.name]}
            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            className="mt-2 w-full border-b border-ink/25 bg-transparent py-3 text-sm outline-none transition-colors focus:border-ink"
          />
        </div>
      ))}

      <div>
        <label htmlFor="message" className="eyebrow text-ink-soft">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className="mt-2 w-full resize-none border-b border-ink/25 bg-transparent py-3 text-sm outline-none transition-colors focus:border-ink"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-ink py-4 text-[11px] uppercase tracking-[0.26em] text-sand-50 transition-opacity hover:opacity-85 sm:w-auto sm:px-14"
      >
        Submit
      </button>

      <p className="text-xs text-ink-soft">
        Prefer email? Write directly to{" "}
        <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}

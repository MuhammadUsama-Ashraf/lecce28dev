"use client";

import { useState } from "react";
import { SUPPORT_EMAIL } from "@/content/site";

/** The blog sidebar's subscribe card, matching the live site's copy. */
export default function SidebarSubscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="border hairline bg-sand-100 p-6">
      <h3 className="font-display text-xl">Subscribe</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        No spam, notifications only about new products, updates.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
        className="mt-5"
      >
        <label htmlFor="sidebar-email" className="sr-only">
          Email Address
        </label>
        <input
          id="sidebar-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full rounded-full border border-ink/20 bg-sand-50 px-5 py-3 text-sm outline-none transition-colors focus:border-ink placeholder:text-ink-soft/60"
        />
        <button
          type="submit"
          className="mt-4 rounded-full border border-ink px-8 py-3 text-[11px] tracking-[0.24em] uppercase transition-colors hover:bg-ink hover:text-sand-50"
        >
          {done ? "Subscribed" : "Subscribe"}
        </button>
      </form>
      {done ? (
        <p className="mt-4 text-xs text-ink-soft">
          Thank you. Questions? Write to{" "}
          <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="mt-6 flex items-end gap-4 border-b border-white/40 pb-2"
    >
      <label htmlFor="footer-email" className="sr-only">
        Your Email
      </label>
      <input
        id="footer-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        className="t-body w-full bg-transparent text-white outline-none placeholder:text-white/50"
      />
      <button
        type="submit"
        className="t-body shrink-0 underline underline-offset-4 hover:opacity-70"
      >
        {done ? "Thanks" : "Submit"}
      </button>
    </form>
  );
}

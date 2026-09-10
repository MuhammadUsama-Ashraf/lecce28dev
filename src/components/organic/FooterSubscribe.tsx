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
      className="mt-6 flex items-end gap-4 border-b border-black/40 pb-2"
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
        className="w-full bg-transparent text-[15px] text-black outline-none placeholder:text-[#54595F]"
      />
      <button
        type="submit"
        className="shrink-0 text-[15px] text-black underline underline-offset-4 hover:opacity-70"
      >
        {done ? "Thanks" : "Submit"}
      </button>
    </form>
  );
}

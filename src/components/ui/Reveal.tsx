"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  /** Above-the-fold content: animate on mount rather than waiting for scroll. */
  immediate?: boolean;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (immediate) {
      const id = requestAnimationFrame(() => setSeen(true));
      return () => cancelAnimationFrame(id);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${seen ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

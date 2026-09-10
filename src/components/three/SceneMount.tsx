"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { LabelSpec } from "./Vessel";
import type { Vessel as VesselKind } from "@/content/products";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const ProductViewer = dynamic(() => import("./ProductViewer"), { ssr: false });

/** Mounts a WebGL scene only once it is near the viewport, and never when the
 *  device asks for reduced motion or lacks WebGL. */
function useLazyScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl2") && !probe.getContext("webgl")) return;
    } catch {
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, ready };
}

export function HeroSceneMount() {
  const { ref, ready } = useLazyScene();
  return (
    <div ref={ref} className="absolute inset-0">
      {ready ? <HeroScene /> : null}
    </div>
  );
}

export function ProductViewerMount(props: {
  vessel: VesselKind;
  color: string;
  labels: LabelSpec[];
  fallback: React.ReactNode;
}) {
  const { ref, ready } = useLazyScene();
  return (
    <div ref={ref} className="absolute inset-0">
      {ready ? (
        <ProductViewer vessel={props.vessel} color={props.color} labels={props.labels} />
      ) : (
        props.fallback
      )}
    </div>
  );
}

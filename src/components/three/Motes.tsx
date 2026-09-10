"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Slow-drifting gold motes — the "scent in the air" layer behind the vessels. */
export default function Motes({ count = 220, radius = 9 }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    // Deterministic scatter — same drift every load, no hydration surprises.
    let seed = 0x2b1c;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 0xffffffff;
      return seed / 0xffffffff;
    };
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * radius * 2;
      arr[i * 3 + 1] = (rand() - 0.5) * radius;
      arr[i * 3 + 2] = (rand() - 0.5) * radius - 2;
    }
    return arr;
  }, [count, radius]);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    pts.rotation.y += delta * 0.02;
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const base = positions[i * 3 + 1];
      attr.setY(i, base + Math.sin(t * 0.35 + i) * 0.18);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#c9a97a"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

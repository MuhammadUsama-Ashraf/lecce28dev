"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Vessel from "@/components/three/Vessel";

const LABELS = {
  wash: {
    kicker: "Chamomile & Olive Oil",
    title: "Body Wash",
    scent: "Fumo di Cocco",
    body: "A comforting, delightfully foaming cleanser infused with natural Chamomile extract and skin-smoothing Olive Oil.",
    volume: "16 fl. oz. / 473 ml",
  },
  butter: {
    kicker: "Natural",
    title: "Body Butter",
    scent: "Fumo di Cocco",
    body: "This thick, long-lasting cream moisturizes even the driest skin. Over 98% natural.",
    volume: "8 oz / 227 g",
  },
  lotion: {
    kicker: "Jojoba Intense Therapy",
    title: "Body Lotion",
    scent: "Fumo di Cocco",
    body: "All that you expect from a professional spa quality lotion. Avocado oil, jojoba oil and aloe vera protect the skin.",
    volume: "16 fl. oz. / 473 ml",
  },
};

function Trio() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const scroll =
      typeof window !== "undefined" ? window.scrollY / (window.innerHeight || 1) : 0;
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      state.pointer.x * 0.35 + scroll * 0.7,
      3,
      delta,
    );
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.1, 3, delta);
    g.position.y = THREE.MathUtils.damp(
      g.position.y,
      -1.25 + Math.sin(state.clock.elapsedTime * 0.55) * 0.05,
      3,
      delta,
    );
  });

  return (
    <group ref={group} position={[0, -1.25, 0]} scale={0.95}>
      <Vessel
        kind="pump"
        color="#b3702f"
        label={LABELS.wash}
        position={[-1.85, 0, 0]}
        rotation={[0, 0.24, 0]}
      />
      <Vessel
        kind="jar"
        color="#9a6231"
        label={LABELS.butter}
        position={[0, 0, 1.2]}
        scale={1.05}
      />
      <Vessel
        kind="pump"
        color="#a86a2d"
        label={LABELS.lotion}
        position={[1.85, 0, -0.1]}
        rotation={[0, -0.28, 0]}
      />
    </group>
  );
}

/** Dark studio version of the product scene, for the full-bleed hero. */
export default function HeroScene3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0.5, 8], fov: 34 }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#17120e"]} />
      <fog attach="fog" args={["#17120e", 10, 22]} />

      <ambientLight intensity={0.35} />
      <spotLight
        position={[4, 8, 5]}
        angle={0.5}
        penumbra={1}
        intensity={90}
        castShadow
        color="#ffe6c4"
      />
      <directionalLight position={[-6, 3, -4]} intensity={1.1} color="#c98b4b" />

      <Suspense fallback={null}>
        <Trio />
        <ContactShadows
          position={[0, -2.16, 0]}
          opacity={0.75}
          scale={18}
          blur={2.8}
          far={6}
          color="#000000"
        />
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[0, 5, 4]}
            scale={[9, 4, 1]}
            color="#ffdfb5"
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            position={[-6, 1, 2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[7, 7, 1]}
            color="#a86a2d"
          />
          <Lightformer
            form="rect"
            intensity={0.8}
            position={[6, 1, -2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[7, 7, 1]}
            color="#7a4a20"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

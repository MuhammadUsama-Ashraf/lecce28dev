"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Vessel from "./Vessel";
import Motes from "./Motes";

const LABELS = {
  wash: {
    kicker: "Chamomile & Olive Oil",
    title: "Body Wash",
    scent: "Fumo di Cocco",
    body: "A comforting, delightfully foaming cleanser infused with natural Chamomile extract and skin-smoothing Olive Oil.",
    volume: "16 fl. oz. / 473 ml",
  },
  lotion: {
    kicker: "Jojoba Intense Therapy",
    title: "Body Lotion",
    scent: "Fumo di Cocco",
    body: "All that you expect from a professional spa quality lotion. Avocado oil, jojoba oil and aloe vera protect the skin.",
    volume: "16 fl. oz. / 473 ml",
  },
  butter: {
    kicker: "Natural",
    title: "Body Butter",
    scent: "Fumo di Cocco",
    body: "This thick, long-lasting cream moisturizes even the driest skin. Over 98% natural.",
    volume: "8 oz / 227 g",
  },
};

function Trio() {
  const group = useRef<THREE.Group>(null);
  const scroll = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    scroll.current =
      typeof window !== "undefined" ? window.scrollY / (window.innerHeight || 1) : 0;

    const targetY = state.pointer.x * 0.45 + scroll.current * 0.9;
    const targetX = -state.pointer.y * 0.16 + scroll.current * 0.05;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
    g.position.y = THREE.MathUtils.damp(
      g.position.y,
      -1.12 + Math.sin(state.clock.elapsedTime * 0.6) * 0.06,
      3,
      delta,
    );
  });

  return (
    <group ref={group} position={[1.72, -1.12, 0]} scale={0.78}>
      <Vessel
        kind="pump"
        color="#a2662b"
        label={LABELS.wash}
        position={[-1.5, 0, 0.1]}
        rotation={[0, 0.25, 0]}
        scale={0.98}
      />
      <Vessel
        kind="pump"
        color="#9b6230"
        label={LABELS.lotion}
        position={[1.5, 0, -0.15]}
        rotation={[0, -0.3, 0]}
        scale={0.98}
      />
      <Vessel
        kind="jar"
        color="#8b5a2b"
        label={LABELS.butter}
        position={[0, 0, 1.1]}
        rotation={[0, 0.05, 0]}
        scale={1.05}
      />
      <Stone />
    </group>
  );
}

/** The marble slab the bottles are photographed on. */
function Stone() {
  return (
    <mesh position={[0, -0.42, 0.2]} scale={[2.35, 0.36, 1.5]} receiveShadow>
      <sphereGeometry args={[1, 24, 12]} />
      <meshStandardMaterial color="#c4baab" roughness={0.95} metalness={0} flatShading />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.55, 7.6], fov: 34 }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#f3ebe0"]} />
      <fog attach="fog" args={["#f3ebe0", 9, 20]} />

      <ambientLight intensity={0.7} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 2, -3]} intensity={0.7} color="#e6c9a2" />

      <Suspense fallback={null}>
        <Trio />
        <Motes />
        <ContactShadows
          position={[1.72, -1.78, 0.2]}
          opacity={0.4}
          scale={13}
          blur={2.6}
          far={5}
          color="#7a6248"
        />
        {/* Studio lighting built from lightformers — no external HDR fetch. */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2.6}
            position={[0, 4, 3]}
            scale={[8, 4, 1]}
            color="#fff6ea"
          />
          <Lightformer
            form="rect"
            intensity={1.4}
            position={[-5, 1, 2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[6, 6, 1]}
            color="#f0dcc2"
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            position={[5, 1, -2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[6, 6, 1]}
            color="#e8d3b4"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

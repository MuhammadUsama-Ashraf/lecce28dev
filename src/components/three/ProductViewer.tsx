"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  PresentationControls,
} from "@react-three/drei";
import Vessel, { type LabelSpec } from "./Vessel";
import type { Vessel as VesselKind } from "@/content/products";

type Props = {
  vessel: VesselKind;
  color: string;
  /** One label per vessel; bundles reuse the labels of the products inside. */
  labels: LabelSpec[];
};

const TRIO_PLACEMENT = [
  { kind: "pump" as const, position: [-1.15, 0, 0] as [number, number, number], rotation: [0, 0.3, 0] as [number, number, number], scale: 0.86 },
  { kind: "pump" as const, position: [1.15, 0, -0.2] as [number, number, number], rotation: [0, -0.35, 0] as [number, number, number], scale: 0.86 },
  { kind: "jar" as const, position: [0, 0, 0.95] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 0.92 },
];

function Subject({ vessel, color, labels }: Props) {
  if (vessel === "trio") {
    const slots = TRIO_PLACEMENT.slice(0, Math.max(2, Math.min(3, labels.length)));
    return (
      <group position={[0, -1.15, 0]} scale={0.88}>
        {slots.map((slot, i) => (
          <Vessel
            key={i}
            kind={slot.kind}
            color={color}
            label={labels[i] ?? labels[0]}
            position={slot.position}
            rotation={slot.rotation}
            scale={slot.scale}
          />
        ))}
      </group>
    );
  }

  return (
    <Vessel
      kind={vessel}
      color={color}
      label={labels[0]}
      position={[0, vessel === "jar" ? -0.7 : -1.2, 0]}
      scale={vessel === "jar" ? 1.35 : 1}
    />
  );
}

export default function ProductViewer(props: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0.35, 6.6], fov: 36 }}
    >
      <color attach="background" args={["#f3ebe0"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#e6c9a2" />

      <Suspense fallback={null}>
        <PresentationControls
          global
          snap
          rotation={[0, 0.2, 0]}
          polar={[-0.15, 0.25]}
          azimuth={[-0.9, 0.9]}
          speed={1.1}
        >
          <Subject {...props} />
        </PresentationControls>

        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.4}
          scale={12}
          blur={2.4}
          far={4}
          color="#7a6248"
        />
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[0, 4, 3]}
            scale={[8, 4, 1]}
            color="#fff6ea"
          />
          <Lightformer
            form="rect"
            intensity={1.3}
            position={[-5, 1, 2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[6, 6, 1]}
            color="#f0dcc2"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

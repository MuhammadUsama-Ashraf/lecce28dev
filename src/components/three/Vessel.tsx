"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { createLabelTexture } from "./label-texture";

export type LabelSpec = {
  kicker: string;
  title: string;
  scent: string;
  body: string;
  volume: string;
};

const lathe = (pts: [number, number][], segments = 64) =>
  new THREE.LatheGeometry(
    pts.map(([x, y]) => new THREE.Vector2(x, y)),
    segments,
  );

/** Tall pump bottle — matches the 16 oz body wash / lotion silhouette. */
const BOTTLE_PROFILE: [number, number][] = [
  [0.0, 0.0],
  [0.5, 0.0],
  [0.6, 0.03],
  [0.62, 0.1],
  [0.62, 1.72],
  [0.6, 1.86],
  [0.5, 2.02],
  [0.34, 2.14],
  [0.23, 2.2],
  [0.22, 2.34],
  [0.0, 2.34],
];

/** Squat jar — the 8 oz body butter / scrub. */
const JAR_PROFILE: [number, number][] = [
  [0.0, 0.0],
  [0.62, 0.0],
  [0.72, 0.05],
  [0.74, 0.16],
  [0.74, 1.02],
  [0.72, 1.12],
  [0.62, 1.18],
  [0.6, 1.24],
  [0.0, 1.24],
];

type Props = {
  kind: "pump" | "jar";
  color?: string;
  label: LabelSpec;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

export default function Vessel({
  kind,
  color = "#a2662b",
  label,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: Props) {
  const isJar = kind === "jar";

  const glass = useMemo(
    () => lathe(isJar ? JAR_PROFILE : BOTTLE_PROFILE),
    [isJar],
  );

  // Slightly inset solid to read as product inside the amber glass.
  const fill = useMemo(() => {
    const src = isJar ? JAR_PROFILE : BOTTLE_PROFILE;
    return lathe(src.map(([x, y]) => [x * 0.9, y * 0.94] as [number, number]));
  }, [isJar]);

  const labelMap = useMemo(() => createLabelTexture(label), [label]);

  const labelY = isJar ? 0.6 : 0.95;
  const labelH = isJar ? 0.62 : 1.18;
  const labelR = isJar ? 0.745 : 0.628;

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* Amber glass body */}
      <mesh geometry={glass} castShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.14}
          metalness={0}
          transmission={0.92}
          thickness={1.4}
          ior={1.5}
          attenuationColor={color}
          attenuationDistance={1.1}
          clearcoat={1}
          clearcoatRoughness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Product inside */}
      <mesh geometry={fill}>
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          metalness={0}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Wrapped cream label */}
      <mesh position={[0, labelY, 0]}>
        <cylinderGeometry args={[labelR, labelR, labelH, 64, 1, true]} />
        <meshStandardMaterial
          map={labelMap}
          roughness={0.85}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {kind === "pump" ? <PumpCap /> : <JarLid />}
    </group>
  );
}

function PumpCap() {
  return (
    <group position={[0, 2.34, 0]}>
      {/* collar */}
      <mesh castShadow>
        <cylinderGeometry args={[0.235, 0.235, 0.2, 48]} />
        <meshStandardMaterial color="#141210" roughness={0.32} metalness={0.35} />
      </mesh>
      {/* shaft */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 0.44, 32]} />
        <meshStandardMaterial color="#141210" roughness={0.28} metalness={0.4} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.56, 0.02]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.13, 32]} />
        <meshStandardMaterial color="#141210" roughness={0.28} metalness={0.4} />
      </mesh>
      {/* spout */}
      <mesh position={[0, 0.55, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.06, 0.4, 24]} />
        <meshStandardMaterial color="#141210" roughness={0.28} metalness={0.4} />
      </mesh>
    </group>
  );
}

function JarLid() {
  return (
    <mesh position={[0, 1.33, 0]} castShadow>
      <cylinderGeometry args={[0.76, 0.74, 0.22, 64]} />
      <meshStandardMaterial color="#141210" roughness={0.3} metalness={0.35} />
    </mesh>
  );
}

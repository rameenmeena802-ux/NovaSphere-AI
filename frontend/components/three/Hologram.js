'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Hologram() {
  const gridRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate holographic circular rings
    if (ringRef1.current) {
      ringRef1.current.rotation.z = time * 0.1;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -time * 0.15;
    }

    // Gentle wave animation for the floor grid
    if (gridRef.current) {
      gridRef.current.position.y = -2.2 + Math.sin(time * 0.4) * 0.05;
    }
  });

  return (
    <group>
      {/* Horizontal grid plane */}
      <gridHelper
        ref={gridRef}
        args={[30, 30, '#8a2be2', '#0e0b24']}
        position={[0, -2.2, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Floating Holographic Compass Rings */}
      <group position={[0, -2.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={ringRef1}>
          <ringGeometry args={[4.8, 5.0, 32]} />
          <meshBasicMaterial
            color="#00f2fe"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>

        <mesh ref={ringRef2}>
          <ringGeometry args={[5.2, 5.3, 4]} />
          <meshBasicMaterial
            color="#ec4899"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
}

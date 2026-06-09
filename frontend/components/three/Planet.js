'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Ring } from '@react-three/drei';
import * as THREE from 'three';

export default function Planet() {
  const planetRef = useRef();
  const shellRef = useRef();
  const ringsRef = useRef();

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    // Rotate the main planet
    if (planetRef.current) {
      planetRef.current.rotation.y = elapsedTime * 0.15;
      planetRef.current.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;
      // Gentle floating up and down
      planetRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
    }

    // Rotate holographic shell counter-clockwise
    if (shellRef.current) {
      shellRef.current.rotation.y = -elapsedTime * 0.25;
      shellRef.current.rotation.x = -elapsedTime * 0.1;
      shellRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
    }

    // Rotate rings
    if (ringsRef.current) {
      ringsRef.current.rotation.z = elapsedTime * 0.08;
      ringsRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main Core Planet */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1.6, 64, 64]} />
        <MeshDistortMaterial
          color="#030014"
          roughness={0.1}
          metalness={0.9}
          distort={0.25} // wobbles the sphere slightly like liquid neural energy
          speed={1.5}
          emissive="#7c3aed"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Holographic Wireframe Outer Shell */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[1.75, 24, 24]} />
        <meshBasicMaterial
          color="#00f2fe"
          wireframe
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Planet Rings */}
      <group ref={ringsRef} rotation={[Math.PI / 2.5, 0, 0]}>
        {/* Ring 1 - Solid cyber outline */}
        <Ring args={[2.2, 2.3, 64]} receiveShadow>
          <meshBasicMaterial
            color="#8a2be2"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </Ring>

        {/* Ring 2 - Outer glowing grid ring */}
        <Ring args={[2.5, 2.7, 64]}>
          <meshBasicMaterial
            color="#00f2fe"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            wireframe
          />
        </Ring>
      </group>

      {/* Dynamic Ambient Point Lights */}
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00f2fe" />
      <pointLight position={[-5, -5, -5]} intensity={1.5} color="#8a2be2" />
    </group>
  );
}

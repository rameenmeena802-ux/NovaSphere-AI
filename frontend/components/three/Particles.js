'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Particles({ count = 1200 }) {
  const pointsRef = useRef();

  // Create random position coordinates and color scales
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    // Cyber color palette
    const colorPalette = [
      new THREE.Color('#00f2fe'), // Neon Cyan
      new THREE.Color('#4facfe'), // Sky Blue
      new THREE.Color('#8a2be2'), // Violet
      new THREE.Color('#ec4899'), // Hot Pink
    ];

    for (let i = 0; i < count; i++) {
      // Spread coordinates randomly in a box
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      cols[i * 3] = randomColor.r;
      cols[i * 3 + 1] = randomColor.g;
      cols[i * 3 + 2] = randomColor.b;
    }

    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    const { mouse, clock } = state;
    const elapsedTime = clock.getElapsedTime();

    if (pointsRef.current) {
      // Standard drifting animation
      pointsRef.current.rotation.y = elapsedTime * 0.02;
      pointsRef.current.rotation.x = elapsedTime * 0.01;

      // Mouse interactive tilt parallax
      // Interpolate towards mouse target to make it smooth
      const targetX = mouse.x * 0.4;
      const targetY = mouse.y * 0.4;
      
      pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.05;
      pointsRef.current.rotation.x += (targetY - pointsRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

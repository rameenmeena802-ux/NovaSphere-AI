'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from './Planet';
import Particles from './Particles';
import Hologram from './Hologram';

export default function ThreeScene() {
  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 bg-[#030014] overflow-hidden">
      {/* Immersive glowing radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.08)_0%,rgba(3,0,20,1)_70%)] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lights configuration */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#4facfe" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#ec4899" />

        {/* 3D components */}
        <Particles count={1500} />
        <Planet />
        <Hologram />

        {/* Interactive Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}

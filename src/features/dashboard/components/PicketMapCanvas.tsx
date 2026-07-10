"use client";
import React from "react";
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three-stdlib';

function Model() {
  const gltf = useLoader(GLTFLoader, "/3d/DenahCodeLabs.glb");
  return <primitive object={gltf.scene} scale={1.5} />;
}

export default function PicketMapCanvas() {
  return (
    <Canvas camera={{ position: [-30, 20, 0], fov: 50 }} style={{ width: '100vw', height: '100vh', display: 'block' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Model />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}

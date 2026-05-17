// ===== Fitting Room 3D Scene =====
// Canvas + Camera + Lights + OrbitControls + SMPL Mesh
// Dùng @react-three/fiber + @react-three/drei

"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import SMPLMesh from "./SMPLMesh";

interface FittingSceneProps {
  vertices: number[];
  faces: number[];
}

function SceneContent({ vertices, faces }: FittingSceneProps) {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 5, -5]} intensity={0.3} />

      {/* Grid helper — sàn tham chiếu */}
      <gridHelper args={[4, 20, "#ddd", "#eee"]} position={[0, -1.2, 0]} />

      {/* SMPL body mesh — centered */}
      <Center>
        <SMPLMesh vertices={vertices} faces={faces} />
      </Center>

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={6}
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function FittingScene({ vertices, faces }: FittingSceneProps) {
  return (
    <div className="w-full h-full min-h-[500px] bg-gradient-to-b from-slate-100 to-slate-200 rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
      >
        <SceneContent vertices={vertices} faces={faces} />
      </Canvas>
    </div>
  );
}

// ===== SMPL Mesh Component =====
// Render SMPL body mesh trong Three.js scene
// Nhận vertices (flat array) + faces (flat array) → BufferGeometry

"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

interface SMPLMeshProps {
  vertices: number[];  // flat [x0,y0,z0, x1,y1,z1, ...]
  faces: number[];     // flat [i0,j0,k0, i1,j1,k1, ...]
}

export default function SMPLMesh({ vertices, faces }: SMPLMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Vertices → Float32Array position attribute
    const positions = new Float32Array(vertices);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Faces → Uint32Array index
    const indices = new Uint32Array(faces);
    geo.setIndex(new THREE.BufferAttribute(indices, 1));

    // Compute normals cho lighting
    geo.computeVertexNormals();

    return geo;
  }, [vertices, faces]);

  // Cleanup geometry on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#e8b88a"
        roughness={0.6}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

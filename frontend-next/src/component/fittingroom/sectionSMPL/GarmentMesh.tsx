import { useMemo } from "react";
import "@react-three/fiber";
import * as THREE from "three";

interface GarmentMeshProps {
  vertices: number[];
  faces: number[];
  color?: string | [number, number, number, number]; // hex string hoặc RGBA tuple [0..1]
}

/**
 * Render garment mesh (áo/quần) với màu sắc tùy chỉnh.
 * DoubleSide để nhìn cả mặt trong lẫn mặt ngoài khi xoay model.
 */
export default function GarmentMesh({ vertices, faces, color = "#3b82f6" }: GarmentMeshProps) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positionArray = new Float32Array(vertices);
    const indexArray = new Uint32Array(faces);

    g.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
    g.setIndex(new THREE.BufferAttribute(indexArray, 1));
    g.computeVertexNormals();
    return g;
  }, [vertices, faces]);

  // Chuyển đổi color: nếu là mảng RGBA [r,g,b,a] → sang THREE.Color
  const threeColor = useMemo(() => {
    if (Array.isArray(color)) {
      return new THREE.Color(color[0], color[1], color[2]);
    }
    return new THREE.Color(color);
  }, [color]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={threeColor}
        roughness={0.65}
        metalness={0.0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
